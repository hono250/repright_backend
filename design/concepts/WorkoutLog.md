# WorkoutLog [User, Exercise]

## Purpose
Track workout performance over time for individual users

## Operational Principle
After user logs sets with exercise, weight, and reps across multiple workout sessions, they can retrieve their workout history to see past performance and identify trends.

## state
    a set of WorkoutSets with
      a user User
      an exercise Exercise
      a weight Number (optional)
      a reps Number (optional, null if timed, in seconds)
      a duration Number (optional, null if not timed, in seconds)
      a date Date


## Actions

### logSet(user: User, exercise: Exercise, weight: Number, reps: Number, duration: Number)

**Requires:** At least one of (reps > 0) or (duration > 0) must be provided. weight, reps, and duration are optional (can be null). if weight provided, it must be >= 0. reps and duration cannot be both provided. 

**Effects:** Create new WorkoutSet with current date

### getHistory(user: User, exercise: Exercise, weeksBack: Number = 4): WorkoutSet Set

**Requires:** weeksBack > 0

**Effects:** Return all sets for this user/exercise from past weeksBack weeks

### getSummary(user: User, exercise: Exercise, weeksBack: Number): Object

**Requires:** at least one workout exists

**Effects:** Return structured summary suitable for generating recommendations

### getLastWorkout(user: User, exercise: Exercise): WorkoutSet 

**Requires** at least one workout exists for this user and exercise

**Effects:** Return most recent set for pre-filling workout logging UI

