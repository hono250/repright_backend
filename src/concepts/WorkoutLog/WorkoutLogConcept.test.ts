import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import WorkoutLogConcept from "./WorkoutLogConcept.ts";

// Database test helper
function dbTest(name: string, fn: () => Promise<void>) {
  Deno.test({
    name,
    sanitizeResources: false,
    sanitizeOps: false,
    fn,
  });
}

const testUser = "user:testUser123" as ID;
const benchPress = "Bench Press";
const squat = "Squat";

// Test 1: Operational Principle
dbTest("Principle: Log sets and retrieve workout history", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing operational principle...");
  
  await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 5 });
  await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 5 });
  await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 4 });
  
  const { history } = await workoutLog.getHistory({ user: testUser, exercise: benchPress });
  assertEquals(history.length, 3, "Should have 3 sets logged");
  assertEquals(history[0].weight, 185, "Weight should be 185");
  
  console.log(`✅ Logged and retrieved ${history.length} sets\n`);
  
  await client.close();
});

// Test 2: getLastWorkout
dbTest("Action: getLastWorkout returns most recent set", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing getLastWorkout...");
  
  await workoutLog.logSet({ user: testUser, exercise: squat, weight: 225, reps: 5 });
  await workoutLog.logSet({ user: testUser, exercise: squat, weight: 230, reps: 5 });
  
  const last = await workoutLog.getLastWorkout({ user: testUser, exercise: squat });
  assertEquals(last.weight, 230, "Should return most recent weight");
  assertEquals(last.reps, 5);
  
  console.log(`✅ Retrieved last workout: ${last.weight}lbs × ${last.reps} reps\n`);
  
  await client.close();
});

// Test 3: getSummary structure
dbTest("Action: getSummary provides structured data", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing getSummary...");
  
  await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 5 });
  await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 5 });
  
  const { summary } = await workoutLog.getSummary({ user: testUser, exercise: benchPress });
  
  assertEquals(typeof summary.sessionCount, "number");
  assertEquals(Array.isArray(summary.recentSets), true);
  assertEquals(summary.recentSets.length, 2);
  
  console.log(`✅ Summary: ${summary.recentSets.length} sets across ${summary.sessionCount} sessions\n`);
  
  await client.close();
});

// Test 5a: Validation - negative weight
dbTest("Action: logSet requires weight >= 0", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing weight validation...");
  
  await assertRejects(
    async () => await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: -10, reps: 5 }),
    Error,
    "Weight must be >= 0"
  );
  
  console.log("✅ Correctly rejected negative weight\n");
  
  await client.close();
});

// Test 5b: Validation - zero reps
dbTest("Action: logSet requires reps > 0", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing reps validation...");
  
  await assertRejects(
    async () => await workoutLog.logSet({ user: testUser, exercise: benchPress, weight: 185, reps: 0 }),
    Error,
    "Must provide either reps or duration"
  );
  
  console.log("✅ Correctly rejected zero reps\n");
  
  await client.close();
});

// Test 6: Error - no history
dbTest("Action: getLastWorkout throws when no history exists", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing error handling for missing history...");
  
  const newUser = "user:newUser456" as ID;
  
  await assertRejects(
    async () => await workoutLog.getLastWorkout({ user: newUser, exercise: "Nonexistent Exercise" }),
    Error,
    "No workout history found"
  );
  
  console.log("✅ Correctly threw error for missing history\n");
  
  await client.close();
});

// Test: Duration exercise
dbTest("Action: logSet accepts duration for timed exercises", async () => {
  const [db, client] = await testDb();
  const workoutLog = new WorkoutLogConcept(db);

  console.log("📝 Testing duration logging...");
  
  await workoutLog.logSet({ user: testUser, exercise: "Plank", duration: 60 });
  const { history } = await workoutLog.getHistory({ user: testUser, exercise: "Plank" });
  
  assertEquals(history[0].duration, 60);
  assertEquals(history[0].reps, null);
  
  console.log("✅ Logged timed exercise (60 seconds)\n");
  
  await client.close();
});