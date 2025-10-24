# ExerciseLibrary [User]

## Purpose
Provide searchable exercise database with metadata for workout planning

## Operational Principle
After system seeds global exercise library, users can search and filter exercises by muscle group, equipment, or classification. Users can add custom exercises visible only to them. When logging workouts, users select from combined global + personal exercises.

## State
```
a set of Exercises with
  a name String
  a hasWeight Boolean
  a trackingType String
    one of: "reps" | "duration"
  a isGlobal Boolean
  a targetMuscleGroup String (optional)
    one of: "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Core" | "Glutes" | "Full Body" | "Other"
  a primeMoverMuscle String (optional)
  a equipment String (optional)
    one of: "Barbell" | "Dumbbell" | "Kettlebell" | "Machine" | "Cable" | "Bodyweight" | "Resistance Band" | "Other"
  a exerciseClassification String (optional)
    one of: "Bodybuilding" | "Powerlifting" | "Calisthenics" | "Olympic Weightlifting" | "Functional" | "Other"
  a forceType String (optional)
    one of: "Push" | "Pull" | "Static" | "Other"
  a posture String (optional)
    one of: "Standing" | "Seated" | "Supine" | "Prone" | "Quadruped" | "Bridge" | "Other"
  a videoUrl String (optional)
  a createdBy User (optional, null if global)
```

## Actions

### searchExercises(user: User, query: String, filters: Object)
Search exercises by name with optional filters (muscleGroup, equipment, classification, forceType)

**Requires**: query not empty or at least one filter provided

**Effects**: Return exercises matching criteria where (isGlobal=true OR createdBy=user)

### addCustomExercise(user: User, name: String, hasWeight: Boolean, trackingType: String, metadata: Object)
**Requires**: name not empty, user authenticated, trackingType is "reps" or "duration"

**Effects**: Create custom exercise ony visible to user, with isGlobal=false, createdBy=user, optional metadata fields

### getExercise(user: User, name: String)

**Requires**: exercise exists and (isGlobal=true OR createdBy=user)

**Effects**: Return exercise with all fields

### updateCustomExercise(user: User, name: String, updates: Object)

**Requires** : exercise exists with createdBy=user and isGlobal=false, cannot update hasWeight or trackingType (immutable after creation)

**Effects**: Update custom exercise fields (hasWeight, targetMuscleGroup, equipment, etc.)

### deleteCustomExercise(user: User, name: String)

**Requires**: exercise exists with createdBy=user and isGlobal=false

**Effects**: Remove user's custom exercise from library

### seedGlobalExercises(exercises: list of Exercise)
One-time import of global exercise database

**Requires**: No global exercises exist yet

**Effects**: Insert all exercises with isGlobal=true, createdBy=null