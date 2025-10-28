import { Collection, Db } from "npm:mongodb";
import { ID, User, Exercise, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";

interface TargetSet {
  targetWeight: number | null;
  targetReps: number | null;
  targetDuration: number | null;
  restTimer: number; // seconds
}

interface TemplateExercise {
  exercise: Exercise;
  sets: TargetSet[];
}

interface TemplateDoc {
  _id: ID;
  user: User;
  name: string;
  exercises: TemplateExercise[];
  lastPerformed: Date | null;
}

export type { TargetSet, TemplateExercise, TemplateDoc };

export default class WorkoutTemplateConcept {
  private readonly templates: Collection<TemplateDoc>;

  constructor(private readonly db: Db) {
    this.templates = db.collection("workoutTemplates");
  }

  /**
   * Create new template
   */
  async createTemplate(params: {
    user: User;
    name: string;
    exercises: TemplateExercise[];
  }): Promise<Empty> {
    const { user, name, exercises } = params;
    
    if (!name.trim()) {
      throw new Error("Template name required");
    }

    if (exercises.length === 0) {
      throw new Error("Template must have at least one exercise");
    }

    // Validate each set
    for (const ex of exercises) {
      for (const set of ex.sets) {
        if (!set.targetReps && !set.targetDuration) {
          throw new Error("Each set must have targetReps or targetDuration");
        }
        if (set.targetReps && set.targetDuration) {
          throw new Error("Set cannot have both targetReps and targetDuration");
        }
      }
    }

    await this.templates.insertOne({
      _id: freshID(),
      user,
      name: name.trim(),
      exercises,
      lastPerformed: null,
    });

    return {} as Empty;
  }

  /**
   * Get all templates for user
   */
  async getTemplates(params: { user: User }): Promise<{ templates: TemplateDoc[] }> {
    const { user } = params;
    
    const templates = await this.templates
      .find({ user })
      .sort({ lastPerformed: -1 }) // Most recent first, nulls last
      .toArray();

    return { templates };
  }

  /**
   * Get specific template
   */
  async getTemplate(params: { user: User; name: string }): Promise<{ template: TemplateDoc }> {
    const { user, name } = params;
    
    const template = await this.templates.findOne({ user, name });

    if (!template) {
      throw new Error("Template not found");
    }

    return { template };
  }

  /**
   * Update template exercises/sets
   */
  async updateTemplate(params: {
    user: User;
    name: string;
    exercises: TemplateExercise[];
  }): Promise<Empty> {
    const { user, name, exercises } = params;
    
    if (exercises.length === 0) {
      throw new Error("Template must have at least one exercise");
    }

    // Validate sets
    for (const ex of exercises) {
      for (const set of ex.sets) {
        if (!set.targetReps && !set.targetDuration) {
          throw new Error("Each set must have targetReps or targetDuration");
        }
        if (set.targetReps && set.targetDuration) {
          throw new Error("Set cannot have both targetReps and targetDuration");
        }
      }
    }

    const result = await this.templates.updateOne(
      { user, name },
      { $set: { exercises } } // Preserve lastPerformed
    );

    if (result.matchedCount === 0) {
      throw new Error("Template not found");
    }

    return {} as Empty;
  }

  /**
   * Delete template
   */
  async deleteTemplate(params: { user: User; name: string }): Promise<Empty> {
    const { user, name } = params;
    
    const result = await this.templates.deleteOne({ user, name });

    if (result.deletedCount === 0) {
      throw new Error("Template not found");
    }

    return {} as Empty;
  }

  /**
   * Mark template as used
   */
  async markTemplateUsed(params: { user: User; name: string; date: Date }): Promise<Empty> {
    const { user, name, date } = params;
    
    const result = await this.templates.updateOne(
      { user, name },
      { $set: { lastPerformed: date } }
    );

    if (result.matchedCount === 0) {
      throw new Error("Template not found");
    }

    return {} as Empty;
  }
}