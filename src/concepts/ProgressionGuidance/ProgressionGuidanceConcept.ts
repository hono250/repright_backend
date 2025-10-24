import { Collection, Db } from "npm:mongodb";
import { ID, User, Exercise } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

/**
 * Recommendation document in MongoDB
 */
interface RecommendationDoc {
  _id: ID;
  user: User;
  exercise: Exercise;
  suggestedWeight: number;
  suggestedReps: number;
  reasoning: string;
  plateauDetected: boolean;
  interventionStrategy: string;
  status: "pending" | "accepted" | "dismissed";
  createdAt: Date;
}

/**
 * Workout summary structure (passed from WorkoutLog.getSummary())
 */
export interface WorkoutSummary {
  recentSets: Array<{ weight: number; reps: number; date: Date }>;
  sessionCount: number;
  lastWorkoutDate: Date;
}

/**
 * LLM interface (simple wrapper)
 */
export interface LLM {
  executeLLM(prompt: string): Promise<string>;
}

export default class ProgressionGuidanceConcept {
  private readonly recommendations: Collection<RecommendationDoc>;

  constructor(private readonly db: Db) {
    this.recommendations = db.collection("recommendations");
  }

  /**
   * Generate AI-powered recommendation
   */
  async generateRecommendationLLM(
    user: User,
    exercise: Exercise,
    workoutSummary: WorkoutSummary,
    llm: LLM
  ): Promise<void> {
    if (workoutSummary.recentSets.length < 3) {
      throw new Error("Need at least 3 recent sets to generate recommendation");
    }

    const prompt = this.createPrompt(exercise, workoutSummary);
    const response = await llm.executeLLM(prompt);
    
    const parsed = this.parseAndValidate(response, workoutSummary);

    await this.recommendations.insertOne({
      _id: freshID(),
      user,
      exercise,
      suggestedWeight: parsed.suggestedWeight,
      suggestedReps: parsed.suggestedReps,
      reasoning: parsed.reasoning,
      plateauDetected: parsed.plateauDetected,
      interventionStrategy: parsed.interventionStrategy,
      status: "pending",
      createdAt: new Date(),
    });
  }

  /**
   * Get most recent recommendation for exercise
   */
  async getRecommendation(user: User, exercise: Exercise): Promise<RecommendationDoc | null> {
    const rec = await this.recommendations
      .find({ user, exercise })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    return rec.length > 0 ? rec[0] : null;
  }

  /**
   * Accept recommendation - returns values to use in workout
   */
  async acceptRecommendation(user: User, exercise: Exercise, createdAt: Date): Promise<{ suggestedWeight: number; suggestedReps: number }> {
    const rec = await this.recommendations.findOne({ user, exercise, createdAt, status: "pending" });
    
    if (!rec) {
      throw new Error("Recommendation not found or already processed");
    }

    await this.recommendations.updateOne(
      { user, exercise, createdAt },
      { $set: { status: "accepted" } }
    );

    return {
      suggestedWeight: rec.suggestedWeight,
      suggestedReps: rec.suggestedReps,
    };
  }

  /**
   * Dismiss recommendation
   */
  async dismissRecommendation(user: User, exercise: Exercise, createdAt: Date): Promise<void> {
    const result = await this.recommendations.updateOne(
      { user, exercise, createdAt, status: "pending" },
      { $set: { status: "dismissed" } }
    );

    if (result.matchedCount === 0) {
      throw new Error("Recommendation not found or already processed");
    }
  }

  /**
   * Get all recommendations for browsing history
   */
  async getRecommendationHistory(user: User, exercise: Exercise): Promise<RecommendationDoc[]> {
    return await this.recommendations
      .find({ user, exercise })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Create Context-Aware prompt (best variant from A3)
   */
  private createPrompt(exercise: Exercise, summary: WorkoutSummary): string {
    const setsSummary = summary.recentSets
      .map(s => `${s.date.toISOString().split('T')[0]}: ${s.weight}lbs × ${s.reps} reps`)
      .join('\n');

    return `You are an expert strength training coach analyzing ${exercise} performance.

YOUR RECENT WORKOUT HISTORY:
${setsSummary}

Session count: ${summary.sessionCount}
Last workout: ${summary.lastWorkoutDate.toISOString().split('T')[0]}

ANALYSIS GUIDELINES:
- Use your knowledge of this exercise to determine appropriate progression rates
- Consider whether this is a compound or isolation movement
- Account for typical fatigue patterns in this exercise
- Rep drops within a single session are normal - don't confuse with plateau
- TRUE PLATEAU: Same weight AND similar reps across 3+ DIFFERENT workout dates
- Only recommend deload if truly plateaued across multiple sessions

Return ONLY valid JSON:
{
  "suggestedWeight": number,
  "suggestedReps": number,
  "plateauDetected": boolean,
  "reasoning": "explain using 'you' - talk directly to athlete",
  "interventionStrategy": "deload/maintain/progress/variation"
}`;
  }

  /**
   * Parse and validate LLM response
   */
  private parseAndValidate(response: string, summary: WorkoutSummary): any {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in LLM response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validator 1: Reasonable weight change (max 20% from recent average)
    const recentWeights = summary.recentSets.slice(-6).map(s => s.weight);
    const avgWeight = recentWeights.reduce((a, b) => a + b, 0) / recentWeights.length;
    const percentChange = Math.abs((parsed.suggestedWeight - avgWeight) / avgWeight) * 100;
    
    if (percentChange > 20) {
      throw new Error(`Suggested weight (${parsed.suggestedWeight}lbs) is ${percentChange.toFixed(1)}% different from recent average (${avgWeight.toFixed(1)}lbs). Max allowed: 20%.`);
    }

    // Validator 2: Rep range sanity (1-20)
    if (parsed.suggestedReps < 1 || parsed.suggestedReps > 20) {
      throw new Error(`Suggested reps (${parsed.suggestedReps}) outside reasonable range (1-20).`);
    }

    // Validator 3: Plateau-strategy consistency
    if (parsed.plateauDetected === true) {
      const validStrategies = ['deload', 'maintain', 'variation'];
      const strategy = parsed.interventionStrategy?.toLowerCase() || '';
      
      if (!validStrategies.some(s => strategy.includes(s))) {
        throw new Error(`Plateau detected but intervention strategy "${parsed.interventionStrategy}" is not deload/maintain/variation.`);
      }
    }

    return parsed;
  }
}

