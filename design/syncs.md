# Syncs Documentation

## Active Syncs

### 1. Seed Global Exercises (Startup Sync)
**Location:** `src/concept-server.ts`

**Trigger:** Server initialization

**Concepts:** ExerciseLibrary

**Description:** Seeds 3242 global exercises from JSON file on first startup

**Implementation:** Manual call to `seedGlobalExercises()` after concepts load

**Note:** Will be refactored in A5 with proper sync infrastructure

## Planned Syncs (Not Yet Implemented)

### 2. Update Template Last Performed
**Trigger:** User finishes workout from template
**Concepts:** WorkoutTemplate, WorkoutLog
**Description:** After finishing workout, update template's lastPerformed date

### 3. Generate AI Recommendation
**Trigger:** User views progress page
**Concepts:** ProgressionGuidance, WorkoutLog
**Description:** Fetch workout history and generate recommendation if needed