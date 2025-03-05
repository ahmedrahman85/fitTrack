import { Link, useLocation } from 'react-router-dom';
import { darjeelingPalette, flatUI } from '../utils/flatstyles';
function Navbar() {
  const location = useLocation();
  
  // check if a path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // styles using a flatstyle and custom color palette, had trouble tailwind did my own thing
  const styles = {
    nav: {
      backgroundColor: darjeelingPalette.dark,
      padding: '0',
      marginBottom: '16px',
      borderBottom: 'none',
    },
    container: {
      ...flatUI.flexRow,
      ...flatUI.spaceBetween,
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '12px 16px',
    },
    logoLink: {
      color: 'white',
      textDecoration: 'none',
      fontWeight: 'bold',
      fontSize: '20px',
    },
    navLinks: {
      ...flatUI.flexRow,
      gap: '16px',
    },
    navLink: {
      color: 'white',
      textDecoration: 'none',
      padding: '0',
      fontSize: '14px',
      position: 'relative',
    },
    activeNavLink: {
      color: darjeelingPalette.light,
      fontWeight: 'bold',
      position: 'relative',
    },
    //  link indicator
    indicator: {
      position: 'absolute',
      bottom: '-12px',
      left: '0',
      right: '0',
      height: '2px',
      backgroundColor: darjeelingPalette.light,
    }
  };
  
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoLink}>
          FitTrack
        </Link>
        
        <div style={styles.navLinks}>
          <Link 
            to="/workouts" 
            style={isActive('/workouts') || isActive('/edit/') ? styles.activeNavLink : styles.navLink}
          >
            My Workouts
            {(isActive('/workouts') || isActive('/edit/')) && <div style={styles.indicator}></div>}
          </Link>
          
          <Link 
            to="/create" 
            style={isActive('/create') ? styles.activeNavLink : styles.navLink}
          >
            Create Workout
            {isActive('/create') && <div style={styles.indicator}></div>}
          </Link>
          
          <Link 
            to="/exercises" 
            style={isActive('/exercises') ? styles.activeNavLink : styles.navLink}
          >
            Exercise Library
            {isActive('/exercises') && <div style={styles.indicator}></div>}
          </Link>
          
          <Link 
            to="/browse" 
            style={isActive('/browse') ? styles.activeNavLink : styles.navLink}
          >
            Browse Exercises
            {isActive('/browse') && <div style={styles.indicator}></div>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;