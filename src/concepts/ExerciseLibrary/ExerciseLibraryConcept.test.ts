import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { User } from "@utils/types.ts";
import ExerciseLibraryConcept from "./ExerciseLibraryConcept.ts";

// Database test helper
function dbTest(name: string, fn: () => Promise<void>) {
  Deno.test({
    name,
    sanitizeResources: false,
    sanitizeOps: false,
    fn,
  });
}

const testUser = "user:testUser123" as User;

// Test 1: Seed global exercises
dbTest("Action: seedGlobalExercises imports exercise database", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing global exercise seeding...");

  const sampleExercises = [
    {
      name: "Bench Press",
      hasWeight: true,
      targetMuscleGroup: "Chest" as const,
      equipment: "Barbell" as const,
      exerciseClassification: "Bodybuilding" as const,
      forceType: "Push" as const,
    },
    {
      name: "Pull Up",
      hasWeight: false,
      targetMuscleGroup: "Back" as const,
      equipment: "Bodyweight" as const,
      exerciseClassification: "Calisthenics" as const,
      forceType: "Pull" as const,
    },
  ];

  await library.seedGlobalExercises({ exerciseData: sampleExercises });

  const { exercises: results } = await library.searchExercises({ user: testUser, query: "Bench", filters: {} });
  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Bench Press");

  console.log("✅ Seeded 2 global exercises\n");

  await client.close();
});

// Test 2: Search with filters
dbTest("Action: searchExercises filters by muscle group", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing search with filters...");

  await library.seedGlobalExercises({
    exerciseData: [
      { name: "Bench Press", hasWeight: true, targetMuscleGroup: "Chest" as const },
      { name: "Squat", hasWeight: true, targetMuscleGroup: "Legs" as const },
      { name: "Deadlift", hasWeight: true, targetMuscleGroup: "Back" as const },
    ]
  });

  const { exercises: results } = await library.searchExercises({ user: testUser, query: "", filters: { muscleGroup: "Legs" } });
  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Squat");

  console.log("✅ Filtered exercises by muscle group\n");

  await client.close();
});

// Test 3: Add custom exercise
dbTest("Action: addCustomExercise creates user-specific exercise", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise creation...");

  await library.addCustomExercise({
    user: testUser,
    name: "My Special Exercise",
    hasWeight: true,
    trackingType: "reps",
    metadata: {
      targetMuscleGroup: "Arms" as const,
    }
  });

  const { exercise } = await library.getExercise({ user: testUser, name: "My Special Exercise" });
  assertEquals(exercise.name, "My Special Exercise");
  assertEquals(exercise.isGlobal, false);
  assertEquals(exercise.createdBy, testUser);

  console.log("✅ Created custom exercise\n");

  await client.close();
});

// Test 4: Custom exercises are user-scoped
dbTest("Principle: Custom exercises only visible to creator", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing user-scoped custom exercises...");

  const user1 = "user:alice" as User;
  const user2 = "user:bob" as User;

  await library.addCustomExercise({ user: user1, name: "Alice Exercise", hasWeight: true, trackingType: "reps" });

  // Alice can see it
  const { exercise: aliceExercise } = await library.getExercise({ user: user1, name: "Alice Exercise" });
  assertEquals(aliceExercise.name, "Alice Exercise");

  // Bob cannot see it
  await assertRejects(
    async () => await library.getExercise({ user: user2, name: "Alice Exercise" }),
    Error,
    "Exercise not found"
  );

  console.log("✅ Custom exercises properly scoped to user\n");

  await client.close();
});

// Test 5: Update custom exercise
dbTest("Action: updateCustomExercise modifies metadata", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise update...");

  await library.addCustomExercise({
    user: testUser,
    name: "Test Exercise",
    hasWeight: true,
    trackingType: "reps",
    metadata: {
      targetMuscleGroup: "Chest" as const,
    }
  });

  await library.updateCustomExercise({
    user: testUser,
    name: "Test Exercise",
    updates: {
      targetMuscleGroup: "Back" as const,
      equipment: "Cable" as const,
    }
  });

  const { exercise: updated } = await library.getExercise({ user: testUser, name: "Test Exercise" });
  assertEquals(updated.targetMuscleGroup, "Back");
  assertEquals(updated.equipment, "Cable");

  console.log("✅ Updated custom exercise metadata\n");

  await client.close();
});

// Test 6: Delete custom exercise
dbTest("Action: deleteCustomExercise removes exercise", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise deletion...");

  await library.addCustomExercise({ user: testUser, name: "To Delete", hasWeight: true, trackingType: "reps" });
  await library.deleteCustomExercise({ user: testUser, name: "To Delete" });

  await assertRejects(
    async () => await library.getExercise({ user: testUser, name: "To Delete" }),
    Error,
    "Exercise not found"
  );

  console.log("✅ Deleted custom exercise\n");

  await client.close();
});

// Test 7: Validation - empty query without filters
dbTest("Action: searchExercises requires query or filters", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing search validation...");

  await assertRejects(
    async () => await library.searchExercises({ user: testUser, query: "", filters: {} }),
    Error,
    "Query or at least one filter required"
  );

  console.log("✅ Correctly rejected empty search\n");

  await client.close();
});

// Test 8: TrackingType validation
dbTest("Action: addCustomExercise requires valid trackingType", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing trackingType validation...");

  // Valid trackingTypes work
  await library.addCustomExercise({ user: testUser, name: "Plank", hasWeight: false, trackingType: "duration" });
  await library.addCustomExercise({ user: testUser, name: "Push Up", hasWeight: false, trackingType: "reps" });

  const { exercise: plank } = await library.getExercise({ user: testUser, name: "Plank" });
  assertEquals(plank.trackingType, "duration");
  
  const { exercise: pushup } = await library.getExercise({ user: testUser, name: "Push Up" });
  assertEquals(pushup.trackingType, "reps");

  console.log("✅ Created exercises with different trackingTypes\n");

  await client.close();
});

// Test 9: Cannot update hasWeight or trackingType
dbTest("Action: updateCustomExercise prevents changing immutable fields", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing immutable field protection...");

  await library.addCustomExercise({
    user: testUser,
    name: "My Exercise",
    hasWeight: true,
    trackingType: "reps",
    metadata: {
      targetMuscleGroup: "Chest" as const,
    }
  });

  // Try to change hasWeight and trackingType (should be ignored)
  await library.updateCustomExercise({
    user: testUser,
    name: "My Exercise",
    updates: {
      hasWeight: false,
      trackingType: "duration" as const,
      targetMuscleGroup: "Back" as const,
    }
  });

  const { exercise } = await library.getExercise({ user: testUser, name: "My Exercise" });
  
  // hasWeight and trackingType unchanged
  assertEquals(exercise.hasWeight, true);
  assertEquals(exercise.trackingType, "reps");
  
  // But targetMuscleGroup updated
  assertEquals(exercise.targetMuscleGroup, "Back");

  console.log("✅ Immutable fields protected\n");

  await client.close();
});