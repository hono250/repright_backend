# ProgressionGuidance [User, Exercise]

## Purpose
Provide intelligent, LLM-powered recommendations for workout progression

## Operational Principle
After analyzing structured workout summary data, system generates personalized recommendation with reasoning. User can accept to apply it, dismiss it, or save for later review.

## State
    a set of Recommendations with
      a user User
      an exercise Exercise
      a suggestedWeight Number
      a suggestedReps Number
      a reasoning String
      a plateauDetected Boolean
      a interventionStrategy String
      a status String ("pending" | "accepted" | "dismissed")
      a createdAt Date

## Actions

### generateRecommendationLLM(user: User, exercise: Exercise, workoutSummary: Object, llm: LLM): Recommendation

**Requires:** workoutSummary contains at least 3 recent sets

**Effects:** use LLM to analyze patterns and create recommendation with status pending

### getRecommendation(user: User, exercise: Exercise): 
**Requires** recommendation exists for this user and exercise
    
**Effects:** return most recent recommendation

### acceptRecommendation (user: User, exercise: Exercise, createdAt: Date): (suggestedWeight: Number, suggestedReps: Number)
**Requires** recommendation exists with status pending
    
**Effects** update status to accepted, return suggested values

### dismissRecommendation (user: User, exercise: Exercise, createdAt: Date)
**Requires** recommendation exists with status pending
    
**effects** update status to dismissed

### getRecommendationHistory (user: User, exercise: Exercise): set of Recommendation
**effects** return all recommendations for this user/exercise allowing user to browse through