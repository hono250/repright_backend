/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  "/api/UserAuthentication/register": "public - allow new users",
  "/api/UserAuthentication/login": "public - authenticate users",
  "/api/ExerciseLibrary/seedGlobalExercises": "admin setup",
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // ExerciseLibrary
  "/api/ExerciseLibrary/searchExercises",
  "/api/ExerciseLibrary/addCustomExercise",
  "/api/ExerciseLibrary/getExercise",
  "/api/ExerciseLibrary/updateCustomExercise",
  "/api/ExerciseLibrary/deleteCustomExercise",
  
  // ProgressionGuidance
  "/api/ProgressionGuidance/generateRecommendationLLM",
  "/api/ProgressionGuidance/getRecommendation",
  "/api/ProgressionGuidance/acceptRecommendation",
  "/api/ProgressionGuidance/dismissRecommendation",
  "/api/ProgressionGuidance/getRecommendationHistory",
  "/api/ProgressionGuidance/createPrompt",        // private method
  "/api/ProgressionGuidance/parseAndValidate",    // private method
  
  // UserAuthentication
  "/api/UserAuthentication/logout",
  "/api/UserAuthentication/deleteAccount",
  "/api/UserAuthentication/authenticate",
  
  // WorkoutLog
  "/api/WorkoutLog/logSet",
  "/api/WorkoutLog/getLastWorkout",
  "/api/WorkoutLog/getHistory",
  "/api/WorkoutLog/getSummary",
  
  // WorkoutTemplate
  "/api/WorkoutTemplate/createTemplate",
  "/api/WorkoutTemplate/getTemplates",
  "/api/WorkoutTemplate/getTemplate",
  "/api/WorkoutTemplate/updateTemplate",
  "/api/WorkoutTemplate/deleteTemplate",
  "/api/WorkoutTemplate/markTemplateUsed",
];
