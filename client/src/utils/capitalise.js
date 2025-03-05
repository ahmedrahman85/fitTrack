//capitalises the first letter of each word in a string
 
export const capitaliseWords = (str) => {
    if (!str) return '';
    
    // handle hyphenated words 'upper-body' → 'Upper-Body'
    if (str.includes('-')) {
      return str.split('-')
        .map(word => capitaliseWords(word))
        .join('-');
    }
    
    // handle words with special formatting
    return str.split(' ')
      .map(word => {
        // special case for articles and prepositions in titles
        const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 
                               'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
        
        // always capitalise first word
        if (word.length === 0) return '';
        
        if (lowercaseWords.includes(word.toLowerCase()) && str.indexOf(word) !== 0) {
          return word.toLowerCase();
        }
        
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };
  
  //format body part names for display
  
  export const formatBodyPart = (bodyPart) => {
    if (!bodyPart) return '';
    
    // special case formatting for common body part terms
    const specialCases = {
      'cardio': 'Cardiovascular',
      'upper legs': 'Upper Legs',
      'lower legs': 'Lower Legs',
      'upper arms': 'Upper Arms',
      'lower arms': 'Lower Arms',
      'waist': 'Core',
      'back': 'Back',
      'chest': 'Chest',
      'shoulders': 'Shoulders',
      'neck': 'Neck'
    };
    
    if (specialCases[bodyPart.toLowerCase()]) {
      return specialCases[bodyPart.toLowerCase()];
    }
    
    return capitaliseWords(bodyPart);
  };
  
  //format equipment names for display
   
  export const formatEquipment = (equipment) => {
    if (!equipment) return '';
    
    // special case formatting for common equipment terms
    const specialCases = {
      'body weight': 'Bodyweight',
      'dumbbell': 'Dumbbells',
      'barbell': 'Barbell',
      'cable': 'Cable',
      'band': 'Resistance Band',
      'medicine ball': 'Medicine Ball',
      'kettlebell': 'Kettlebell',
      'machine': 'Machine',
      'stability ball': 'Stability Ball',
      'ez barbell': 'EZ Bar',
      'rope': 'Rope',
      'weighted': 'Weighted'
    };
    
    if (specialCases[equipment.toLowerCase()]) {
      return specialCases[equipment.toLowerCase()];
    }
    
    return capitaliseWords(equipment);
  };
  
  //format target muscle names for display
 
  export const formatTarget = (target) => {
    if (!target) return '';
    
    // special case formatting for muscle targets
    const specialCases = {
      'abs': 'Abdominals',
      'quads': 'Quadriceps',
      'lats': 'Latissimus Dorsi',
      'glutes': 'Gluteus Maximus',
      'delts': 'Deltoids',
      'hamstrings': 'Hamstrings',
      'biceps': 'Biceps',
      'triceps': 'Triceps',
      'cardiovascular system': 'Cardiovascular System',
      'pectorals': 'Pectorals',
      'serratus anterior': 'Serratus Anterior',
      'levator scapulae': 'Levator Scapulae'
    };
    
    if (specialCases[target.toLowerCase()]) {
      return specialCases[target.toLowerCase()];
    }
    
    return capitaliseWords(target);
  };
