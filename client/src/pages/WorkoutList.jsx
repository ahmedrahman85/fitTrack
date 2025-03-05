import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { darjeelingPalette, flatUI, typography } from '../utils/flatstyles'; // Import typography here
import { capitaliseWords, formatBodyPart, formatEquipment } from '../utils/capitalise';

// supabase config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// workoutList component styles
const styles = {
  container: {
    ...flatUI.container,
    padding: 0,
  },
  header: {
    ...typography.h1, // Use typography.h1 directly (not flatUI.typography.h1)
    margin: '0 0 24px 0',
  },
  errorNotification: {
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    border: 'none',
  },
  refreshButton: {
    ...flatUI.secondaryButton,
    marginTop: '8px',
  },
  statsBar: {
    ...flatUI.flexRow,
    ...flatUI.spaceBetween,
    backgroundColor: darjeelingPalette.light,
    padding: '12px 16px',
    marginBottom: '16px',
  },
  statsText: {
    fontWeight: 'bold',
    margin: 0,
  },
  addButton: {
    ...flatUI.primaryButton,
  },
  emptyState: {
    ...flatUI.card,
    textAlign: 'center',
    padding: '32px 16px',
  },
  createButton: {
    ...flatUI.primaryButton,
    marginTop: '16px',
  },
  workoutList: {
    ...flatUI.flexColumn,
    gap: '16px',
  },
  workoutCard: {
    backgroundColor: darjeelingPalette.cardBg,
    border: `1px solid ${darjeelingPalette.border}`,
    padding: '16px',
    cursor: 'pointer',
  },
  workoutHeader: {
    ...flatUI.flexRow,
    ...flatUI.spaceBetween,
  },
  workoutTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: darjeelingPalette.dark,
    margin: '0 0 8px 0',
  },
  workoutInfo: {
    margin: '4px 0',
    fontSize: '14px',
  },
  expandIcon: {
    fontSize: '20px',
    color: darjeelingPalette.dark,
  },
  workoutDetails: {
    borderTop: `1px solid ${darjeelingPalette.border}`,
    marginTop: '16px',
    paddingTop: '16px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: darjeelingPalette.dark,
    margin: '0 0 12px 0',
  },
  exerciseList: {
    ...flatUI.flexColumn,
    gap: '12px',
  },
  exerciseItem: {
    backgroundColor: darjeelingPalette.light,
    padding: '12px',
    border: 'none',
  },
  exerciseHeader: {
    ...flatUI.flexRow,
    ...flatUI.spaceBetween,
  },
  exerciseName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: darjeelingPalette.dark,
    margin: 0,
  },
  exerciseInfo: {
    fontSize: '14px',
    marginTop: '4px',
  },
  actionBar: {
    ...flatUI.flexRow,
    ...flatUI.spaceBetween,
    marginTop: '16px',
  },
  editButton: {
    ...flatUI.primaryButton,
  },
  actionGroup: {
    ...flatUI.flexRow,
    gap: '8px',
  },
  likeButton: {
    ...flatUI.accentButton,
  },
  deleteButton: {
    ...flatUI.dangerButton,
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


// Calendar component
function WorkoutCalendar({ workouts }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    
    // set of dates that have workouts (formatted as 'YYYY-MM-DD')
    const workoutDates = new Set(
        workouts.map(workout => workout.date)
    );
    
    // days in month
    const getDaysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    };
    
    //  day of week for first day of month (0 = Sunday, 6 = Saturday)
    const getFirstDayOfMonth = (month, year) => {
        return new Date(year, month, 1).getDay();
    };
    
    // go to previous month
    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };
    
    // go to next month
    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };
    
    // format date as YYYY-MM-DD for comparison
    const formatDate = (year, month, day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    
    // check if a date is right
    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() && 
               currentMonth === today.getMonth() && 
               currentYear === today.getFullYear();
    };
    
    // check if a date has a workout
    const hasWorkout = (day) => {
        const dateStr = formatDate(currentYear, currentMonth, day);
        return workoutDates.has(dateStr);
    };
    
    // calendar styles
    const calendarStyles = {
        container: {
            backgroundColor: darjeelingPalette.cardBg,
            border: `1px solid ${darjeelingPalette.border}`,
            padding: '16px',
            marginBottom: '24px',
        },
        header: {
            ...flatUI.flexRow,
            ...flatUI.spaceBetween,
            marginBottom: '16px',
        },
        title: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: darjeelingPalette.dark,
            margin: 0,
        },
        navButton: {
            background: 'none',
            border: 'none',
            color: darjeelingPalette.dark,
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px 8px',
        },
        monthYear: {
            fontSize: '16px',
            fontWeight: 'bold',
            margin: 0,
        },
        weekdays: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '12px',
        },
        days: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
        },
        day: {
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            border: `1px solid ${darjeelingPalette.border}`,
        },
        workoutDay: {
            backgroundColor: darjeelingPalette.primary,
            color: 'white',
            border: 'none',
        },
        today: {
            border: `2px solid ${darjeelingPalette.dark}`,
            fontWeight: 'bold',
        },
        legend: {
            ...flatUI.flexRow,
            justifyContent: 'flex-end',
            gap: '16px',
            marginTop: '16px',
            fontSize: '12px',
        },
        legendItem: {
            ...flatUI.flexRow,
            gap: '8px',
            alignItems: 'center',
        },
        legendWorkout: {
            width: '12px',
            height: '12px',
            backgroundColor: darjeelingPalette.primary,
        },
        legendToday: {
            width: '12px',
            height: '12px',
            border: `2px solid ${darjeelingPalette.dark}`,
        },
    };
    
    // generate calendar days
    const buildCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
        const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
        
        // create blank spaces for days before the first day of the month
        const blanks = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            blanks.push(
                <div key={`blank-${i}`} style={calendarStyles.day}></div>
            );
        }
        
        // create day elements
        const days = [];
        for (let d = 1; d <= daysInMonth; d++) {
            const workoutDay = hasWorkout(d);
            const isCurrentDay = isToday(d);
            
            // combine styles
            const dayStyle = {
                ...calendarStyles.day,
                ...(workoutDay ? calendarStyles.workoutDay : {}),
                ...(isCurrentDay ? calendarStyles.today : {}),
            };
            
            days.push(
                <div key={`day-${d}`} style={dayStyle}>
                    {d}
                </div>
            );
        }
        
        // combine blank spaces and days, done!
        return [...blanks, ...days];
    };
    
    return (
        <div style={calendarStyles.container}>
            <div style={calendarStyles.header}>
                <h2 style={calendarStyles.title}>Workout Calendar</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={prevMonth} style={calendarStyles.navButton}>
                        &laquo;
                    </button>
                    <h3 style={calendarStyles.monthYear}>
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                    </h3>
                    <button onClick={nextMonth} style={calendarStyles.navButton}>
                        &raquo;
                    </button>
                </div>
            </div>
            
            <div style={calendarStyles.weekdays}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day}>{day}</div>
                ))}
            </div>
            
            <div style={calendarStyles.days}>
                {buildCalendar()}
            </div>
            
            <div style={calendarStyles.legend}>
                <div style={calendarStyles.legendItem}>
                    <div style={calendarStyles.legendWorkout}></div>
                    <span>Workout Day</span>
                </div>
                <div style={calendarStyles.legendItem}>
                    <div style={calendarStyles.legendToday}></div>
                    <span>Today</span>
                </div>
            </div>
        </div>
    );
}

// exercise sets component
function WorkoutExerciseSets({ exercise, workoutId, onUpdate }) {
    const [sets, setSets] = useState(exercise.sets || []);
    const [isUpdating, setIsUpdating] = useState(false);

    // update set state without saving to database
    const handleSetComplete = (setIndex, isCompleted) => {
        const updatedSets = [...sets];
        updatedSets[setIndex].completed = isCompleted;
        setSets(updatedSets);
    };

    const handleRepsChange = (setIndex, value) => {
        const updatedSets = [...sets];
        updatedSets[setIndex].reps = parseInt(value) || 0;
        setSets(updatedSets);
    };

    const handleWeightChange = (setIndex, value) => {
        const updatedSets = [...sets];
        updatedSets[setIndex].weight = parseFloat(value) || 0;
        setSets(updatedSets);
    };

    // save changes to database
    const updateExerciseSets = async () => {
        if (isUpdating) return;
        
        try {
            setIsUpdating(true);
            
            // first, get the current workout
            const { data: workout, error: fetchError } = await supabase
                .from('workouts')
                .select('*')
                .eq('id', workoutId)
                .single();
                
            if (fetchError) throw fetchError;
            
            // find the exercise and update its sets
            const updatedExercises = workout.exercises.map(ex => {
                if (ex.exerciseId === exercise.exerciseId && 
                    ex.name === exercise.name) {
                    return { ...ex, sets: [...sets] };
                }
                return ex;
            });
            
            // update the workout with modified exercises
            const { error: updateError } = await supabase
                .from('workouts')
                .update({ exercises: updatedExercises })
                .eq('id', workoutId);
                
            if (updateError) throw updateError;
            
            // notify parent component of the update
            if (onUpdate) {
                onUpdate(workoutId, updatedExercises);
            }
            
        } catch (error) {
            console.error('Error updating sets:', error);
            alert('Failed to update sets. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    // exercise sets styles
    const setStyles = {
        container: {
            marginTop: '12px',
        },
        title: {
            fontSize: '16px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            color: darjeelingPalette.dark,
        },
        table: {
            ...flatUI.table,
        },
        th: {
            ...flatUI.tableHeader,
            padding: '8px',
            textAlign: 'left',
            fontSize: '14px',
        },
        td: {
            ...flatUI.tableCell,
            padding: '8px',
        },
        input: {
            ...flatUI.input,
            width: '60px',
            padding: '4px 8px',
            fontSize: '14px',
        },
        checkbox: {
            ...flatUI.checkbox,
        },
        saveButton: {
            ...flatUI.primaryButton,
            marginTop: '12px',
        },
        completedRow: {
            backgroundColor: `${darjeelingPalette.primary}15`, // Very light tint of primary
        },
    };

    return (
        <div style={setStyles.container}>
            <h4 style={setStyles.title}>Sets</h4>
            <table style={setStyles.table}>
                <thead>
                    <tr>
                        <th style={setStyles.th}>Set</th>
                        <th style={setStyles.th}>Weight (lbs)</th>
                        <th style={setStyles.th}>Reps</th>
                        <th style={setStyles.th}>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    {sets.map((set, index) => (
                        <tr key={index} style={set.completed ? setStyles.completedRow : null}>
                            <td style={setStyles.td}>{set.setNumber}</td>
                            <td style={setStyles.td}>
                                <input 
                                    type="number" 
                                    value={set.weight} 
                                    onChange={(e) => handleWeightChange(index, e.target.value)}
                                    style={setStyles.input}
                                    min="0"
                                    step="2.5"
                                />
                            </td>
                            <td style={setStyles.td}>
                                <input 
                                    type="number" 
                                    value={set.reps} 
                                    onChange={(e) => handleRepsChange(index, e.target.value)}
                                    style={setStyles.input}
                                    min="0"
                                />
                            </td>
                            <td style={setStyles.td}>
                                <input 
                                    type="checkbox" 
                                    checked={set.completed} 
                                    onChange={(e) => handleSetComplete(index, e.target.checked)}
                                    style={setStyles.checkbox}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button 
                onClick={updateExerciseSets}
                disabled={isUpdating}
                style={setStyles.saveButton}
            >
                {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
    );
}

// main WorkoutList component
function WorkoutList() {
    const navigate = useNavigate();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedWorkout, setExpandedWorkout] = useState(null);
    
    const listRef = useRef(null);

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            setError(null);

            // fetch workouts from Supabase
            const { data, error } = await supabase
                .from('workouts')
                .select('*')
                .order('date', { ascending: false });

            if (error) throw error;

            if (Array.isArray(data) && data.length > 0) {
                // transform data to match expected format
                const formattedWorkouts = data.map(workout => ({
                    id: workout.id,
                    title: workout.name,
                    date: workout.date,
                    exercise_count: workout.exercises ? workout.exercises.length : 0,
                    exercises: workout.exercises,
                    likes: workout.likes || 0
                }));

                setWorkouts(formattedWorkouts);
            } else {
                setWorkouts([]);
                setError('No workouts found in the database.');
            }
        } catch (err) {
            console.error('Error fetching workouts:', err);
            setError('Failed to load workouts: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (id) => {
        try {
            const workout = workouts.find(w => w.id === id);
            const newLikes = (workout.likes || 0) + 1;

            const { error } = await supabase
                .from('workouts')
                .update({ likes: newLikes })
                .eq('id', id);

            if (error) throw error;

            // update local state without refetching!
            setWorkouts(workouts.map(workout =>
                workout.id === id ? { ...workout, likes: newLikes } : workout
            ));
        } catch (error) {
            console.error('Error liking workout:', error);
            alert('Failed to like workout. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this workout?')) {
            return;
        }

        try {
            const { error } = await supabase
                .from('workouts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // update UI after successful deletion
            setWorkouts(workouts.filter(workout => workout.id !== id));
            
            // clear expanded workout if it was deleted
            if (expandedWorkout === id) {
                setExpandedWorkout(null);
            }
        } catch (error) {
            console.error('Error deleting workout:', error);
            alert('Failed to delete workout. Please try again.');
        }
    };
    
    const handleEditWorkout = (id) => {
        navigate(`/edit/${id}`);
    };
    
    const toggleExpandWorkout = (id) => {
        setExpandedWorkout(expandedWorkout === id ? null : id);
    };
    
    // update a specific workout's exercises without refetching all workouts
    const handleExerciseSetUpdate = (workoutId, updatedExercises) => {
        setWorkouts(prevWorkouts => {
            return prevWorkouts.map(workout => {
                if (workout.id === workoutId) {
                    return {
                        ...workout,
                        exercises: updatedExercises,
                        exercise_count: updatedExercises.length
                    };
                }
                return workout;
            });
        });
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <h2 style={styles.loadingTitle}>Loading Workouts</h2>
                <p>Please wait while we fetch your workout data...</p>
            </div>
        );
    }

    return (
        <div style={styles.container} ref={listRef}>
            <h1 style={styles.header}>My Workouts</h1>

            {error && (
                <div style={styles.errorNotification}>
                    <p>{error}</p>
                    <button
                        onClick={fetchWorkouts}
                        style={styles.refreshButton}
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Calendar Component */}
            <WorkoutCalendar workouts={workouts} />

            <div style={styles.statsBar}>
                <p style={styles.statsText}>Total: {workouts.length} workouts</p>
                <Link to="/create" style={{ textDecoration: 'none' }}>
                    <button style={styles.addButton}>Add New Workout</button>
                </Link>
            </div>

            {workouts.length === 0 ? (
                <div style={styles.emptyState}>
                    <p>No workouts found. Create your first workout!</p>
                    <Link to="/create" style={{ textDecoration: 'none' }}>
                        <button style={styles.createButton}>Create Workout</button>
                    </Link>
                </div>
            ) : (
                <div style={styles.workoutList}>
                    {workouts.map(workout => (
                        <div
                            key={workout.id}
                            style={styles.workoutCard}
                        >
                            <div 
                                onClick={() => toggleExpandWorkout(workout.id)}
                                style={styles.workoutHeader}
                            >
                                <div>
                                    <h2 style={styles.workoutTitle}>{capitaliseWords(workout.title)}</h2>
                                    <p style={styles.workoutInfo}>Date: {new Date(workout.date).toLocaleDateString()}</p>
                                    <p style={styles.workoutInfo}>Exercises: {workout.exercise_count || 0}</p>
                                </div>
                                <div style={styles.expandIcon}>
                                    {expandedWorkout === workout.id ? '▼' : '▶'}
                                </div>
                            </div>

                            {expandedWorkout === workout.id && (
                                <div style={styles.workoutDetails}>
                                    <h3 style={styles.sectionTitle}>Exercises</h3>
                                    
                                    {workout.exercises && workout.exercises.length > 0 ? (
                                        <div style={styles.exerciseList}>
                                            {workout.exercises.map((exercise, index) => (
                                                <div 
                                                    key={index} 
                                                    style={styles.exerciseItem}
                                                >
                                                    <div style={styles.exerciseHeader}>
                                                        <h4 style={styles.exerciseName}>{capitaliseWords(exercise.name)}</h4>
                                                    </div>
                                                    <div style={styles.exerciseInfo}>
                                                        <span>{formatBodyPart(exercise.bodyPart)}</span>
                                                        {exercise.equipment && (
                                                            <span> | {formatEquipment(exercise.equipment)}</span>
                                                        )}
                                                    </div>
                                                    
                                                    <WorkoutExerciseSets 
                                                        exercise={exercise} 
                                                        workoutId={workout.id}
                                                        onUpdate={handleExerciseSetUpdate}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No exercises in this workout.</p>
                                    )}
                                    
                                    <div style={styles.actionBar}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditWorkout(workout.id);
                                            }}
                                            style={styles.editButton}
                                        >
                                            Edit Workout
                                        </button>
                                        
                                        <div style={styles.actionGroup}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleLike(workout.id);
                                                }}
                                                style={styles.likeButton}
                                            >
                                                ❤️ {workout.likes || 0}
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(workout.id);
                                                }}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {!expandedWorkout || expandedWorkout !== workout.id ? (
                                <div
                                    style={styles.actionBar}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditWorkout(workout.id);
                                        }}
                                        style={styles.editButton}
                                    >
                                        Edit Workout
                                    </button>

                                    <div style={styles.actionGroup}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(workout.id);
                                            }}
                                            style={styles.likeButton}
                                        >
                                            ❤️ {workout.likes || 0}
                                        </button>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(workout.id);
                                            }}
                                            style={styles.deleteButton}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WorkoutList;