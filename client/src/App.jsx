import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ExerciseLibrary from './pages/ExerciseLibrary';
import ExerciseBrowser from './components/ExerciseBrowser';
import CreateWorkout from './pages/CreateWorkout';
import WorkoutList from './pages/WorkoutList';
import Navbar from './components/NavBar';
import { darjeelingPalette, flatUI } from './utils/flatstyles';

// global styles
const globalStyles = {
  app: {
    backgroundColor: darjeelingPalette.background,
    minHeight: '100vh',
    color: darjeelingPalette.text,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    margin: 0,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px 40px',
  },
  notFound: {
    ...flatUI.card,
    marginTop: '32px',
    padding: '32px',
  },
  notFoundHeading: {
    ...flatUI.noMargin,
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '16px',
    color: darjeelingPalette.dark,
  },
};

function App() {
  return (
    <Router>
      <div className="app" style={globalStyles.app}>
        {/* Navigation component */}
        <Navbar />
        
        <main className="content" style={globalStyles.content}>
          <Routes>
            {/* redirect root to workouts */}
            <Route path="/" element={<Navigate to="/workouts" replace />} />
            
            {/* workout routes */}
            <Route path="/workouts" element={<WorkoutList />} />
            <Route path="/create" element={<CreateWorkout />} />
            <Route path="/edit/:workoutId" element={<CreateWorkout />} />
            
            {/* exercise routes */}
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/browse" element={<ExerciseBrowser />} />
            <Route path="/category/:categoryName" element={<ExerciseLibrary />} />
            
            {/* 404 route */}
            <Route path="*" element={
              <div className="not-found" style={globalStyles.notFound}>
                <h1 style={globalStyles.notFoundHeading}>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.history.back()}
                  style={flatUI.primaryButton}
                >
                  Go Back
                </button>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;