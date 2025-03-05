import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//browser for exercise information, using ExerciseDB database open source, component reused in pages
function ExerciseBrowser() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  
  const navigate = useNavigate();
  
 //key inside .env, inside .gitignore
  const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
  const RAPID_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com';
  
  const API_OPTIONS = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
    }
  };
  
  // all exercises and metadata (body parts, equipment, target muscles), used api readme
  useEffect(() => {
    
    Promise.all([
      fetchBodyPartsList(),
      fetchEquipmentList(),
      fetchTargetList(),
      fetchAllExercises()
    ]).catch(err => {
      console.error('Error initializing data:', err);
      createExampleExercises(); // Fallback to examples if API calls fail
    });
  }, []);
  
  const fetchBodyPartsList = async () => {
    try {
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises/bodyPartList', API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const bodyPartsList = await response.json();
      setBodyParts(bodyPartsList);
      return bodyPartsList;
    } catch (err) {
      console.error('Error fetching body parts:', err);
      throw err;
    }
  };
  
  const fetchEquipmentList = async () => {
    try {
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises/equipmentList', API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const equipmentList = await response.json();
      setEquipments(equipmentList);
      return equipmentList;
    } catch (err) {
      console.error('Error fetching equipment list:', err);
      throw err;
    }
  };
  
  const fetchTargetList = async () => {
    try {
      const response = await fetch('https://exercisedb.p.rapidapi.com/exercises/targetList', API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const targetList = await response.json();
      setTargetMuscles(targetList);
      return targetList;
    } catch (err) {
      console.error('Error fetching target muscles list:', err);
      throw err;
    }
  };
  
  const fetchAllExercises = async () => {
    try {
      setLoading(true);
      console.log('Fetching all exercises data...');
      
      //  50 exercises to avoid lag
      const url = 'https://exercisedb.p.rapidapi.com/exercises?limit=50';
      
      const response = await fetch(url, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Loaded ${result.length} exercises`);
      
      // store exercises and set filtered exercises
      setExercises(result);
      setFilteredExercises(result);
      setError(null);
      return result;
    } catch (err) {
      console.error('Error fetching exercise data:', err);
      setError(`Failed to load exercises: ${err.message}`);
      // We'll create example exercises in the Promise.all catch block
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExercisesByBodyPart = async (bodyPart) => {
    try {
      setLoading(true);
      console.log(`Fetching exercises for body part: ${bodyPart}`);
      
      const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
      
      const response = await fetch(url, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Loaded ${result.length} exercises for body part: ${bodyPart}`);
      
      setFilteredExercises(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, err);
      setError(`Failed to load exercises: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExercisesByEquipment = async (equipment) => {
    try {
      setLoading(true);
      console.log(`Fetching exercises for equipment: ${equipment}`);
      
      const url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;
      
      const response = await fetch(url, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Loaded ${result.length} exercises for equipment: ${equipment}`);
      
      setFilteredExercises(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching exercises for equipment ${equipment}:`, err);
      setError(`Failed to load exercises: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExercisesByTarget = async (target) => {
    try {
      setLoading(true);
      console.log(`Fetching exercises for target muscle: ${target}`);
      
      const url = `https://exercisedb.p.rapidapi.com/exercises/target/${target}`;
      
      const response = await fetch(url, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Loaded ${result.length} exercises for target muscle: ${target}`);
      
      setFilteredExercises(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching exercises for target muscle ${target}:`, err);
      setError(`Failed to load exercises: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchExercisesByName = async (name) => {
    try {
      setLoading(true);
      console.log(`Fetching exercises for name: ${name}`);
      
      const url = `https://exercisedb.p.rapidapi.com/exercises/name/${name}`;
      
      const response = await fetch(url, API_OPTIONS);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const result = await response.json();
      console.log(`Loaded ${result.length} exercises for name: ${name}`);
      
      setFilteredExercises(result);
      setError(null);
    } catch (err) {
      console.error(`Error fetching exercises for name ${name}:`, err);
      setError(`Failed to load exercises: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const createExampleExercises = () => {
    const exampleExercises = [
      {
        id: 'example1',
        name: 'Bench Press',
        bodyPart: 'chest',
        equipment: 'barbell',
        gifUrl: 'https://via.placeholder.com/400x300?text=Bench+Press',
        instructions: [
          'Lie on a flat bench with your feet on the ground.',
          'Grip the barbell with hands slightly wider than shoulder-width.',
          'Lower the bar to your mid-chest.',
          'Press the bar back up to the starting position.'
        ],
        target: 'pectorals',
        secondaryMuscles: ['triceps', 'shoulders']
      },
      {
        id: 'example2',
        name: 'Squat',
        bodyPart: 'upper legs',
        equipment: 'body weight',
        gifUrl: 'https://via.placeholder.com/400x300?text=Squat',
        instructions: [
          'Stand with feet shoulder-width apart.',
          'Lower your body by bending your knees and hips.',
          'Keep your back straight and heels on the floor.',
          'Return to standing position.'
        ],
        target: 'quads',
        secondaryMuscles: ['glutes', 'hamstrings']
      },
      {
        id: 'example3',
        name: 'Pull-up',
        bodyPart: 'back',
        equipment: 'body weight',
        gifUrl: 'https://via.placeholder.com/400x300?text=Pull+Up',
        instructions: [
          'Hang from a pull-up bar with palms facing away from you.',
          'Pull your body up until your chin is over the bar.',
          'Lower your body back to the starting position.',
          'Repeat for desired reps.'
        ],
        target: 'lats',
        secondaryMuscles: ['biceps', 'forearms']
      },
      {
        id: 'example4',
        name: 'Dumbbell Curl',
        bodyPart: 'upper arms',
        equipment: 'dumbbell',
        gifUrl: 'https://via.placeholder.com/400x300?text=Dumbbell+Curl',
        instructions: [
          'Stand with a dumbbell in each hand, arms fully extended.',
          'Keep elbows close to your torso.',
          'Curl the weights up to shoulder level.',
          'Lower back down with control.'
        ],
        target: 'biceps',
        secondaryMuscles: ['forearms']
      },
      {
        id: 'example5',
        name: 'Shoulder Press',
        bodyPart: 'shoulders',
        equipment: 'dumbbell',
        gifUrl: 'https://via.placeholder.com/400x300?text=Shoulder+Press',
        instructions: [
          'Sit on a bench with back support.',
          'Hold a dumbbell in each hand at shoulder height.',
          'Press the weights up until arms are extended overhead.',
          'Lower the weights back to shoulder level.'
        ],
        target: 'deltoids',
        secondaryMuscles: ['triceps', 'traps']
      }
    ];
    
    setExercises(exampleExercises);
    setFilteredExercises(exampleExercises);
    setBodyParts(['chest', 'upper legs', 'back', 'upper arms', 'shoulders']);
    setEquipments(['barbell', 'body weight', 'dumbbell']);
    setTargetMuscles(['pectorals', 'quads', 'lats', 'biceps', 'deltoids']);
    setError('The exercise API requires authentication. Using example exercises for demonstration.');
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    try {
      // reset selected exercise  searching/filtering
      setSelectedExercise(null);
      
      if (searchTerm) {
        // search by name, muscl;e, etc using the API
        fetchExercisesByName(searchTerm);
      } else if (selectedBodyPart) {
        fetchExercisesByBodyPart(selectedBodyPart);
      } else if (selectedEquipment) {
        fetchExercisesByEquipment(selectedEquipment);
      } else if (selectedTarget) {
        fetchExercisesByTarget(selectedTarget);
      } else {
        setFilteredExercises(exercises);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error searching exercises:', err);
      setError('Error filtering exercises: ' + err.message);
      setLoading(false);
    }
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setSelectedTarget('');
    setFilteredExercises(exercises);
    setSelectedExercise(null);
  };
  
  const handleExerciseClick = (exercise) => {
    console.log('Selected exercise:', exercise);
    
    // clear any previous selection and set the new one
    setSelectedExercise(null);
    
    // use setTimeout to ensure the previous selection is cleared before setting the new one
    setTimeout(() => {
      setSelectedExercise(exercise);
    }, 50);
  };
  
  const addToNewWorkout = () => {
    if (selectedExercise) {
      const exerciseData = {
        id: selectedExercise.id,
        name: selectedExercise.name,
        bodyPart: selectedExercise.bodyPart || '',
        equipment: selectedExercise.equipment || ''
      };
      
      localStorage.setItem('selectedExercise', JSON.stringify(exerciseData));
      navigate('/create');
    }
  };
  
  // Placeholder for images that fail to load
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Exercise+Image';
  };

  return (
    <div className="exercise-browser">
      <h1>Exercise Browser</h1>
      
      {error && (
        <div className="error-message" style={{ color: '#856404', marginBottom: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeeba' }}>
          <p>{error}</p>
        </div>
      )}
      
      <form className="search-form" onSubmit={handleSearch}>
        <div className="search-row">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={selectedBodyPart}
            onChange={(e) => {
              setSelectedBodyPart(e.target.value);
              setSelectedEquipment('');
              setSelectedTarget('');
            }}
            className="filter-select"
            disabled={bodyParts.length === 0}
          >
            <option value="">All Body Parts</option>
            {bodyParts.map((part, index) => (
              <option key={index} value={part}>
                {part}
              </option>
            ))}
          </select>
          
          <select
            value={selectedEquipment}
            onChange={(e) => {
              setSelectedEquipment(e.target.value);
              setSelectedBodyPart('');
              setSelectedTarget('');
            }}
            className="filter-select"
            disabled={equipments.length === 0}
          >
            <option value="">All Equipment</option>
            {equipments.map((equipment, index) => (
              <option key={index} value={equipment}>
                {equipment}
              </option>
            ))}
          </select>
          
          <select
            value={selectedTarget}
            onChange={(e) => {
              setSelectedTarget(e.target.value);
              setSelectedBodyPart('');
              setSelectedEquipment('');
            }}
            className="filter-select"
            disabled={targetMuscles.length === 0}
          >
            <option value="">All Target Muscles</option>
            {targetMuscles.map((target, index) => (
              <option key={index} value={target}>
                {target}
              </option>
            ))}
          </select>
        </div>
        
        <div className="search-actions">
          <button type="submit" className="search-button">
            Search
          </button>
          <button type="button" onClick={resetFilters} className="reset-button">
            Reset Filters
          </button>
        </div>
      </form>
      
      <div className="results-container">
        <div className="exercise-list">
          <h2>Results ({filteredExercises.length})</h2>
          
          {loading ? (
            <p>Loading exercises...</p>
          ) : filteredExercises.length === 0 ? (
            <p>No exercises found. Try different search terms or filters.</p>
          ) : (
            <ul>
              {filteredExercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className={`exercise-item ${selectedExercise && selectedExercise.id === exercise.id ? 'selected' : ''}`}
                  onClick={() => handleExerciseClick(exercise)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: selectedExercise && selectedExercise.id === exercise.id ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: '4px',
                    borderLeft: selectedExercise && selectedExercise.id === exercise.id ? '4px solid #2196f3' : 'none'
                  }}
                >
                  <h3>{exercise.name}</h3>
                  <p>Body Part: {exercise.bodyPart || 'Unknown'}</p>
                  <p>Equipment: {exercise.equipment || 'Unknown'}</p>
                  <p>Target: {exercise.target || 'Unknown'}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {selectedExercise && (
          <div className="exercise-details">
            <h2>{selectedExercise.name}</h2>
            
            <div className="exercise-gif">
              {selectedExercise.gifUrl ? (
                <img 
                  src={selectedExercise.gifUrl + '?' + Date.now()} // Add timestamp to force refresh
                  alt={selectedExercise.name} 
                  onError={handleImageError}
                  style={{ maxWidth: '100%', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: '8px'
                }}>
                  No image available
                </div>
              )}
            </div>
            
            <div className="info-section">
              <h3>Instructions</h3>
              {Array.isArray(selectedExercise.instructions) && selectedExercise.instructions.length > 0 ? (
                <ol className="instructions">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              ) : (
                <p>No instructions available for this exercise.</p>
              )}
            </div>
            
            <div className="info-section">
              <h3>Details</h3>
              <ul className="details-list" style={{ listStyleType: 'none', padding: 0 }}>
                <li><strong>Target Muscle:</strong> {selectedExercise.target || 'Unknown'}</li>
                <li><strong>Body Part:</strong> {selectedExercise.bodyPart || 'Unknown'}</li>
                <li><strong>Equipment:</strong> {selectedExercise.equipment || 'Unknown'}</li>
                <li><strong>Secondary Muscles:</strong> {Array.isArray(selectedExercise.secondaryMuscles) ? selectedExercise.secondaryMuscles.join(', ') : 'Unknown'}</li>
              </ul>
            </div>
            
            <button
              onClick={addToNewWorkout}
              className="add-to-workout-btn"
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                marginTop: '20px'
              }}
            >
              Add to New Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExerciseBrowser;