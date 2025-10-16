import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import WorkoutLogConcept from "./WorkoutLogConcept.ts";

const testUser = "user:testUser123" as ID;
const benchPress = "Bench Press";
const squat = "Squat";

// Test 1: Operational Principle
Deno.test("Principle: Log sets and retrieve workout history", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing operational principle...");
  
  await workoutLog.logSet(testUser, benchPress, 185, 5);
  await workoutLog.logSet(testUser, benchPress, 185, 5);
  await workoutLog.logSet(testUser, benchPress, 185, 4);
  
  const history = await workoutLog.getHistory(testUser, benchPress);
  assertEquals(history.length, 3, "Should have 3 sets logged");
  assertEquals(history[0].weight, 185, "Weight should be 185");
  
  console.log(`✅ Logged and retrieved ${history.length} sets\n`);
  
  await client.close();
});

// Test 2: getLastWorkout
Deno.test("Action: getLastWorkout returns most recent set", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing getLastWorkout...");
  
  await workoutLog.logSet(testUser, squat, 225, 5);
  await workoutLog.logSet(testUser, squat, 230, 5);
  
  const last = await workoutLog.getLastWorkout(testUser, squat);
  assertEquals(last.weight, 230, "Should return most recent weight");
  assertEquals(last.reps, 5);
  
  console.log(`✅ Retrieved last workout: ${last.weight}lbs × ${last.reps} reps\n`);
  
  await client.close();
});

// Test 3: getSummary structure
Deno.test("Action: getSummary provides structured data", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing getSummary...");
  
  await workoutLog.logSet(testUser, benchPress, 185, 5);
  await workoutLog.logSet(testUser, benchPress, 185, 5);
  
  const summary = await workoutLog.getSummary(testUser, benchPress);
  
  assertEquals(typeof summary.sessionCount, "number");
  assertEquals(Array.isArray(summary.recentSets), true);
  assertEquals(summary.recentSets.length, 2);
  
  console.log(`✅ Summary: ${summary.recentSets.length} sets across ${summary.sessionCount} sessions\n`);
  
  await client.close();
});

// Test 5a: Validation - negative reps
Deno.test("Action: logSet requires weight >= 0", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing weight validation...");
  
  await assertRejects(
    async () => await workoutLog.logSet(testUser, benchPress, -10, 5),
    Error,
    "Weight must be >= 0"
  );
  
  console.log("✅ Correctly rejected negative weight\n");
  
  await client.close();
});

// Test 5b: Validation - zero reps
Deno.test("Action: logSet requires reps > 0", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing reps validation...");
  
  await assertRejects(
    async () => await workoutLog.logSet(testUser, benchPress, 185, 0),
    Error,
    "reps must be > 0"
  );
  
  console.log("✅ Correctly rejected zero reps\n");
  
  await client.close();
});

// Test 6: deleteSet
Deno.test("Action: deleteSet removes specific workout", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing deleteSet...");
  
  await workoutLog.logSet(testUser, "Deadlift", 315, 3);
  const before = await workoutLog.getHistory(testUser, "Deadlift");
  const setToDelete = before[0];
  
  await workoutLog.deleteSet(testUser, "Deadlift", setToDelete.date);
  
  const after = await workoutLog.getHistory(testUser, "Deadlift");
  assertEquals(after.length, before.length - 1, "Should have one less set");
  
  console.log("✅ Successfully deleted workout set\n");
  
  await client.close();
});

// Test 7: Error - no history
Deno.test("Action: getLastWorkout throws when no history exists", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing error handling for missing history...");
  
  const newUser = "user:newUser456" as ID;
  
  await assertRejects(
    async () => await workoutLog.getLastWorkout(newUser, "Nonexistent Exercise"),
    Error,
    "No workout history found"
  );
  
  console.log("✅ Correctly threw error for missing history\n");
  
  await client.close();
});