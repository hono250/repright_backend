import { Collection, Db } from "npm:mongodb";
import { ID, Empty,  User, Exercise } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";


/**
 * WorkoutSet document stored in MongoDB
 */
interface WorkoutSetDoc {
  _id: ID;
  user: User;
  exercise: Exercise;
  weight: number | null;
  reps: number | null;
  duration: number | null;
  date: Date;
}

/**
 * Summary structure for passing to ProgressionGuidance
 */
export interface WorkoutSummary {
  recentSets: Array<{ 
    weight: number | null; 
    reps: number | null; 
    duration: number | null;  // ADD THIS
    date: Date 
  }>;
  sessionCount: number;
  lastWorkoutDate: Date;
}

export default class WorkoutLogConcept {
  private readonly sets: Collection<WorkoutSetDoc>;

  constructor(private readonly db: Db) {
    this.sets = db.collection("workoutSets");
  }

  /**
   * Log a new set
   */
async logSet( 
  user: User, 
  exercise: Exercise, 
  weight: number | null = null, 
  reps: number | null = null, 
  duration: number | null = null
): Promise<void> {
  
  // Validation
  if (!reps && !duration) {
    throw new Error("Must provide either reps or duration");
  }
  if (reps && duration) {
    throw new Error("Cannot provide both reps and duration");
  }
  if (weight !== null && weight < 0) {
    throw new Error("Weight must be >= 0");
  }
  if (reps !== null && reps <= 0) {
    throw new Error("Reps must be > 0");
  }
  if (duration !== null && duration <= 0) {
    throw new Error("Duration must be > 0");
  }

  await this.sets.insertOne({
    _id: freshID(),
    user,
    exercise,
    weight,
    reps,
    duration,
    date: new Date(),
  });
}

  /**
   * Get most recent workout for pre-filling UI
   */
  async getLastWorkout(user: User, exercise: Exercise) {
    const lastSet = await this.sets
      .find({ user, exercise })
      .sort({ date: -1 })
      .limit(1)
      .toArray();

    if (lastSet.length === 0) {
      throw new Error("No workout history found");
    }

    const { weight, reps, date } = lastSet[0];
    return { weight, reps, date };
  }

  /**
   * Get workout history for past N weeks
   */
  async getHistory(user: User, exercise: Exercise, weeksBack: number = 4): Promise<WorkoutSetDoc[]> {
    if (weeksBack <= 0) {
      throw new Error("weeksBack must be > 0");
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - (weeksBack * 7));

    return await this.sets
      .find({
        user,
        exercise,
        date: { $gte: cutoffDate },
      })
      .sort({ date: 1 })
      .toArray();
  }

  /**
   * Get structured summary for LLM analysis
   */
  async getSummary(user: User, exercise: Exercise, weeksBack: number = 4): Promise<WorkoutSummary> {
  const history = await this.getHistory(user, exercise, weeksBack);

  if (history.length === 0) {
    throw new Error("No workout history found");
  }

  const sessionDates = new Set(history.map(s => s.date.toDateString()));

  return {
    recentSets: history.map(s => ({
      weight: s.weight,
      reps: s.reps,
      duration: s.duration,  // ADD THIS
      date: s.date,
    })),
    sessionCount: sessionDates.size,
    lastWorkoutDate: history[history.length - 1].date,
  };
}

}