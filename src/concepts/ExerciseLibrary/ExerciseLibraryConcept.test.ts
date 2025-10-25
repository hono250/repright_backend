import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { User } from "@utils/types.ts";
import ExerciseLibraryConcept from "./ExerciseLibraryConcept.ts";

const testUser = "user:testUser123" as User;

// Test 1: Seed global exercises
Deno.test("Action: seedGlobalExercises imports exercise database", async () => {
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

  await library.seedGlobalExercises(sampleExercises);

  const results = await library.searchExercises(testUser, "Bench", {});
  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Bench Press");

  console.log("✅ Seeded 2 global exercises\n");

  await client.close();
});

// Test 2: Search with filters
Deno.test("Action: searchExercises filters by muscle group", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing search with filters...");

  await library.seedGlobalExercises([
    { name: "Bench Press", hasWeight: true, targetMuscleGroup: "Chest" as const },
    { name: "Squat", hasWeight: true, targetMuscleGroup: "Legs" as const },
    { name: "Deadlift", hasWeight: true, targetMuscleGroup: "Back" as const },
  ]);

  const results = await library.searchExercises(testUser, "", { muscleGroup: "Legs" });
  assertEquals(results.length, 1);
  assertEquals(results[0].name, "Squat");

  console.log("✅ Filtered exercises by muscle group\n");

  await client.close();
});

// Test 3: Add custom exercise
Deno.test("Action: addCustomExercise creates user-specific exercise", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise creation...");

  await library.addCustomExercise(testUser, "My Special Exercise", true, "reps", {
    targetMuscleGroup: "Arms" as const,
  });

  const exercise = await library.getExercise(testUser, "My Special Exercise");
  assertEquals(exercise.name, "My Special Exercise");
  assertEquals(exercise.isGlobal, false);
  assertEquals(exercise.createdBy, testUser);

  console.log("✅ Created custom exercise\n");

  await client.close();
});

// Test 4: Custom exercises are user-scoped
Deno.test("Principle: Custom exercises only visible to creator", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing user-scoped custom exercises...");

  const user1 = "user:alice" as User;
  const user2 = "user:bob" as User;

  await library.addCustomExercise(user1, "Alice Exercise", true, "reps");

  // Alice can see it
  const aliceExercise = await library.getExercise(user1, "Alice Exercise");
  assertEquals(aliceExercise.name, "Alice Exercise");

  // Bob cannot see it
  await assertRejects(
    async () => await library.getExercise(user2, "Alice Exercise"),
    Error,
    "Exercise not found"
  );

  console.log("✅ Custom exercises properly scoped to user\n");

  await client.close();
});

// Test 5: Update custom exercise
Deno.test("Action: updateCustomExercise modifies metadata", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise update...");

  await library.addCustomExercise(testUser, "Test Exercise", true, "reps", {
    targetMuscleGroup: "Chest" as const,
  });

  await library.updateCustomExercise(testUser, "Test Exercise", {
    targetMuscleGroup: "Back" as const,
    equipment: "Cable" as const,
  });

  const updated = await library.getExercise(testUser, "Test Exercise");
  assertEquals(updated.targetMuscleGroup, "Back");
  assertEquals(updated.equipment, "Cable");

  console.log("✅ Updated custom exercise metadata\n");

  await client.close();
});

// Test 6: Delete custom exercise
Deno.test("Action: deleteCustomExercise removes exercise", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing custom exercise deletion...");

  await library.addCustomExercise(testUser, "To Delete", true, "reps");
  await library.deleteCustomExercise(testUser, "To Delete");

  await assertRejects(
    async () => await library.getExercise(testUser, "To Delete"),
    Error,
    "Exercise not found"
  );

  console.log("✅ Deleted custom exercise\n");

  await client.close();
});

// Test 7: Validation - empty query without filters
Deno.test("Action: searchExercises requires query or filters", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing search validation...");

  await assertRejects(
    async () => await library.searchExercises(testUser, "", {}),
    Error,
    "Query or at least one filter required"
  );

  console.log("✅ Correctly rejected empty search\n");

  await client.close();
});

// Test 8: TrackingType validation
Deno.test("Action: addCustomExercise requires valid trackingType", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing trackingType validation...");

  // Valid trackingTypes work
  await library.addCustomExercise(testUser, "Plank", false, "duration");
  await library.addCustomExercise(testUser, "Push Up", false, "reps");

  const plank = await library.getExercise(testUser, "Plank");
  assertEquals(plank.trackingType, "duration");
  
  const pushup = await library.getExercise(testUser, "Push Up");
  assertEquals(pushup.trackingType, "reps");

  console.log("✅ Created exercises with different trackingTypes\n");

  await client.close();
});

// Test 9: Cannot update hasWeight or trackingType
Deno.test("Action: updateCustomExercise prevents changing immutable fields", async () => {
  const [db, client] = await testDb();
  const library = new ExerciseLibraryConcept(db);

  console.log("📝 Testing immutable field protection...");

  await library.addCustomExercise(testUser, "My Exercise", true, "reps", {
    targetMuscleGroup: "Chest" as const,
  });

  // Try to change hasWeight and trackingType (should be ignored)
  await library.updateCustomExercise(testUser, "My Exercise", {
    hasWeight: false,
    trackingType: "duration" as const,
    targetMuscleGroup: "Back" as const,
  });

  const exercise = await library.getExercise(testUser, "My Exercise");
  
  // hasWeight and trackingType unchanged
  assertEquals(exercise.hasWeight, true);
  assertEquals(exercise.trackingType, "reps");
  
  // But targetMuscleGroup updated
  assertEquals(exercise.targetMuscleGroup, "Back");

  console.log("✅ Immutable fields protected\n");

  await client.close();
});