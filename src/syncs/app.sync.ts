import { actions, Sync } from "@engine";
import { 
  Requesting, 
  UserAuthentication, 
  ExerciseLibrary, 
  WorkoutLog, 
  ProgressionGuidance, 
  WorkoutTemplate 
} from "@concepts";

// ============================================================
// AUTHENTICATION SYNCS
// ============================================================

// === WorkoutTemplate Syncs ===
export const GetTemplatesRequest: Sync = ({ token, user }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/getTemplates", token }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.getTemplates, { user }]),
});

export const GetTemplatesResponse: Sync = ({ request, templates }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/getTemplates" }, { request }],
    [WorkoutTemplate.getTemplates, {}, { templates }]
  ),
  then: actions([Requesting.respond, { request, templates }]),
});

export const CreateTemplateRequest: Sync = ({ token, user, name, exercises }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/createTemplate", token, name, exercises }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.createTemplate, { user, name, exercises }]),
});

export const CreateTemplateResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/createTemplate" }, { request }],
    [WorkoutTemplate.createTemplate, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const GetTemplateRequest: Sync = ({ token, user, name }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/getTemplate", token, name }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.getTemplate, { user, name }]),
});

export const GetTemplateResponse: Sync = ({ request, template }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/getTemplate" }, { request }],
    [WorkoutTemplate.getTemplate, {}, { template }]
  ),
  then: actions([Requesting.respond, { request, template }]),
});

export const UpdateTemplateRequest: Sync = ({ token, user, name, exercises }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/updateTemplate", token, name, exercises }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.updateTemplate, { user, name, exercises }]),
});

export const UpdateTemplateResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/updateTemplate" }, { request }],
    [WorkoutTemplate.updateTemplate, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteTemplateRequest: Sync = ({ token, user, name }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/deleteTemplate", token, name }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.deleteTemplate, { user, name }]),
});


export const DeleteTemplateResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/deleteTemplate" }, { request }],
    [WorkoutTemplate.deleteTemplate, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const MarkTemplateUsedRequest: Sync = ({ token, user, name, date }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/markTemplateUsed", token, name, date }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutTemplate.markTemplateUsed, { user, name, date }]),
});

export const MarkTemplateUsedResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutTemplate/markTemplateUsed" }, { request }],
    [WorkoutTemplate.markTemplateUsed, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

// === ExerciseLibrary Syncs ===
export const SearchExercisesRequest: Sync = ({ token, user, query, filters }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/searchExercises", token, query, filters }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ExerciseLibrary.searchExercises, { user, query, filters }]),
});

export const SearchExercisesResponse: Sync = ({ request, exercises }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/searchExercises" }, { request }],
    [ExerciseLibrary.searchExercises, {}, { exercises }]
  ),
  then: actions([Requesting.respond, { request, exercises }]),
});

export const AddCustomExerciseRequest: Sync = ({ token, user, name, hasWeight, trackingType, metadata }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addCustomExercise", token, name, hasWeight, trackingType, metadata }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ExerciseLibrary.addCustomExercise, { user, name, hasWeight, trackingType, metadata }]),
});

export const AddCustomExerciseResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/addCustomExercise" }, { request }],
    [ExerciseLibrary.addCustomExercise, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const GetExerciseRequest: Sync = ({ token, user, name }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/getExercise", token, name }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ExerciseLibrary.getExercise, { user, name }]),
});

export const GetExerciseResponse: Sync = ({ request, exercise }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/getExercise" }, { request }],
    [ExerciseLibrary.getExercise, {}, { exercise }]
  ),
  then: actions([Requesting.respond, { request, exercise }]),
});

export const UpdateCustomExerciseRequest: Sync = ({ token, user, name, updates }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/updateCustomExercise", token, name, updates }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ExerciseLibrary.updateCustomExercise, { user, name, updates }]),
});

export const UpdateCustomExerciseResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/updateCustomExercise" }, { request }],
    [ExerciseLibrary.updateCustomExercise, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteCustomExerciseRequest: Sync = ({ token, user, name }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/deleteCustomExercise", token, name }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ExerciseLibrary.deleteCustomExercise, { user, name }]),
});

export const DeleteCustomExerciseResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ExerciseLibrary/deleteCustomExercise" }, { request }],
    [ExerciseLibrary.deleteCustomExercise, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

// === WorkoutLog Syncs ===
export const LogSetRequest: Sync = ({ token, user, exercise, weight, reps, duration }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/logSet", token, exercise, weight, reps, duration }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutLog.logSet, { user, exercise, weight, reps, duration }]),
});

export const LogSetResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/logSet" }, { request }],
    [WorkoutLog.logSet, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const GetLastWorkoutRequest: Sync = ({ token, user, exercise }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getLastWorkout", token, exercise }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutLog.getLastWorkout, { user, exercise }]),
});


export const GetLastWorkoutResponse: Sync = ({ request, weight, reps, date }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getLastWorkout" }, { request }],
    [WorkoutLog.getLastWorkout, {}, { weight, reps, date }]
  ),
  then: actions([Requesting.respond, { request, weight, reps, date }]),
});

export const GetHistoryRequest: Sync = ({ token, user, exercise, weeksBack }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getHistory", token, exercise, weeksBack }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutLog.getHistory, { user, exercise, weeksBack }]),
});

export const GetHistoryResponse: Sync = ({ request, history }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getHistory" }, { request }],
    [WorkoutLog.getHistory, {}, { history }]
  ),
  then: actions([Requesting.respond, { request, history }]),
});

export const GetSummaryRequest: Sync = ({ token, user, exercise, weeksBack }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getSummary", token, exercise, weeksBack }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([WorkoutLog.getSummary, { user, exercise, weeksBack }]),
});

export const GetSummaryResponse: Sync = ({ request, summary }) => ({
  when: actions(
    [Requesting.request, { path: "/WorkoutLog/getSummary" }, { request }],
    [WorkoutLog.getSummary, {}, { summary }]
  ),
  then: actions([Requesting.respond, { request, summary }]),
});

// === ProgressionGuidance Syncs ===
export const GenerateRecommendationRequest: Sync = ({ token, user, exercise, workoutSummary }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/generateRecommendationLLM", token, exercise, workoutSummary }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ProgressionGuidance.generateRecommendationLLM, { user, exercise, workoutSummary }]),
});

export const GenerateRecommendationResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/generateRecommendationLLM" }, { request }],
    [ProgressionGuidance.generateRecommendationLLM, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const GetRecommendationRequest: Sync = ({ token, user, exercise }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/getRecommendation", token, exercise }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ProgressionGuidance.getRecommendation, { user, exercise }]),
});

export const GetRecommendationResponse: Sync = ({ request, recommendation }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/getRecommendation" }, { request }],
    [ProgressionGuidance.getRecommendation, {}, { recommendation }]
  ),
  then: actions([Requesting.respond, { request, recommendation }]),
});

export const AcceptRecommendationRequest: Sync = ({ token, user, exercise, createdAt }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/acceptRecommendation", token, exercise, createdAt }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ProgressionGuidance.acceptRecommendation, { user, exercise, createdAt }]),
});

export const AcceptRecommendationResponse: Sync = ({ request, suggestedWeight, suggestedReps }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/acceptRecommendation" }, { request }],
    [ProgressionGuidance.acceptRecommendation, {}, { suggestedWeight, suggestedReps }]
  ),
  then: actions([Requesting.respond, { request, suggestedWeight, suggestedReps }]),
});

export const DismissRecommendationRequest: Sync = ({ token, user, exercise, createdAt }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/dismissRecommendation", token, exercise, createdAt }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ProgressionGuidance.dismissRecommendation, { user, exercise, createdAt }]),
});

export const DismissRecommendationResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/dismissRecommendation" }, { request }],
    [ProgressionGuidance.dismissRecommendation, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const GetRecommendationHistoryRequest: Sync = ({ token, user, exercise }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/getRecommendationHistory", token, exercise }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([ProgressionGuidance.getRecommendationHistory, { user, exercise }]),
});

export const GetRecommendationHistoryResponse: Sync = ({ request, recommendations }) => ({
  when: actions(
    [Requesting.request, { path: "/ProgressionGuidance/getRecommendationHistory" }, { request }],
    [ProgressionGuidance.getRecommendationHistory, {}, { recommendations }]
  ),
  then: actions([Requesting.respond, { request, recommendations }]),
});

// === UserAuthentication Syncs ===
export const LogoutRequest: Sync = ({ token }) => ({
  when: actions([Requesting.request, { path: "/UserAuthentication/logout", token }, {}]),
  then: actions([UserAuthentication.logout, { token }]),
});

export const LogoutResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/logout" }, { request }],
    [UserAuthentication.logout, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const DeleteAccountRequest: Sync = ({ token, user }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/deleteAccount", token }, {}],
  ),
  where: async (frames) => {
    const tokenValue = frames[0][token] as string;
    const result = await UserAuthentication.authenticate({ token: tokenValue });
    return frames.map(f => ({ ...f, [user]: result.userId }));
  },
  then: actions([UserAuthentication.deleteAccount, { userId: user }]),
});

export const DeleteAccountResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/deleteAccount" }, { request }],
    [UserAuthentication.deleteAccount, {}, {}]
  ),
  then: actions([Requesting.respond, { request }]),
});

export const AuthenticateRequest: Sync = ({ token }) => ({
  when: actions([Requesting.request, { path: "/UserAuthentication/authenticate", token }, {}]),
  then: actions([UserAuthentication.authenticate, { token }]),
});

export const AuthenticateResponse: Sync = ({ request, userId }) => ({
  when: actions(
    [Requesting.request, { path: "/UserAuthentication/authenticate" }, { request }],
    [UserAuthentication.authenticate, {}, { userId }]
  ),
  then: actions([Requesting.respond, { request, userId }]),
});