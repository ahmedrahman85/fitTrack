
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function CategoryWorkouts() {
    const { category } = useParams();
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // replace hardcoded localhost with environment variable
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/workouts/category/${category}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                setWorkouts(data);
            } else {
                console.error('Expected array but got:', data);
                setWorkouts([]);
            }
            setError(null);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching category workouts:', error);
            setError(error.message || 'Failed to load workouts for this category');
            setWorkouts([]);
            setLoading(false);
        });
    }, [category]);

    if (loading) return <div>Loading workouts...</div>;
    
    if (error) return (
        <div className="error-container">
            <h2>Error Loading Category Workouts</h2>
            <p>{error}</p>
            <p>please make sure your server is running and connected to the database.</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
    );
}

export default CategoryWorkouts;