import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { User } from "@utils/types.ts";
import WorkoutTemplateConcept, { TemplateExercise } from "./WorkoutTemplateConcept.ts";

// Helper for database tests
function dbTest(name: string, fn: () => Promise<void>) {
  Deno.test({
    name,
    sanitizeResources: false,
    sanitizeOps: false,
    fn,
  });
}

const testUser = "user:testUser123" as User;

// Test 1: Create template
dbTest("Action: createTemplate creates workout template", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing template creation...");

  const exercises: TemplateExercise[] = [
    {
      exercise: "Bench Press",
      sets: [
        { targetWeight: 185, targetReps: 5, targetDuration: null, restTimer: 180 },
        { targetWeight: 185, targetReps: 5, targetDuration: null, restTimer: 180 },
        { targetWeight: 185, targetReps: 5, targetDuration: null, restTimer: 180 },
      ],
    },
    {
      exercise: "Squat",
      sets: [
        { targetWeight: 225, targetReps: 5, targetDuration: null, restTimer: 180 },
      ],
    },
  ];

  await templates.createTemplate({ user: testUser, name: "Push Day", exercises });

  const { template } = await templates.getTemplate({ user: testUser, name: "Push Day" });
  assertEquals(template.name, "Push Day");
  assertEquals(template.exercises.length, 2);
  assertEquals(template.lastPerformed, null);

  console.log("✅ Created template with 2 exercises\n");

  await client.close();
});

// Test 2: Create template with timed exercise
dbTest("Action: createTemplate supports timed exercises", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing timed exercise template...");

  const exercises: TemplateExercise[] = [
    {
      exercise: "Plank",
      sets: [
        { targetWeight: null, targetReps: null, targetDuration: 60, restTimer: 90 },
        { targetWeight: null, targetReps: null, targetDuration: 60, restTimer: 90 },
      ],
    },
  ];

  await templates.createTemplate({ user: testUser, name: "Core Workout", exercises });

  const { template } = await templates.getTemplate({ user: testUser, name: "Core Workout" });
  assertEquals(template.exercises[0].sets[0].targetDuration, 60);
  assertEquals(template.exercises[0].sets[0].targetReps, null);

  console.log("✅ Created template with timed exercise\n");

  await client.close();
});

// Test 3: Get all templates sorted by lastPerformed
dbTest("Action: getTemplates returns sorted list", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing template listing...");

  const ex1: TemplateExercise[] = [
    { exercise: "Squat", sets: [{ targetWeight: 225, targetReps: 5, targetDuration: null, restTimer: 180 }] },
  ];

  await templates.createTemplate({ user: testUser, name: "Leg Day", exercises: ex1 });
  await templates.createTemplate({ user: testUser, name: "Arm Day", exercises: ex1 });

  // Mark one as used
  await templates.markTemplateUsed({ user: testUser, name: "Leg Day", date: new Date() });

  const { templates: allTemplates } = await templates.getTemplates({ user: testUser });
  assertEquals(allTemplates.length, 2);
  assertEquals(allTemplates[0].name, "Leg Day"); // Most recent first

  console.log("✅ Retrieved sorted templates\n");

  await client.close();
});

// Test 4: Update template
dbTest("Action: updateTemplate modifies exercises", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing template update...");

  const original: TemplateExercise[] = [
    { exercise: "Bench", sets: [{ targetWeight: 185, targetReps: 5, targetDuration: null, restTimer: 180 }] },
  ];

  await templates.createTemplate({ user: testUser, name: "Test Template", exercises: original });

  const updated: TemplateExercise[] = [
    { exercise: "Bench", sets: [{ targetWeight: 195, targetReps: 5, targetDuration: null, restTimer: 180 }] },
    { exercise: "Squat", sets: [{ targetWeight: 225, targetReps: 5, targetDuration: null, restTimer: 180 }] },
  ];

  await templates.updateTemplate({ user: testUser, name: "Test Template", exercises: updated });

  const { template } = await templates.getTemplate({ user: testUser, name: "Test Template" });
  assertEquals(template.exercises.length, 2);
  assertEquals(template.exercises[0].sets[0].targetWeight, 195);

  console.log("✅ Updated template exercises\n");

  await client.close();
});

// Test 5: Delete template
dbTest("Action: deleteTemplate removes template", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing template deletion...");

  const ex: TemplateExercise[] = [
    { exercise: "Test", sets: [{ targetWeight: 100, targetReps: 10, targetDuration: null, restTimer: 90 }] },
  ];

  await templates.createTemplate({ user: testUser, name: "To Delete", exercises: ex });
  await templates.deleteTemplate({ user: testUser, name: "To Delete" });

  await assertRejects(
    async () => await templates.getTemplate({ user: testUser, name: "To Delete" }),
    Error,
    "Template not found"
  );

  console.log("✅ Deleted template\n");

  await client.close();
});

// Test 6: Validation - conflicting reps and duration
dbTest("Action: createTemplate rejects reps + duration in same set", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing set validation...");

  const badExercises: TemplateExercise[] = [
    {
      exercise: "Bad Exercise",
      sets: [
        { targetWeight: 100, targetReps: 10, targetDuration: 60, restTimer: 90 }, // BOTH!
      ],
    },
  ];

  await assertRejects(
    async () => await templates.createTemplate({ user: testUser, name: "Bad Template", exercises: badExercises }),
    Error,
    "cannot have both"
  );

  console.log("✅ Rejected invalid set configuration\n");

  await client.close();
});

// Test 7: Validation - missing both reps and duration
dbTest("Action: createTemplate requires reps or duration", async () => {
  const [db, client] = await testDb();
  const templates = new WorkoutTemplateConcept(db);

  console.log("📝 Testing missing target validation...");

  const badExercises: TemplateExercise[] = [
    {
      exercise: "Empty Set",
      sets: [
        { targetWeight: 100, targetReps: null, targetDuration: null, restTimer: 90 }, // NEITHER!
      ],
    },
  ];

  await assertRejects(
    async () => await templates.createTemplate({ user: testUser, name: "Empty Template", exercises: badExercises }),
    Error,
    "must have targetReps or targetDuration"
  );

  console.log("✅ Rejected empty set\n");

  await client.close();
});