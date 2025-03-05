// src/services/ExerciseDBService.js

class ExerciseDBService {
  constructor() {
    this.apiKey = import.meta.env.VITE_RAPIDAPI_KEY || '';
    this.apiHost = import.meta.env.VITE_RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com';
    this.baseUrl = 'https://exercisedb.p.rapidapi.com';
  }

  // headers
  getHeaders() {
    return {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': this.apiHost
    };
  }

  // search exercises by name
  async searchExercises(query) {
    try {
      console.log(`Searching for exercises with query: ${query}`);
      
      // use the name endpoint for searching like readme
      const response = await fetch(`${this.baseUrl}/exercises/name/${query}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // transform API response to match the expected format for CreateWorkout
      return data.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      }));
    } catch (error) {
      console.error('Error searching exercises:', error);
      return [];
    }
  }

  // get all exercises (limited to prevent performance issues)
  async getAllExercises(limit = 50) {
    try {
      const response = await fetch(`${this.baseUrl}/exercises?limit=${limit}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // transform API response
      return data.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      }));
    } catch (error) {
      console.error('Error fetching all exercises:', error);
      return [];
    }
  }

  // get exercises by body part
  async getExercisesByBodyPart(bodyPart) {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // transform API response
      return data.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      }));
    } catch (error) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, error);
      return [];
    }
  }

  // get exercises by equipment
  async getExercisesByEquipment(equipment) {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/equipment/${equipment}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // transform API response
      return data.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      }));
    } catch (error) {
      console.error(`Error fetching exercises for equipment ${equipment}:`, error);
      return [];
    }
  }

  // get exercises by target muscle
  async getExercisesByTarget(target) {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/target/${target}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // transform API response
      return data.map(exercise => ({
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      }));
    } catch (error) {
      console.error(`Error fetching exercises for target muscle ${target}:`, error);
      return [];
    }
  }

  // get a single exercise by ID
  async getExerciseById(id) {
    try {
      const response = await fetch(`${this.baseUrl}/exercises/exercise/${id}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const exercise = await response.json();
      
      // transform API response
      return {
        exerciseId: exercise.id,
        name: exercise.name,
        bodyParts: [exercise.bodyPart],
        equipments: [exercise.equipment],
        targetMuscles: [exercise.target],
        secondaryMuscles: exercise.secondaryMuscles || [],
        instructions: exercise.instructions || [],
        gifUrl: exercise.gifUrl
      };
    } catch (error) {
      console.error(`Error fetching exercise with ID ${id}:`, error);
      return null;
    }
  }
}

export default ExerciseDBService;