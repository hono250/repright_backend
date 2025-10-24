# WorkoutTemplate [User, Exercise]

## Purpose
Save and reuse exercise groupings with target sets for quick workout starts

## Operational Principle
After user creates template with exercises, target set counts, and rest times, they can load template to start a workout session with pre-configured exercises.

## State
```
a set of Templates with
  a user User
  a name String
  a exercises list of TemplateExercise with
    a sets list of TargetSet with
      a targetWeight Number (optional, null if bodyweight)
      a targetReps Number (optional, null if timed)
      a targetDuration Number (optional, null if not timed, in seconds)
      a restTimer Number (seconds, default 90)
  a lastPerformed Date (optional, null if never used)

```

### Actions

### createTemplate(user: User, name: String, exercises: list of TemplateExercise)
**Requires**: name not empty, exercises list not empty, user authenticated, TargetSet must have at least one of: targetReps > 0 OR targetDuration > 0 ,targetReps and targetDuration cannot both be provided

**Effects**: Create new workout template with exercises, sets, and lastPerformed=null

### getTemplates(user: User): Set of Template
**Requires**: user authenticated

**Effects**: Return all templates for user, sorted by lastPerformed (most recent first)

### getTemplate(user: User, name: String): Template
**Requires**: template exists for user with name

**Effects**: Return specific template with full exercise and set details

### updateTemplate(user: User, name: String, exercises: list of TemplateExercise)

**Requires**: template exists for user, exercises not empty

**Effects**: Update existing template structure, preserve lastPerformed

### deleteTemplate(user: User, name: String)

**Requires**: template exists for user

**Effects**: Remove template

### markTemplateUsed(user: User, name: String, date: Date)

**Requires**: template exists for user

**Effects**: Set lastPerformed to date