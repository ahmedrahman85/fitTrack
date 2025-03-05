// flat UI styling system based on the Darjeeling color palette
import { capitaliseWords, formatBodyPart, formatEquipment, formatTarget } from '../utils/capitalise';
export const darjeelingPalette = {
    primary: "#00A08A",    // Teal green (primary action buttons)
    secondary: "#F2AD00",  // Golden yellow (secondary actions)
    accent: "#F98400",     // Orange (accents, highlights)
    danger: "#FF0000",     // Red (delete buttons, warnings)
    dark: "#5BBCD6",       // Blue (headers, titles)
    light: "#ECCBAE",      // Beige (backgrounds, cards)
    text: "#333333",       // Dark grey (text)
    textLight: "#FFFFFF",  // White (text on dark backgrounds)
    background: "#F8F9FA", // Light grey (main background)
    cardBg: "#FFFFFF",     // White (card backgrounds)
    border: "#DEE2E6"      // Light grey (borders)
  };
  
  // typography styles
  export const typography = {
    h1: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: darjeelingPalette.dark,
    },
    h2: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '14px',
      color: darjeelingPalette.dark,
      letterSpacing: '-0.4px',
    },
    h3: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '12px',
      color: darjeelingPalette.dark,
      letterSpacing: '-0.3px',
    },
    h4: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: darjeelingPalette.dark,
    },
    body: {
      fontSize: '14px',
      lineHeight: '1.5',
      color: darjeelingPalette.text,
    },
    small: {
      fontSize: '12px',
      lineHeight: '1.4',
      color: darjeelingPalette.text,
    }
  };
  
  // flat UI components
  export const flatUI = {
    // container styles
    container: {
      padding: '16px',
      backgroundColor: darjeelingPalette.background,
      border: 'none',
      borderRadius: '0',
    },
    card: {
      padding: '16px',
      backgroundColor: darjeelingPalette.cardBg,
      border: `1px solid ${darjeelingPalette.border}`,
      borderRadius: '0',
      marginBottom: '16px',
    },
    section: {
      marginBottom: '24px',
    },
    
    // button styles
    primaryButton: {
      backgroundColor: darjeelingPalette.primary,
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '0',
      fontWeight: '500',
    },
    secondaryButton: {
      backgroundColor: darjeelingPalette.secondary,
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '0',
      fontWeight: '500',
    },
    accentButton: {
      backgroundColor: darjeelingPalette.accent,
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '0',
      fontWeight: '500',
    },
    dangerButton: {
      backgroundColor: darjeelingPalette.danger,
      color: 'white',
      border: 'none',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      borderRadius: '0',
      fontWeight: '500',
    },
    iconButton: {
      backgroundColor: 'transparent',
      color: darjeelingPalette.dark,
      border: 'none',
      padding: '8px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    // form elements
    input: {
      padding: '8px',
      border: `1px solid ${darjeelingPalette.border}`,
      borderRadius: '0',
      fontSize: '14px',
      width: '100%',
      backgroundColor: 'white',
    },
    select: {
      padding: '8px',
      border: `1px solid ${darjeelingPalette.border}`,
      borderRadius: '0',
      fontSize: '14px',
      width: '100%',
      backgroundColor: 'white',
      appearance: 'none',
      backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '16px',
    },
    checkbox: {
      accentColor: darjeelingPalette.primary,
    },
    
    // table styles
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px',
    },
    tableHeader: {
      borderBottom: `2px solid ${darjeelingPalette.border}`,
      textAlign: 'left',
      padding: '8px',
      fontWeight: 'bold',
      color: darjeelingPalette.dark,
    },
    tableCell: {
      borderBottom: `1px solid ${darjeelingPalette.border}`,
      padding: '8px',
    },
    
    // layout helpers
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
    },
    spaceBetween: {
      justifyContent: 'space-between',
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    gap8: {
      gap: '8px',
    },
    gap16: {
      gap: '16px',
    },
    
    // grid
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '16px',
    },
    
    // misc
    badge: {
      display: 'inline-block',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: darjeelingPalette.primary,
      color: 'white',
    },
    
    // utils
    noMargin: { margin: 0 },
    noPadding: { padding: 0 },
    textCenter: { textAlign: 'center' },
    fullWidth: { width: '100%' },
    pointer: { cursor: 'pointer' },
  };
  
  // responsive breakpoints
  export const breakpoints = {
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px'
  };