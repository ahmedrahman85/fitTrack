import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// gET endpoints
app.get('/api/workouts', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.*, COUNT(we.id) as exercise_count 
      FROM workouts w
      LEFT JOIN workout_exercises we ON w.id = we.workout_id
      GROUP BY w.id
      ORDER BY w.date DESC
    `);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/workouts/:id', async (req, res) => {
    try {
        const workoutResult = await pool.query(`
            SELECT * FROM workouts WHERE id = $1
        `, [req.params.id]);

        const exerciseResult = await pool.query(`
            SELECT we.*, e.name, e.category
            FROM workout_exercises we
            JOIN exercises e ON we.exercise_id = e.id
            WHERE we.workout_id = $1
        `, [req.params.id]); // Fixed: Changed 'workout id' to 'workout_id' and parameter from 'category' to 'id'

        res.json({
            workout: workoutResult.rows[0],
            exercises: exerciseResult.rows // Fixed: Changed 'exercisesResult' to 'exerciseResult'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/exercises', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM exercises ORDER BY name');
        res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message});    
    }
});

// category filter endpoint
app.get('/api/workouts/category/:category', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT w.*
            FROM workouts w
            JOIN workout_exercises we ON w.id = we.workout_id
            JOIN exercises e ON we.exercise_id = e.id
            WHERE e.category = $1
        `, [req.params.category]);
            
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// POST endpoints
app.post('/api/workouts', async (req, res) => {
    const { user_id, title, description, date, duration_minutes } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO workouts (user_id, title, description, date, duration_minutes)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [user_id, title, description, date, duration_minutes]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.post('/api/workout-exercises', async (req, res) => {
    const { workout_id, exercise_id, sets, reps, weight, notes } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [workout_id, exercise_id, sets, reps, weight, notes]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// delete endpoint
app.delete('/api/workouts/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM workouts WHERE id = $1', [req.params.id]);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});
//update Workout

app.put('/api/workouts/:id', async (req, res) => {
    const { title, description, date, duration_minutes } = req.body;
    
    try {
      const result = await pool.query(`
        UPDATE workouts
        SET title = $1, description = $2, date = $3, duration_minutes = $4
        WHERE id = $5
        RETURNING *
      `, [title, description, date, duration_minutes, req.params.id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Workout not found' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // delete all workout exercises
  app.delete('/api/workout-exercises/:workoutId', async (req, res) => {
    try {
      await pool.query('DELETE FROM workout_exercises WHERE workout_id = $1', [req.params.workoutId]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // get exercises by category
  app.get('/api/exercises/category/:category', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM exercises WHERE category = $1 ORDER BY name',
        [req.params.category]
      );
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
// like functionality
app.post('/api/workouts/:id/like', async (req, res) => {
    try {
        const result = await pool.query(`
            UPDATE workouts
            SET likes = COALESCE(likes, 0) + 1
            WHERE id = $1
            RETURNING id, likes
        `, [req.params.id]);

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// add this to your server.js file

// add more verbose error handling to the /api/workouts endpoint
app.get('/api/workouts', async (req, res) => {
    try {
      console.log('GET /api/workouts - Starting request');
      
      // check db connection
      try {
        await pool.query('SELECT 1');
        console.log('Database connection successful');
      } catch (dbError) {
        console.error('Database connection failed:', dbError);
        return res.status(500).json({ 
          error: 'Database connection error', 
          details: dbError.message 
        });
      }
      
      // proceed with the actual query
      console.log('Executing workout query');
      const result = await pool.query(`
        SELECT w.*, COUNT(we.id) as exercise_count 
        FROM workouts w
        LEFT JOIN workout_exercises we ON w.id = we.workout_id
        GROUP BY w.id
        ORDER BY w.date DESC
      `);
      
      console.log(`Query successful, returning ${result.rows.length} workouts`);
      res.json(result.rows);
    } catch (error) {
      console.error('Error in /api/workouts endpoint:', error);
      res.status(500).json({ 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });