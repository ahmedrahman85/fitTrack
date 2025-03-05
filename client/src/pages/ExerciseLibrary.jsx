import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { darjeelingPalette, flatUI, typography } from '../utils/flatstyles'; // Import typography here
import { capitaliseWords, formatBodyPart, formatEquipment, formatTarget } from '../utils/capitalise';

function ExerciseLibrary() {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [equipments, setEquipments] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [targetMuscles, setTargetMuscles] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [useLocalData, setUseLocalData] = useState(false);
  
  // access environment variables using Vite's import.meta.env
  const RAPID_API_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
  const RAPID_API_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com';
  
  const API_OPTIONS = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPID_API_KEY,
      'x-rapidapi-host': RAPID_API_HOST
    }
  };

  // exerciseLibrary component styles
  const styles = {
    container: {
      ...flatUI.container,
      padding: 0,
    },
    header: {
      ...typography.h1,
      margin: '0 0 24px 0',
    },
    error: {
      padding: '12px',
      marginBottom: '16px',
      backgroundColor: '#fff3cd',
      color: '#856404',
      border: 'none',
    },
    retryButton: {
      ...flatUI.secondaryButton,
      marginTop: '8px',
    },
    searchSection: {
      ...flatUI.card,
      marginBottom: '16px',
    },
    searchTitle: {
      ...typography.h2,
      margin: '0 0 12px 0',
    },
    searchForm: {
      ...flatUI.flexRow,
      gap: '8px',
      marginBottom: '12px',
    },
    searchInput: {
      ...flatUI.input,
      flexGrow: 1,
    },
    searchButton: {
      ...flatUI.primaryButton,
    },
    resetButton: {
      ...flatUI.secondaryButton,
    },
    categoriesSection: {
      ...flatUI.card,
      marginBottom: '16px',
    },
    categoryTitle: {
      ...typography.h2,
      margin: '0 0 16px 0',
    },
    subCategoryTitle: {
      ...typography.h3,
      margin: '0 0 8px 0',
    },
    buttonGroup: {
      ...flatUI.flexRow,
      ...flatUI.flexWrap,
      gap: '8px',
      marginBottom: '16px',
    },
    categoryButton: {
      padding: '8px 12px',
      backgroundColor: '#f1f1f1',
      color: darjeelingPalette.text,
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    },
    selectedBodyPartButton: {
      backgroundColor: darjeelingPalette.primary,
      color: 'white',
    },
    selectedEquipmentButton: {
      backgroundColor: darjeelingPalette.secondary, 
      color: 'white',
    },
    selectedTargetButton: {
      backgroundColor: darjeelingPalette.accent,
      color: 'white',
    },
    exercisesSection: {
      ...flatUI.card,
    },
    exercisesHeader: {
      ...typography.h2,
      margin: '0 0 16px 0',
    },
    exerciseGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
      alignItems: 'stretch',
    },
    exerciseCard: {
      backgroundColor: darjeelingPalette.light,
      padding: '16px',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    exerciseTitle: {
      ...typography.h3,
      margin: '0 0 12px 0',
    },
    imageContainer: {
      height: '200px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: '12px',
    },
    exerciseImage: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
    exerciseDetails: {
      marginBottom: '12px',
      flexGrow: 1,
    },
    detailItem: {
      margin: '4px 0',
      fontSize: '14px',
    },
    addButton: {
      ...flatUI.primaryButton,
      width: '100%',
      marginTop: 'auto',
    },
    loadingContainer: {
      ...flatUI.card,
      textAlign: 'center',
      padding: '32px 16px',
      marginTop: '20px',
    },
    loadingTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: darjeelingPalette.dark,
      margin: '0 0 8px 0',
    },
  };

  // example exercises for fallback when the API fails
  const exampleExercises = [
    {
      id: 'ex1',
      name: 'Bench Press',
      bodyPart: 'chest',
      equipment: 'barbell',
      target: 'pectorals',
      gifUrl: 'https://via.placeholder.com/400x300?text=Bench+Press',
      description: 'A compound exercise that targets the chest, shoulders, and triceps.'
    },
    {
      id: 'ex2',
      name: 'Squat',
      bodyPart: 'upper legs',
      equipment: 'barbell',
      target: 'quads',
      gifUrl: 'https://via.placeholder.com/400x300?text=Squat',
      description: 'A compound exercise that primarily targets the quadriceps, hamstrings, and glutes.'
    },
    {
      id: 'ex3',
      name: 'Deadlift',
      bodyPart: 'upper legs',
      equipment: 'barbell',
      target: 'glutes',
      gifUrl: 'https://via.placeholder.com/400x300?text=Deadlift',
      description: 'A compound exercise that targets the lower back, hamstrings, and glutes.'
    },
    {
      id: 'ex4',
      name: 'Pull-up',
      bodyPart: 'back',
      equipment: 'body weight',
      target: 'lats',
      gifUrl: 'https://via.placeholder.com/400x300?text=Pull+Up',
      description: 'An upper body exercise that targets the back and biceps.'
    },
    {
      id: 'ex5',
      name: 'Push-up',
      bodyPart: 'chest',
      equipment: 'body weight',
      target: 'pectorals',
      gifUrl: 'https://via.placeholder.com/400x300?text=Push+Up',
      description: 'A compound exercise that targets the chest, shoulders, and triceps.'
    },
    {
      id: 'ex6',
      name: 'Dumbbell Curl',
      bodyPart: 'upper arms',
      equipment: 'dumbbell',
      target: 'biceps',
      gifUrl: 'https://via.placeholder.com/400x300?text=Dumbbell+Curl',
      description: 'An isolation exercise that targets the biceps.'
    },
    {
      id: 'ex7',
      name: 'Tricep Extension',
      bodyPart: 'upper arms',
      equipment: 'cable',
      target: 'triceps',
      gifUrl: 'https://via.placeholder.com/400x300?text=Tricep+Extension',
      description: 'An isolation exercise that targets the triceps.'
    },
    {
      id: 'ex8',
      name: 'Lateral Raise',
      bodyPart: 'shoulders',
      equipment: 'dumbbell',
      target: 'delts',
      gifUrl: 'https://via.placeholder.com/400x300?text=Lateral+Raise',
      description: 'An isolation exercise that targets the lateral deltoids.'
    },
    {
      id: 'ex9',
      name: 'Plank',
      bodyPart: 'waist',
      equipment: 'body weight',
      target: 'abs',
      gifUrl: 'https://via.placeholder.com/400x300?text=Plank',
      description: 'A static exercise that targets the core muscles.'
    },
    {
      id: 'ex10',
      name: 'Russian Twist',
      bodyPart: 'waist',
      equipment: 'medicine ball',
      target: 'abs',
      gifUrl: 'https://via.placeholder.com/400x300?text=Russian+Twist',
      description: 'A rotational exercise that targets the obliques.'
    },
    {
      id: 'ex11',
      name: 'Leg Press',
      bodyPart: 'upper legs',
      equipment: 'machine',
      target: 'quads',
      gifUrl: 'https://via.placeholder.com/400x300?text=Leg+Press',
      description: 'A compound exercise that targets the quadriceps, hamstrings, and glutes.'
    },
    {
      id: 'ex12',
      name: 'Treadmill Running',
      bodyPart: 'cardio',
      equipment: 'machine',
      target: 'cardiovascular system',
      gifUrl: 'https://via.placeholder.com/400x300?text=Treadmill',
      description: 'A cardiovascular exercise that involves walking or running on a moving platform.'
    }
  ];

  // initialise data and fetch from API on component mount
  useEffect(() => {
    // skip API calls if we using local data
    if (useLocalData) {
      loadExampleExercises();
      return;
    }

    // initialise data: fetch body parts, equipment, target muscles, and exercises
    Promise.all([
      fetchBodyPartsList(),
      fetchEquipmentList(),
      fetchTargetList(),
      fetchAllExercises()
    ]).catch(err => {
      console.error('Error initializing data:', err);
      loadExampleExercises(); // fallback to examples if API calls fail
    });
  }, [useLocalData]);

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
      
      // limit to 50 exercises to avoid performance issues
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
      setLoading(false);
      return result;
    } catch (err) {
      console.error('Error fetching exercise data:', err);
      setError(`Failed to load exercises: ${err.message}`);
      throw err;
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

  const loadExampleExercises = () => {
    console.log('Using example exercise data as fallback');
    setExercises(exampleExercises);
    setFilteredExercises(exampleExercises);
    
    // extract unique body parts, equipment, and targets from example data
    const uniqueBodyParts = [...new Set(exampleExercises.map(ex => ex.bodyPart))].filter(Boolean);
    const uniqueEquipment = [...new Set(exampleExercises.map(ex => ex.equipment))].filter(Boolean);
    const uniqueTargets = [...new Set(exampleExercises.map(ex => ex.target))].filter(Boolean);
    
    setBodyParts(uniqueBodyParts);
    setEquipments(uniqueEquipment);
    setTargetMuscles(uniqueTargets);
    
    setUseLocalData(true);
    setError('Could not connect to exercise database. Using example data.');
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    // reset selected filters
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setSelectedTarget('');
    
    if (searchTerm.trim() !== '') {
      fetchExercisesByName(searchTerm);
    } else {
      // if search is empty, show all exercises
      setFilteredExercises(exercises);
    }
  };

  const handleBodyPartFilter = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    setSelectedEquipment('');
    setSelectedTarget('');
    setSearchTerm('');
    fetchExercisesByBodyPart(bodyPart);
  };

  const handleEquipmentFilter = (equipment) => {
    setSelectedEquipment(equipment);
    setSelectedBodyPart('');
    setSelectedTarget('');
    setSearchTerm('');
    fetchExercisesByEquipment(equipment);
  };

  const handleTargetFilter = (target) => {
    setSelectedTarget(target);
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setSearchTerm('');
    fetchExercisesByTarget(target);
  };

  const resetFilters = () => {
    setSelectedBodyPart('');
    setSelectedEquipment('');
    setSelectedTarget('');
    setSearchTerm('');
    setFilteredExercises(exercises);
  };
  
  const handleRetry = () => {
    setUseLocalData(false);
    setError(null);
    setLoading(true);
    
    Promise.all([
      fetchBodyPartsList(),
      fetchEquipmentList(),
      fetchTargetList(),
      fetchAllExercises()
    ]).catch(err => {
      console.error('Error retrying data fetch:', err);
      loadExampleExercises();
    });
  };

  // handle image errors
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Exercise+Image';
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2 style={styles.loadingTitle}>Loading Exercise Library</h2>
        <p>Please wait while we fetch the exercises...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Exercise Library</h1>
      
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button 
            onClick={handleRetry}
            style={styles.retryButton}
          >
            Retry Connection
          </button>
        </div>
      )}
      
      {/* Search form */}
      <div style={styles.searchSection}>
        <h2 style={styles.searchTitle}>Search Exercises</h2>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button 
            type="submit"
            style={styles.searchButton}
          >
            Search
          </button>
          <button 
            type="button"
            onClick={resetFilters}
            style={styles.resetButton}
          >
            Reset
          </button>
        </form>
      </div>
      
      {/* Categories tabs */}
      <div style={styles.categoriesSection}>
        <h2 style={styles.categoryTitle}>Categories</h2>
        
        <h3 style={styles.subCategoryTitle}>Body Parts</h3>
        <div style={styles.buttonGroup}>
          {bodyParts.length > 0 ? (
            bodyParts.map((bodyPart, index) => (
              <button
                key={index}
                onClick={() => handleBodyPartFilter(bodyPart)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedBodyPart === bodyPart ? styles.selectedBodyPartButton : {})
                }}
              >
                {formatBodyPart(bodyPart)}
              </button>
            ))
          ) : (
            <p>No body parts found.</p>
          )}
        </div>
        
        <h3 style={styles.subCategoryTitle}>Equipment</h3>
        <div style={styles.buttonGroup}>
          {equipments.length > 0 ? (
            equipments.map((equipment, index) => (
              <button
                key={index}
                onClick={() => handleEquipmentFilter(equipment)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedEquipment === equipment ? styles.selectedEquipmentButton : {})
                }}
              >
                {formatEquipment(equipment)}
              </button>
            ))
          ) : (
            <p>No equipment types found.</p>
          )}
        </div>
        
        <h3 style={styles.subCategoryTitle}>Target Muscles</h3>
        <div style={styles.buttonGroup}>
          {targetMuscles.length > 0 ? (
            targetMuscles.map((target, index) => (
              <button
                key={index}
                onClick={() => handleTargetFilter(target)}
                style={{
                  ...styles.categoryButton,
                  ...(selectedTarget === target ? styles.selectedTargetButton : {})
                }}
              >
                {formatTarget(target)}
              </button>
            ))
          ) : (
            <p>No target muscles found.</p>
          )}
        </div>
      </div>
      
      {/* exercise results grid */}
      <div style={styles.exercisesSection}>
        <h2 style={styles.exercisesHeader}>
          Exercises 
          {filteredExercises.length > 0 && ` (${filteredExercises.length})`}
          {selectedBodyPart && ` - Body Part: ${formatBodyPart(selectedBodyPart)}`}
          {selectedEquipment && ` - Equipment: ${formatEquipment(selectedEquipment)}`}
          {selectedTarget && ` - Target: ${formatTarget(selectedTarget)}`}
          {searchTerm && ` - Search: "${searchTerm}"`}
        </h2>
        
        {filteredExercises.length > 0 ? (
          <div style={styles.exerciseGrid}>
            {filteredExercises.map(exercise => (
              <div 
                key={exercise.id} 
                style={styles.exerciseCard}
              >
                <h3 style={styles.exerciseTitle}>{capitaliseWords(exercise.name)}</h3>
                
                {exercise.gifUrl && (
                  <div style={styles.imageContainer}>
                    <img 
                      src={exercise.gifUrl} 
                      alt={exercise.name}
                      onError={handleImageError}
                      style={styles.exerciseImage}
                    />
                  </div>
                )}
                
                <div style={styles.exerciseDetails}>
                  <p style={styles.detailItem}><strong>Body Part:</strong> {formatBodyPart(exercise.bodyPart)}</p>
                  <p style={styles.detailItem}><strong>Equipment:</strong> {formatEquipment(exercise.equipment)}</p>
                  <p style={styles.detailItem}><strong>Target Muscle:</strong> {formatTarget(exercise.target)}</p>
                  {exercise.description && <p style={styles.detailItem}>{exercise.description}</p>}
                </div>
                
                <button 
                  onClick={() => {
                    // store selected exercise in localStorage to be accessed from CreateWorkout
                    const exerciseData = {
                      id: exercise.id,
                      name: exercise.name,
                      bodyPart: exercise.bodyPart || '',
                      equipment: exercise.equipment || ''
                    };
                    localStorage.setItem('selectedExercise', JSON.stringify(exerciseData));
                    // navigate to create workout page
                    window.location.href = '/create';
                  }}
                  style={styles.addButton}
                >
                  Add to Workout
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No exercises found. Try different search terms or filters.</p>
        )}
      </div>
    </div>
  );
}

export default ExerciseLibrary;