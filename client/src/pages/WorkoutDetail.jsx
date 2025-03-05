import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function WorkoutDetail() {
  const { id } = useParams();
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workouts/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setWorkoutData(data);
        setError(null);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workout details:', error);
        setError(error.message || 'Failed to load workout details');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading workout details...</div>;
  
  if (error) return (
    <div className="error-container">
      <h2>Error Loading Workout</h2>
      <p>{error}</p>
      <p>Please make sure your server is running and connected to the database.</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );
  
  if (!workoutData || !workoutData.workout) return <div>Workout not found</div>;

  const { workout, exercises } = workoutData;

  return (
    <div className="workout-detail">
      <Link to="/" className="back-link">← Back to Workouts</Link>
      
      <h1>{workout.title}</h1>
      
      <div className="workout-info">
        <p><strong>Date:</strong> {new Date(workout.date).toLocaleDateString()}</p>
        <p><strong>Duration:</strong> {workout.duration_minutes} minutes</p>
        {workout.description && <p><strong>Description:</strong> {workout.description}</p>}
      </div>
      
      <h2>Exercises</h2>
      
      {!Array.isArray(exercises) || exercises.length === 0 ? (
        <p>No exercises recorded for this workout.</p>
      ) : (
        <div className="exercise-list">
          {exercises.map(exercise => (
            <div key={exercise.id} className="exercise-item">
              <h3>{exercise.name}</h3>
              <div className="exercise-details">
                <p><strong>Sets:</strong> {exercise.sets}</p>
                <p><strong>Reps:</strong> {exercise.reps}</p>
                <p><strong>Weight:</strong> {exercise.weight}kg</p>
                {exercise.notes && <p><strong>Notes:</strong> {exercise.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="workout-actions">
        <Link to={`/workouts/edit/${id}`} className="button edit-button">
          Edit Workout
        </Link>
      </div>
    </div>
  );
}

export default WorkoutDetail;