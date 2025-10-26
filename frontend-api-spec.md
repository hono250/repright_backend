# API Specification: WorkoutLog Concept

**Purpose:** Track workout performance over time

---

## API Endpoints

### POST /api/WorkoutLog/logSet

**Description:** Log a completed workout set with exercise, weight, reps, or duration.

**Requirements:**
- At least one of (reps > 0) or (duration > 0) must be provided
- weight, reps, and duration are optional (can be null)
- If weight provided, it must be >= 0
- reps and duration cannot both be provided (mutually exclusive)

**Effects:**
- Create new WorkoutSet with current date

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "weight": "number|null",
  "reps": "number|null",
  "duration": "number|null"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutLog/getHistory

**Description:** Get workout history for an exercise from past N weeks.

**Requirements:**
- weeksBack > 0

**Effects:**
- Return all sets for this user/exercise from past weeksBack weeks

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "weeksBack": "number"
}
```

**Success Response Body:**
```json
[
  {
    "weight": "number|null",
    "reps": "number|null",
    "duration": "number|null",
    "date": "Date"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutLog/getSummary

**Description:** Get structured summary for generating AI recommendations.

**Requirements:**
- At least one workout exists

**Effects:**
- Return structured summary for generating recommendations

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "weeksBack": "number"
}
```

**Success Response Body:**
```json
{
  "recentSets": [
    {
      "weight": "number|null",
      "reps": "number|null",
      "duration": "number|null",
      "date": "Date"
    }
  ],
  "sessionCount": "number",
  "lastWorkoutDate": "Date"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutLog/getLastWorkout

**Description:** Get most recent set for pre-filling workout logging UI.

**Requirements:**
- At least one workout exists

**Effects:**
- Return most recent set for this exercise

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string"
}
```

**Success Response Body:**
```json
{
  "weight": "number|null",
  "reps": "number|null",
  "duration": "number|null",
  "date": "Date"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: ExerciseLibrary Concept

**Purpose:** Provide searchable exercise database with metadata for workout planning

---

## API Endpoints

### POST /api/ExerciseLibrary/searchExercises

**Description:** Search exercises by name with optional filters.

**Requirements:**
- query not empty or at least one filter provided

**Effects:**
- Return exercises matching criteria where (isGlobal=true OR createdBy=user)

**Request Body:**
```json
{
  "user": "ID",
  "query": "string",
  "filters": {
    "muscleGroup": "string",
    "equipment": "string",
    "classification": "string",
    "forceType": "string"
  }
}
```

**Success Response Body:**
```json
[
  {
    "name": "string",
    "hasWeight": "boolean",
    "trackingType": "reps|duration",
    "isGlobal": "boolean",
    "targetMuscleGroup": "string",
    "equipment": "string",
    "exerciseClassification": "string",
    "forceType": "string",
    "posture": "string",
    "videoUrl": "string|null",
    "createdBy": "ID|null"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ExerciseLibrary/addCustomExercise

**Description:** Create custom exercise visible only to user.

**Requirements:**
- name not empty
- user authenticated
- trackingType is "reps" or "duration"

**Effects:**
- Create exercise with isGlobal=false, createdBy=user, optional metadata fields

**Request Body:**
```json
{
  "user": "ID",
  "name": "string",
  "hasWeight": "boolean",
  "trackingType": "reps|duration",
  "metadata": {
    "targetMuscleGroup": "string",
    "equipment": "string"
  }
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ExerciseLibrary/getExercise

**Description:** Get exercise details.

**Requirements:**
- exercise exists and (isGlobal=true OR createdBy=user)

**Effects:**
- Return exercise with all fields

**Request Body:**
```json
{
  "user": "ID",
  "name": "string"
}
```

**Success Response Body:**
```json
{
  "name": "string",
  "hasWeight": "boolean",
  "trackingType": "reps|duration",
  "targetMuscleGroup": "string",
  "equipment": "string",
  "videoUrl": "string|null"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: WorkoutTemplate Concept

**Purpose:** Save and reuse exercise groupings with target sets for quick workout starts

---

## API Endpoints

### POST /api/WorkoutTemplate/createTemplate

**Description:** Create new workout template.

**Requirements:**
- name not empty
- exercises list not empty
- user authenticated
- Each set must have targetReps or targetDuration
- targetReps and targetDuration cannot both be provided

**Effects:**
- Create template with exercises, sets, lastPerformed=null

**Request Body:**
```json
{
  "user": "ID",
  "name": "string",
  "exercises": [
    {
      "exercise": "string",
      "sets": [
        {
          "targetWeight": "number|null",
          "targetReps": "number|null",
          "targetDuration": "number|null",
          "restTimer": "number"
        }
      ]
    }
  ]
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutTemplate/getTemplates

**Description:** Get all templates for user.

**Requirements:**
- user authenticated

**Effects:**
- Return all templates for user, sorted by lastPerformed

**Request Body:**
```json
{
  "user": "ID"
}
```

**Success Response Body:**
```json
[
  {
    "name": "string",
    "exercises": [],
    "lastPerformed": "Date|null"
  }
]
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

---

### POST /api/WorkoutTemplate/getTemplate

**Description:** Get specific template with full exercise and set details.

**Requirements:**
- template exists for user with name

**Effects:**
- Return template

**Request Body:**
```json
{
  "user": "ID",
  "name": "string"
}
```

**Success Response Body:**
```json
{
  "name": "string",
  "exercises": [
    {
      "exercise": "string",
      "sets": [
        {
          "targetWeight": "number|null",
          "targetReps": "number|null",
          "targetDuration": "number|null",
          "restTimer": "number"
        }
      ]
    }
  ],
  "lastPerformed": "Date|null"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutTemplate/updateTemplate

**Description:** Update existing template's exercises and sets.

**Requirements:**
- template exists for user
- exercises not empty

**Effects:**
- Update template structure, preserve lastPerformed

**Request Body:**
```json
{
  "user": "ID",
  "name": "string",
  "exercises": [
    {
      "exercise": "string",
      "sets": [
        {
          "targetWeight": "number|null",
          "targetReps": "number|null",
          "targetDuration": "number|null",
          "restTimer": "number"
        }
      ]
    }
  ]
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutTemplate/deleteTemplate

**Description:** Delete template.

**Requirements:**
- template exists for user

**Effects:**
- Remove template

**Request Body:**
```json
{
  "user": "ID",
  "name": "string"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/WorkoutTemplate/markTemplateUsed

**Description:** Update lastPerformed date after completing workout.

**Requirements:**
- template exists for user

**Effects:**
- Set lastPerformed to date

**Request Body:**
```json
{
  "user": "ID",
  "name": "string",
  "date": "Date"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: ProgressionGuidance Concept

**Purpose:** Provide AI-powered workout progression recommendations to help users break through plateaus

---

## API Endpoints

### POST /api/ProgressionGuidance/generateRecommendationLLM

**Description:** Generate AI recommendation based on workout history.

**Requirements:**
- workoutSummary contains valid recent sets
- LLM is configured and available

**Effects:**
- Create recommendation with AI-generated suggestions

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "workoutSummary": {
    "recentSets": [
      {
        "weight": "number|null",
        "reps": "number|null",
        "duration": "number|null",
        "date": "Date"
      }
    ],
    "sessionCount": "number",
    "lastWorkoutDate": "Date"
  },
  "llm": "LLM"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ProgressionGuidance/getRecommendation

**Description:** Get latest recommendation for exercise.

**Requirements:**
- recommendation exists for user and exercise

**Effects:**
- Return most recent recommendation

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string"
}
```

**Success Response Body:**
```json
{
  "suggestedWeight": "number|null",
  "suggestedReps": "number|null",
  "reasoning": "string",
  "plateauDetected": "boolean",
  "interventionStrategy": "string",
  "createdAt": "Date"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ProgressionGuidance/acceptRecommendation

**Description:** Accept recommendation and return suggested values.

**Requirements:**
- recommendation exists for user, exercise, and createdAt

**Effects:**
- Mark recommendation as accepted, return suggested values

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "createdAt": "Date"
}
```

**Success Response Body:**
```json
{
  "suggestedWeight": "number|null",
  "suggestedReps": "number|null"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/ProgressionGuidance/dismissRecommendation

**Description:** Dismiss recommendation.

**Requirements:**
- recommendation exists for user, exercise, and createdAt

**Effects:**
- Mark recommendation as dismissed

**Request Body:**
```json
{
  "user": "ID",
  "exercise": "string",
  "createdAt": "Date"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

# API Specification: UserAuthentication Concept

**Purpose:** Securely authenticate and manage user sessions

---

## API Endpoints

### POST /api/UserAuthentication/register

**Description:** Register new user account.

**Requirements:**
- username not empty
- password meets minimum requirements
- username not already taken

**Effects:**
- Create new user with hashed password

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body:**
```json
{
  "userId": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuthentication/login

**Description:** Login user and create session.

**Requirements:**
- username exists
- password matches

**Effects:**
- Create session token for user

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response Body:**
```json
{
  "token": "string"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuthentication/authenticate

**Description:** Verify session token.

**Requirements:**
- token exists and is valid

**Effects:**
- Return authenticated user ID

**Request Body:**
```json
{
  "token": "string"
}
```

**Success Response Body:**
```json
{
  "userId": "ID"
}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---

### POST /api/UserAuthentication/logout

**Description:** Logout user and invalidate session.

**Requirements:**
- token exists

**Effects:**
- Remove session token

**Request Body:**
```json
{
  "token": "string"
}
```

**Success Response Body:**
```json
{}
```

**Error Response Body:**
```json
{
  "error": "string"
}
```

---