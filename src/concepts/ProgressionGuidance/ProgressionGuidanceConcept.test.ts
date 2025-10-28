import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ProgressionGuidanceConcept, { WorkoutSummary, LLM } from "./ProgressionGuidanceConcept.ts";

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

// Mock LLM for testing (no API calls needed)
class MockLLM implements LLM {
  constructor(private response: any) {}
  
  async executeLLM(_prompt: string): Promise<string> {
    return JSON.stringify(this.response);
  }
}

// Helper to create workout summary
function createSummary(sets: Array<{ weight: number; reps: number; daysAgo: number }>): WorkoutSummary {
  const recentSets = sets.map(s => {
    const date = new Date();
    date.setDate(date.getDate() - s.daysAgo);
    return { weight: s.weight, reps: s.reps, date };
  });
  
  const sessionDates = new Set(recentSets.map(s => s.date.toDateString()));
  
  return {
    recentSets,
    sessionCount: sessionDates.size,
    lastWorkoutDate: recentSets[recentSets.length - 1].date,
  };
}

// Test 1: Operational Principle
dbTest("Principle: Generate recommendation, user accepts it later", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing operational principle...");
  
  // Create plateau scenario
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 21 },
    { weight: 185, reps: 5, daysAgo: 14 },
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 4, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 175,
    suggestedReps: 5,
    plateauDetected: true,
    reasoning: "You've been stuck at 185lbs for 4 sessions. Time for a deload.",
    interventionStrategy: "deload"
  });

  // Generate recommendation
  await guidance.generateRecommendationLLM({ 
    user: testUser, 
    exercise: benchPress, 
    workoutSummary: summary, 
    llm: mockLLM 
  });
  
  // Get recommendation
  const { recommendation: rec } = await guidance.getRecommendation({ user: testUser, exercise: benchPress });
  assertEquals(rec?.status, "pending");
  assertEquals(rec?.suggestedWeight, 175);
  
  // Accept it
  const accepted = await guidance.acceptRecommendation({ 
    user: testUser, 
    exercise: benchPress, 
    createdAt: rec!.createdAt 
  });
  assertEquals(accepted.suggestedWeight, 175);
  assertEquals(accepted.suggestedReps, 5);
  
  // Verify status changed
  const { recommendation: updated } = await guidance.getRecommendation({ user: testUser, exercise: benchPress });
  assertEquals(updated?.status, "accepted");
  
  console.log("✅ Generated, retrieved, and accepted recommendation\n");
  
  await client.close();
});

// Test 2: Dismiss recommendation
dbTest("Action: dismissRecommendation updates status", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing dismissRecommendation...");
  
  const summary = createSummary([
    { weight: 225, reps: 5, daysAgo: 14 },
    { weight: 230, reps: 5, daysAgo: 7 },
    { weight: 235, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 240,
    suggestedReps: 5,
    plateauDetected: false,
    reasoning: "You're progressing well. Continue with small increases.",
    interventionStrategy: "progress"
  });

  await guidance.generateRecommendationLLM({ 
    user: testUser, 
    exercise: "Squat", 
    workoutSummary: summary, 
    llm: mockLLM 
  });
  const { recommendation: rec } = await guidance.getRecommendation({ user: testUser, exercise: "Squat" });
  
  await guidance.dismissRecommendation({ 
    user: testUser, 
    exercise: "Squat", 
    createdAt: rec!.createdAt 
  });
  
  const { recommendation: dismissed } = await guidance.getRecommendation({ user: testUser, exercise: "Squat" });
  assertEquals(dismissed?.status, "dismissed");
  
  console.log("✅ Successfully dismissed recommendation\n");
  
  await client.close();
});

// Test 3: Recommendation history
dbTest("Action: getRecommendationHistory returns all recommendations", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing recommendation history...");
  
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 14 }, 
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 190,
    suggestedReps: 5,
    plateauDetected: false,
    reasoning: "Progress to 190lbs",
    interventionStrategy: "progress"
  });

  // Generate 3 recommendations
  await guidance.generateRecommendationLLM({ 
    user: testUser, 
    exercise: "Deadlift", 
    workoutSummary: summary, 
    llm: mockLLM 
  });
  await guidance.generateRecommendationLLM({ 
    user: testUser, 
    exercise: "Deadlift", 
    workoutSummary: summary, 
    llm: mockLLM 
  });
  await guidance.generateRecommendationLLM({ 
    user: testUser, 
    exercise: "Deadlift", 
    workoutSummary: summary, 
    llm: mockLLM 
  });
  
  const { recommendations: history } = await guidance.getRecommendationHistory({ 
    user: testUser, 
    exercise: "Deadlift" 
  });
  assertEquals(history.length, 3);
  
  console.log(`✅ Retrieved ${history.length} recommendations from history\n`);
  
  await client.close();
});

// Test 4: Insufficient data validation
dbTest("Action: generateRecommendationLLM requires 3+ sets", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing insufficient data validation...");
  
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 190,
    suggestedReps: 5,
    plateauDetected: false,
    reasoning: "Test",
    interventionStrategy: "progress"
  });

  await assertRejects(
    async () => await guidance.generateRecommendationLLM({ 
      user: testUser, 
      exercise: benchPress, 
      workoutSummary: summary, 
      llm: mockLLM 
    }),
    Error,
    "Need at least 3 recent sets"
  );
  
  console.log("✅ Correctly rejected insufficient data\n");
  
  await client.close();
});

// Test 5: Validator - extreme weight change
dbTest("Validator: Rejects extreme weight suggestions (>20% change)", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing weight change validator...");
  
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 14 },
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 250, // 35% increase - should fail
    suggestedReps: 5,
    plateauDetected: false,
    reasoning: "Test",
    interventionStrategy: "progress"
  });

  await assertRejects(
    async () => await guidance.generateRecommendationLLM({ 
      user: testUser, 
      exercise: benchPress, 
      workoutSummary: summary, 
      llm: mockLLM 
    }),
    Error,
    "Max allowed: 20%"
  );
  
  console.log("✅ Validator caught extreme weight hallucination\n");
  
  await client.close();
});

// Test 6: Validator - invalid rep range
dbTest("Validator: Rejects invalid rep ranges", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing rep range validator...");
  
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 14 }, 
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 185,
    suggestedReps: 50, // Invalid
    plateauDetected: false,
    reasoning: "Test",
    interventionStrategy: "progress"
  });

  await assertRejects(
    async () => await guidance.generateRecommendationLLM({ 
      user: testUser, 
      exercise: benchPress, 
      workoutSummary: summary, 
      llm: mockLLM 
    }),
    Error,
    "outside reasonable range"
  );
  
  console.log("✅ Validator caught invalid rep range\n");
  
  await client.close();
});

// Test 7: Validator - plateau-strategy contradiction
dbTest("Validator: Ensures plateau + progress don't coexist", async () => {
  const [db, client] = await testDb();
  const guidance = new ProgressionGuidanceConcept(db);

  console.log("📝 Testing plateau-strategy validator...");
  
  const summary = createSummary([
    { weight: 185, reps: 5, daysAgo: 14 },
    { weight: 185, reps: 5, daysAgo: 7 },
    { weight: 185, reps: 5, daysAgo: 0 },
  ]);

  const mockLLM = new MockLLM({
    suggestedWeight: 190,
    suggestedReps: 5,
    plateauDetected: true, // Says plateau...
    reasoning: "Test",
    interventionStrategy: "progress" // ...but suggests progress (contradiction)
  });

  await assertRejects(
    async () => await guidance.generateRecommendationLLM({ 
      user: testUser, 
      exercise: benchPress, 
      workoutSummary: summary, 
      llm: mockLLM 
    }),
    Error,
    "not deload/maintain/variation"
  );
  
  console.log("✅ Validator caught plateau-strategy contradiction\n");
  
  await client.close();
});