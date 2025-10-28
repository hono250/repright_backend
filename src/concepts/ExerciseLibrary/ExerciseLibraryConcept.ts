import { Collection, Db } from "npm:mongodb";
import { ID, User, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";


// Enum types
type MuscleGroup = "Chest" | "Back" | "Shoulders" | "Arms" | "Legs" | "Core" | "Glutes" | "Full Body" | "Other";
type Equipment = "Barbell" | "Dumbbell" | "Kettlebell" | "Machine" | "Cable" | "Bodyweight" | "Resistance Band" | "Other";
type Classification = "Bodybuilding" | "Powerlifting" | "Calisthenics" | "Olympic Weightlifting" | "Functional" | "Other";
type ForceType = "Push" | "Pull" | "Static" | "Other";
type Posture = "Standing" | "Seated" | "Supine" | "Prone" | "Quadruped" | "Bridge" | "Other";
type TrackingType = "reps" | "duration";

interface ExerciseDoc {
  _id: ID;
  name: string;
  hasWeight: boolean;
  trackingType: TrackingType;
  isGlobal: boolean;
  targetMuscleGroup?: MuscleGroup;
  primeMoverMuscle?: string;
  equipment?: Equipment;
  exerciseClassification?: Classification;
  forceType?: ForceType;
  posture?: Posture;
  videoUrl?: string;
  createdBy?: User;
}

export interface SearchFilters {
  muscleGroup?: MuscleGroup;
  equipment?: Equipment;
  classification?: Classification;
  forceType?: ForceType;
}

export default class ExerciseLibraryConcept {
  private readonly exercises: Collection<ExerciseDoc>;

  constructor(private readonly db: Db) {
    this.exercises = db.collection("exercises");
  }

  /**
   * Search exercises with filters
   */
  async searchExercises(params: { user: User; query: string; filters?: SearchFilters }): Promise<{ exercises: ExerciseDoc[] }> {
    const { user, query, filters = {} } = params;
    
    if (!query && Object.keys(filters).length === 0) {
      throw new Error("Query or at least one filter required");
    }

    const searchQuery: any = {
      $or: [{ isGlobal: true }, { createdBy: user }],
    };

    if (query) {
      searchQuery.name = { $regex: query, $options: "i" };
    }

    if (filters.muscleGroup) {
      searchQuery.targetMuscleGroup = filters.muscleGroup;
    }
    if (filters.equipment) {
      searchQuery.equipment = filters.equipment;
    }
    if (filters.classification) {
      searchQuery.exerciseClassification = filters.classification;
    }
    if (filters.forceType) {
      searchQuery.forceType = filters.forceType;
    }

    const exercises = await this.exercises.find(searchQuery).toArray();
    return { exercises };
  }

  /**
   * Add custom exercise
   */
  async addCustomExercise(params: {
    user: User;
    name: string;
    hasWeight: boolean;
    trackingType: TrackingType;
    metadata?: Partial<ExerciseDoc>;
  }): Promise<Empty> {
    const { user, name, hasWeight, trackingType, metadata = {} } = params;
    
    if (!name.trim()) {
      throw new Error("Exercise name required");
    }

    await this.exercises.insertOne({
      _id: freshID(),
      name: name.trim(),
      hasWeight,
      trackingType, 
      isGlobal: false,
      createdBy: user,
      ...metadata,
    });

    return {} as Empty;
  }

  /**
   * Get specific exercise
   */
  async getExercise(params: { user: User; name: string }): Promise<{ exercise: ExerciseDoc }> {
    const { user, name } = params;
    
    const exercise = await this.exercises.findOne({
      name,
      $or: [{ isGlobal: true }, { createdBy: user }],
    });

    if (!exercise) {
      throw new Error("Exercise not found");
    }

    return { exercise };
  }

  /**
   * Update custom exercise
   */
  async updateCustomExercise(params: { user: User; name: string; updates: Partial<ExerciseDoc> }): Promise<Empty> {
    const { user, name, updates } = params;
    
    // Remove immutable fields from updates
    const { hasWeight, trackingType, ...allowedUpdates } = updates;
    
    if (Object.keys(allowedUpdates).length === 0) {
      throw new Error("No valid fields to update");
    }

    const result = await this.exercises.updateOne(
      { name, createdBy: user, isGlobal: false },
      { $set: allowedUpdates }
    );

    if (result.matchedCount === 0) {
      throw new Error("Custom exercise not found");
    }

    return {} as Empty;
  }

  /**
   * Delete custom exercise
   */
  async deleteCustomExercise(params: { user: User; name: string }): Promise<Empty> {
    const { user, name } = params;
    
    const result = await this.exercises.deleteOne({
      name,
      createdBy: user,
      isGlobal: false,
    });

    if (result.deletedCount === 0) {
      throw new Error("Custom exercise not found");
    }

    return {} as Empty;
  }

  /**
   * Seed global exercises (one-time)
   */
  async seedGlobalExercises(params: { exerciseData: Partial<ExerciseDoc>[] }): Promise<Empty> {
    const { exerciseData } = params;
    
    const count = await this.exercises.countDocuments({ isGlobal: true });
    if (count > 0) {
      throw new Error("Global exercises already seeded");
    }

    const exercises = exerciseData.map(ex => ({
      _id: freshID(),
      isGlobal: true,
      createdBy: undefined,
      ...ex,
    }));

    await this.exercises.insertMany(exercises as ExerciseDoc[]);

    return {} as Empty;
  }
}