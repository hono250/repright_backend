# Design Evolution from Assignment 2

## Overview
This document tracks significant changes made to the RepRight concept design based on  feedback and implementation discoveries.

## Concept Refinements

### 1. WorkoutLog: Added getSummary Action
**Rationale:** ProgressionGuidance was improperly dependent on WorkoutLog's internal state. Concepts cannot directly access each other's state - they can only pass data through action return values in syncs.

**Change:** Added `getSummary()` action that outputs structured workout data (recent sets, session count, dates) suitable for LLM analysis. This creates a clean interface between concepts.

**Impact:** ProgressionGuidance now receives all necessary data through the sync without coupling to WorkoutLog's implementation.

---

### 2. ProgressionGuidance: Added User Interaction Actions
**Rationale:** There was missing actions for accepting/dismissing recommendations. The original design generated recommendations but had no way for users to act on them.

**Changes Added:**
- `acceptRecommendation()` - marks recommendation as accepted, returns values for workout logging
- `dismissRecommendation()` - allows user to reject suggestion
- `getRecommendationHistory()` - lets users browse past suggestions
- Added `status` field to Recommendation state ("pending" | "accepted" | "dismissed")

**Impact:** Users can now interact with AI suggestions rather than just viewing them. Supports what's described in the user journeys.

---

### 3. ProgressionGuidance: Removed recentSets Parameter
**Rationale:** Original design had `generateRecommendation()` accepting `recentSets: set of WorkoutSet`, which would require passing WorkoutLog's internal state structure. This violates concept independence.

**Change:** Replaced with `workoutSummary: Object` parameter that accepts the structured output from WorkoutLog's `getSummary()` action.

**Impact:** Maintains concept modularity 

---

### 4. UserAuthentication: Simplified for MVP
**Rationale:** For initial implementation, full session management with expiration is more complex than needed. Can iterate later.

**Change:** Kept session-based auth design but will implement with simpler token validation initially.

**Impact:** Allows focus on core fitness functionality while maintaining security basics.


## LLM Reliability Concerns
**Feedback:** Questions about LLm reliability on these tasks suggests plan for some fallbacks.

**Mitigation Strategies:**
1. **Validators** - Already implemented in A3: weight change limits, rep range checks, plateau-strategy consistency
2. **User control** - Accept/dismiss actions let users override bad suggestions
3. **Recommendation history** - Users can see all past suggestions to identify patterns of good/bad advice
4. **Multiple prompt variants** - Tested in A3, using Context-Aware variant that performs best
5. **Fallback UI** - If LLM fails, users can still manually log workouts without recommendations

---


# Key Design Evolution A4a → A4b

## 1. ExerciseLibrary Concept (New)

**Purpose**: Centralized exercise database with metadata to support both templates and workout logging
Key Operations:

- seedExercises() : Initializes database with common exercises on first load
- getExercise(name):  Retrieves exercise details including tracking type
- getAllExercises(): Returns full library for exercise picker

**Why Added**: Templates and WorkoutLog need to know if exercises are rep-based (weight × reps) or duration-based (time). Users can browse, watch demos on exercises, choose exercises to add to their workouts. 

## 2. WorkoutTemplate Concept (New)

Purpose: Enable users to save and reuse workout routines instead of rebuilding each session


# Key Design Evolution A4b → A4c

## 1. Authentication Implementation with Backend Syncs

**Challenge**: A4b had hardcoded userId for single-user testing. Multi-user deployment required proper authentication.

**Solution Implemented**:
- Token-based session management using `UserAuthentication` concept
- Backend syncs validate every authenticated request
- Frontend stores token in localStorage and includes in all API calls

**Security Model**:
- Backend extracts userId from verified token
- All concept actions use server-side userId
- Invalid tokens cause syncs to fail with authentication error

---

## 2. Requesting Concept Configuration

**Included Routes** (passthrough, no auth required):
- `/api/UserAuthentication/register` - public registration
- `/api/UserAuthentication/login` - public login
- `/api/ExerciseLibrary/seedGlobalExercises` - admin setup

**Excluded Routes** (require authentication via syncs):
- All WorkoutTemplate actions
- All ExerciseLibrary actions (except seeding)
- All WorkoutLog actions
- All ProgressionGuidance actions
- UserAuthentication: logout, deleteAccount

**Rationale**: Exclude all user-specific data operations to ensure proper access control. Only public-facing actions (register, login) remain as passthrough.

---

## 3. Frontend Architecture Refactoring

**API Service Pattern** (`src/api/index.ts`):
- Centralized all backend communication
- Automatic token injection: `{ ...params, token: getToken() }`
- Grouped by concept for maintainability
- Single source of truth for backend URL

**Before (A4b)**:
```javascript
// Scattered fetch calls with manual userId
const response = await fetch('/api/WorkoutTemplate/getTemplates', {
  body: JSON.stringify({ user: localStorage.getItem('userId') })
});
```

**After (A4c)**:
```javascript
// Clean API service with automatic auth
const data = await templates.getAll();  // Token injected automatically
```

**Impact**: Views don't handle authentication (separation of concerns.)

---

## 4. Implementation Scope Decisions

### Fully Implemented 
- Complete authentication flow with secure syncs
- Template CRUD with multi-user support
- Workout session tracking with AI recommendations
- Exercise library search and filtering
- Data persistence across user sessions

### Deferred to Future Iterations (TODO)
**ExerciseLibrary Custom Exercise UI**:
- Backend actions implemented and authenticated
- Frontend UI not built
- **Rationale**: Power-user feature; core flow prioritized

**Recommendation History View**:
- Backend `getRecommendationHistory()` works
- UI for browsing through recommendations not implemented
- **Rationale**: Current recommendation display sufficient for primary use case

**WorkoutLog History Visualization**:
- Backend `getHistory()` functional (used by AI)
- No chart/graph UI
- **Rationale**: Focused on logging and recommendations over retrospective analysis

**Design Philosophy**: Deliver complete user journey (plan -> execute -> optimize workouts) over feature breadth. Missing features are **UI gaps**, not **architectural gaps** - concepts and syncs support them.

---


