import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkoutService from '../services/ExerciseDBService';

function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration_minutes: 0
  });
  
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const workoutService = new WorkoutService();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // fetch all available exercises
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exercises`);
        if (!response.ok) {
          throw new Error('Failed to fetch exercises');
        }
        const exercisesData = await response.json();
        setExercises(exercisesData);
        
        // fetch the workout to edit
        const workoutData = await workoutService.getWorkoutById(id);
        
        // set form data
        setFormData({
          title: workoutData.title,
          description: workoutData.description || '',
          date: workoutData.date,
          duration_minutes: workoutData.durationMinutes
        });
        
        // set selected exercises
        if (workoutData.exercises && workoutData.exercises.length > 0) {
          setSelectedExercises(workoutData.exercises.map(ex => ({
            id: ex.id,
            exercise_id: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            notes: ex.notes || ''
          })));
        } else {
          // default empty exercise if none exist
          setSelectedExercises([
            { exercise_id: '', sets: 3, reps: 10, weight: 0, notes: '' }
          ]);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching workout data:', err);
        setError('Failed to load workout data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value});
  };
  
  const handleExerciseChange = (index, field, value) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {...updatedExercises[index], [field]: value};
    setSelectedExercises(updatedExercises);
  };
  
  const addExerciseField = () => {
    setSelectedExercises([
      ...selectedExercises,
      { exercise_id: '', sets: 3, reps: 10, weight: 0, notes: '' }
    ]);
  };
  
  const removeExerciseField = (index) => {
    if (selectedExercises.length > 1) {
      setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // update workout details
      const updatedWorkoutResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!updatedWorkoutResponse.ok) {
        throw new Error('Failed to update workout');
      }
      
      // first delete all existing workout exercises
      await fetch(`${import.meta.env.VITE_API_URL}/api/workout-exercises/${id}`, {
        method: 'DELETE',
      });
      
      // then add all the current exercises
      for (const exercise of selectedExercises) {
        if (!exercise.exercise_id) continue;
        
        await fetch(`${import.meta.env.VITE_API_URL}/api/workout-exercises`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            workout_id: id,
            ...exercise
          }),
        });
      }
      
      // navigate back to the workout detail page
      navigate(`/workouts/${id}`);
    } catch (err) {
      console.error('Error updating workout:', err);
      setError('Failed to update workout. Please try again.');
    }
  };
  
  if (loading) return <div>Loading workout data...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="edit-workout">
      <h1>Edit Workout</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Workout Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration_minutes">Duration (minutes)</label>
            <input
              type="number"
              id="duration_minutes"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              required
              min="1"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <h2>Exercises</h2>
        
        {selectedExercises.map((exercise, index) => (
          <div key={index} className="exercise-inputs">
            <div className="form-row">
              <div className="form-group">
                <label>Exercise</label>
                <select
                  value={exercise.exercise_id}
                  onChange={(e) => handleExerciseChange(index, 'exercise_id', e.target.value)}
                  required
                >
                  <option value="">Select Exercise</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                type="button"
                className="remove-exercise"
                onClick={() => removeExerciseField(index)}
              >
                Remove
              </button>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Sets</label>
                <input
                  type="number"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>Reps</label>
                <input
                  type="number"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, 'weight', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Notes</label>
              <textarea
                value={exercise.notes}
                onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)}
              />
            </div>
          </div>
        ))}
        
        <button
          type="button"
          className="add-exercise-btn"
          onClick={addExerciseField}
        >
          + Add Another Exercise
        </button>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">Update Workout</button>
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigate(`/workouts/${id}`)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditWorkout;