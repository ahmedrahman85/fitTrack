-- Insert sample users
INSERT INTO users (username, email)
VALUES 
  ('user1', 'user1@example.com'),
  ('user2', 'user2@example.com');

-- Insert sample exercises
INSERT INTO exercises (name, category, equipment)
VALUES 
  ('Bench Press', 'Chest', 'Barbell'),
  ('Squat', 'Legs', 'Barbell'),
  ('Deadlift', 'Back', 'Barbell'),
  ('Pull-up', 'Back', 'Body weight'),
  ('Push-up', 'Chest', 'Body weight'),
  ('Bicep Curl', 'Arms', 'Dumbbell'),
  ('Tricep Extension', 'Arms', 'Cable'),
  ('Shoulder Press', 'Shoulders', 'Dumbbell'),
  ('Leg Press', 'Legs', 'Machine'),
  ('Lat Pulldown', 'Back', 'Cable');

-- Insert sample workouts
INSERT INTO workouts (user_id, title, description, date, duration_minutes)
VALUES 
  (1, 'Morning Strength Session', 'Full body strength training', '2023-09-15', 60),
  (1, 'Cardio Day', 'Running and HIIT', '2023-09-17', 45),
  (1, 'Upper Body Focus', 'Chest, back, and arms', '2023-09-19', 50),
  (2, 'Leg Day', 'Quad and hamstring focus', '2023-09-18', 70),
  (2, 'Recovery Session', 'Light cardio and stretching', '2023-09-20', 40);

-- Insert sample workout exercises
INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight, notes)
VALUES 
  (1, 1, 3, 10, 70, 'Felt strong today'),
  (1, 2, 3, 8, 100, 'Working on form'),
  (1, 6, 3, 12, 15, ''),
  (2, 4, 3, 10, 0, 'Body weight only'),
  (2, 5, 3, 15, 0, ''),
  (3, 1, 4, 8, 75, 'Increased weight'),
  (3, 6, 3, 12, 17.5, 'Trying heavier weight'),
  (3, 7, 3, 15, 25, ''),
  (4, 2, 4, 6, 120, 'New personal best'),
  (4, 9, 3, 12, 150, ''),
  (5, 5, 2, 10, 0, 'Easy pace'),
  (5, 4, 2, 8, 0, 'Focus on slow negatives');