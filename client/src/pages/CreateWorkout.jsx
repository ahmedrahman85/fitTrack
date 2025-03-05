import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams for getting workoutId
import { createClient } from "@supabase/supabase-js";

// access Supabase environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

function CreateWorkout() {
  const navigate = useNavigate();
  const { workoutId } = useParams(); // use workoutId from URL if in edit mode
  const isEditMode = !!workoutId;
  
  const [workoutName, setWorkoutName] = useState("");
  const [workoutDate, setWorkoutDate] = useState("");
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode); // show initial loading in edit mode
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // fetch existing workout data if in edit mode
  useEffect(() => {
    const fetchWorkoutData = async () => {
      if (!workoutId) return; // skip if not in edit mode
      
      try {
        setInitialLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from("workouts")
          .select("*")
          .eq("id", workoutId)
          .single();
        
        if (error) throw error;
        
        if (data) {
          // populate form with existing workout data
          setWorkoutName(data.name || "");
          setWorkoutDate(data.date || "");
          
          // convert exercises to the required format
          const formattedExercises = data.exercises.map(exercise => ({
            id: exercise.exerciseId,
            name: exercise.name,
            bodyPart: exercise.bodyPart || "",
            equipment: exercise.equipment || "",
            sets: exercise.sets.map(set => ({
              setNumber: set.setNumber,
              weight: set.weight ? set.weight.toString() : "",
              reps: set.reps ? set.reps.toString() : "",
              completed: set.completed || false
            }))
          }));
          
          setSelectedExercises(formattedExercises);
        } else {
          setError("Workout not found");
          navigate("/workouts");
        }
      } catch (err) {
        console.error("Error fetching workout:", err);
        setError(`Failed to load workout: ${err.message}`);
      } finally {
        setInitialLoading(false);
      }
    };
    
    if (isEditMode) {
      fetchWorkoutData();
    } else {
      // initialise with todays date for new workouts
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0];
      setWorkoutDate(formattedDate);
    }
  }, [workoutId, isEditMode, navigate]);

  // init with today's date and load workout name from localStorage (only for new workouts!!)
  useEffect(() => {
    if (!isEditMode) {
      // load workout name from localStorage
      const savedWorkoutName = localStorage.getItem("workoutName");
      if (savedWorkoutName) {
        setWorkoutName(savedWorkoutName);
      }
    }

    // check for exercise from localStorage if coming from exercise browser -->
    const savedExercise = localStorage.getItem("selectedExercise");
    if (savedExercise) {
      try {
        const exerciseData = JSON.parse(savedExercise);
        addExercise(exerciseData);
        localStorage.removeItem("selectedExercise");
      } catch (err) {
        console.error("Error parsing saved exercise:", err);
      }
    }
  }, [isEditMode]);

  // save workout name to localStorage whenever it changes for new workouts)
  useEffect(() => {
    if (!isEditMode) {
      localStorage.setItem("workoutName", workoutName);
    }
  }, [workoutName, isEditMode]);

  // add exercise to the workout
  const addExercise = (exercise) => {
    const newExercise = {
      id: exercise.id,
      name: exercise.name,
      bodyPart: exercise.bodyPart || "",
      equipment: exercise.equipment || "",
      sets: [{ setNumber: 1, weight: "", reps: "", completed: false }],
    };

    setSelectedExercises((prev) => [...prev, newExercise]);
  };

  // add a new set to an exercise
  const addSet = (exerciseIndex) => {
    setSelectedExercises((prev) => {
      const updated = [...prev];
      const currentSets = updated[exerciseIndex].sets;
      const newSetNumber = currentSets.length + 1;

      updated[exerciseIndex].sets.push({
        setNumber: newSetNumber,
        weight: "",
        reps: "",
        completed: false,
      });

      return updated;
    });
  };

  // handle removing an exercise
  const removeExercise = (exerciseIndex) => {
    setSelectedExercises((prev) =>
      prev.filter((_, index) => index !== exerciseIndex)
    );
  };

  // handle removing a set
  const removeSet = (exerciseIndex, setIndex) => {
    setSelectedExercises((prev) => {
      const updated = [...prev];

      // remove the set
      updated[exerciseIndex].sets.splice(setIndex, 1);

      // re-number the sets
      updated[exerciseIndex].sets.forEach((set, idx) => {
        set.setNumber = idx + 1;
      });

      return updated;
    });
  };

  // update set data (weight, reps, completed status)
  const updateSetData = (exerciseIndex, setIndex, field, value) => {
    setSelectedExercises((prev) => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex][field] = value;
      return updated;
    });
  };

  // search for exercises using the API
  const searchExercises = async () => {
    if (!searchTerm) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/name/${searchTerm}`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-key": import.meta.env.VITE_RAPIDAPI_KEY,
            "x-rapidapi-host": "exercisedb.p.rapidapi.com",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch exercises");
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      console.error("Error searching exercises:", err);
      setError("Failed to search exercises. Please try again.");
      
      // create fake results for demonstration if API fails
      const fakeResults = [
        {
          id: "fake1",
          name: `${searchTerm} exercise 1`,
          bodyPart: "chest",
          equipment: "barbell"
        },
        {
          id: "fake2",
          name: `${searchTerm} exercise 2`,
          bodyPart: "back",
          equipment: "dumbbell"
        },
        {
          id: "fake3",
          name: `${searchTerm} exercise 3`,
          bodyPart: "upper legs",
          equipment: "body weight"
        }
      ];
      setSearchResults(fakeResults);
    } finally {
      setIsSearching(false);
    }
  };

  // save the workout (create or update)
  const saveWorkout = async () => {
    if (!workoutName.trim()) {
      setError("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      setError("Please add at least one exercise to your workout");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const workoutData = {
        name: workoutName.trim(),
        date: workoutDate,
        exercises: selectedExercises.map((exercise) => ({
          exerciseId: exercise.id,
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          equipment: exercise.equipment,
          sets: exercise.sets.map((set) => ({
            setNumber: set.setNumber,
            weight: parseFloat(set.weight) || 0,
            reps: parseInt(set.reps) || 0,
            completed: set.completed,
          })),
        })),
      };

      let result;
      
      if (isEditMode) {
        // update existing workout
        result = await supabase
          .from("workouts")
          .update(workoutData)
          .eq("id", workoutId)
          .select();
          
        if (result.error) throw result.error;
        console.log("Workout updated successfully:", result.data);
      } else {
        // create new workout
        result = await supabase
          .from("workouts")
          .insert([workoutData])
          .select();
          
        if (result.error) throw result.error;
        console.log("Workout created successfully:", result.data);
      }

      navigate("/workouts");
    } catch (err) {
      console.error("Error saving workout:", err);
      setError(`Failed to save workout: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // cancel workout creation/editing
  const cancelWorkout = () => {
    if (!isEditMode) {
      localStorage.removeItem("workoutName");
    }
    navigate("/workouts");
  };

  if (initialLoading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading Workout</h2>
        <p>Please wait while we fetch the workout data...</p>
      </div>
    );
  }

  return (
    <div className="create-workout">
      <h1>{isEditMode ? "Edit Workout" : "Create New Workout"}</h1>

      {error && (
        <div
          className="error-message"
          style={{
            color: "#721c24",
            backgroundColor: "#f8d7da",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <div className="workout-form">
        <div className="form-group">
          <label htmlFor="workout-name">Workout Name:</label>
          <input
            type="text"
            id="workout-name"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="e.g., Upper Body Strength"
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="workout-date">Date:</label>
          <input
            type="date"
            id="workout-date"
            value={workoutDate}
            onChange={(e) => setWorkoutDate(e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="exercises-section">
        <div className="section-header">
          <h2>Exercises</h2>
          <div className="search-exercises">
            <input
              type="text"
              placeholder="Search for exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginRight: "10px", padding: "8px" }}
            />
            <button
              onClick={searchExercises}
              disabled={isSearching}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: isSearching ? "not-allowed" : "pointer",
              }}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            <ul>
              {searchResults.map((exercise) => (
                <li
                  key={exercise.id}
                  onClick={() => addExercise(exercise)}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    margin: "5px 0",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "4px",
                  }}
                >
                  <h4>{exercise.name}</h4>
                  <p>Body Part: {exercise.bodyPart}</p>
                  <p>Equipment: {exercise.equipment}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedExercises.length === 0 ? (
          <div className="no-exercises">
            <p>No exercises added yet. Search for exercises above.</p>
          </div>
        ) : (
          <div className="exercise-list">
            {selectedExercises.map((exercise, exerciseIndex) => (
              <div
                key={`${exercise.id}-${exerciseIndex}`}
                className="exercise-item"
                style={{
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "20px",
                }}
              >
                <div className="exercise-header">
                  <h3>{exercise.name}</h3>
                  <button
                    onClick={() => removeExercise(exerciseIndex)}
                    className="remove-btn"
                    style={{
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>

                <div className="exercise-info">
                  <p>
                    <strong>Body Part:</strong> {exercise.bodyPart}
                  </p>
                  <p>
                    <strong>Equipment:</strong> {exercise.equipment}
                  </p>
                </div>

                <div className="sets-section">
                  <h4>Sets</h4>
                  <table
                    className="sets-table"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th>Set</th>
                        <th>Weight (lbs)</th>
                        <th>Reps</th>
                        <th>Completed</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr
                          key={`set-${exerciseIndex}-${setIndex}`}
                          style={{ borderBottom: "1px solid #dee2e6" }}
                        >
                          <td>{set.setNumber}</td>
                          <td>
                            <input
                              type="number"
                              value={set.weight}
                              onChange={(e) =>
                                updateSetData(
                                  exerciseIndex,
                                  setIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                              placeholder="Weight"
                              min="0"
                              step="2.5"
                              style={{ width: "80px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={set.reps}
                              onChange={(e) =>
                                updateSetData(
                                  exerciseIndex,
                                  setIndex,
                                  "reps",
                                  e.target.value
                                )
                              }
                              placeholder="Reps"
                              min="0"
                              style={{ width: "80px" }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={set.completed}
                              onChange={(e) =>
                                updateSetData(
                                  exerciseIndex,
                                  setIndex,
                                  "completed",
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                          <td>
                            <button
                              onClick={() => removeSet(exerciseIndex, setIndex)}
                              disabled={exercise.sets.length <= 1}
                              className="remove-set-btn"
                              style={{
                                backgroundColor:
                                  exercise.sets.length <= 1 ? "#6c757d" : "#dc3545",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                padding: "4px 8px",
                                cursor:
                                  exercise.sets.length <= 1
                                    ? "not-allowed"
                                    : "pointer",
                                opacity: exercise.sets.length <= 1 ? 0.6 : 1,
                              }}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button
                    onClick={() => addSet(exerciseIndex)}
                    className="add-set-btn"
                    style={{
                      backgroundColor: "#17a2b8",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      margin: "10px 0",
                      cursor: "pointer",
                    }}
                  >
                    Add Set
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className="form-actions"
        style={{ marginTop: "20px", display: "flex", gap: "10px" }}
      >
        <button
          onClick={saveWorkout}
          disabled={loading}
          className="save-btn"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Saving..." : isEditMode ? "Update Workout" : "Save Workout"}
        </button>

        <button
          onClick={cancelWorkout}
          disabled={loading}
          className="cancel-btn"
          style={{
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CreateWorkout;