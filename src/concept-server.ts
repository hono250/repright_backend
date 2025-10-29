import { Hono } from "jsr:@hono/hono";
import { getDb } from "@utils/database.ts";
import { cors } from "jsr:@hono/hono/cors";
import { Db } from "npm:mongodb";
import { walk } from "jsr:@std/fs";
import { parseArgs } from "jsr:@std/cli/parse-args";
import { toFileUrl } from "jsr:@std/path/to-file-url";

// Parse command-line arguments for port and base URL
const flags = parseArgs(Deno.args, {
  string: ["port", "baseUrl"],
  default: {
    port: "8000",
    baseUrl: "/api",
  },
});

const PORT = parseInt(flags.port, 10);
const BASE_URL = flags.baseUrl;
const CONCEPTS_DIR = "src/concepts";

/**
 * Main server function to initialize DB, load concepts, and start the server.
 */
async function main() {
  const [db] = await getDb();
  const app = new Hono();

  // Add CORS 
  app.use("*", cors());

  app.get("/", (c) => c.text("Concept Server is running."));

  // --- Dynamic Concept Loading and Routing ---
  console.log(`Scanning for concepts in ./${CONCEPTS_DIR}...`);

  // Store ExerciseLibrary instance for seeding --- added for seeding exercise library at start ---
  let exerciseLibrary: any = null;
  //-----

  for await (
    const entry of walk(CONCEPTS_DIR, {
      maxDepth: 1,
      includeDirs: true,
      includeFiles: false,
    })
  ) {
    if (entry.path === CONCEPTS_DIR) continue; // Skip the root directory

    const conceptName = entry.name;
    const conceptFilePath = `${entry.path}/${conceptName}Concept.ts`;

    try {
      const modulePath = toFileUrl(Deno.realPathSync(conceptFilePath)).href;
      const module = await import(modulePath);
      const ConceptClass = module.default;

      if (
        typeof ConceptClass !== "function" ||
        !ConceptClass.name.endsWith("Concept")
      ) {
        console.warn(
          `! No valid concept class found in ${conceptFilePath}. Skipping.`,
        );
        continue;
      }

      const instance = new ConceptClass(db);
     
      // Store ExerciseLibrary instance --- added for seeding exercise library at start ---
      if (conceptName === "ExerciseLibrary") {
        exerciseLibrary = instance;
      }
      //-----

      const conceptApiName = conceptName;
      console.log(
        `- Registering concept: ${conceptName} at ${BASE_URL}/${conceptApiName}`,
      );

      const methodNames = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      )
        .filter((name) =>
          name !== "constructor" && typeof instance[name] === "function"
        );

      for (const methodName of methodNames) {
        const actionName = methodName;
        const route = `${BASE_URL}/${conceptApiName}/${actionName}`;

        app.post(route, async (c) => {
          try {
            const body = await c.req.json().catch(() => ({})); // Handle empty body
            const result = await instance[methodName](body);
            return c.json(result);
          } catch (e) {
            console.error(`Error in ${conceptName}.${methodName}:`, e);
            // Return the actual error message to the client
            const errorMessage = e instanceof Error ? e.message : "An internal server error occurred."
            return c.json({ error: errorMessage }, 400);
          }
        });
        console.log(`  - Endpoint: POST ${route}`);
      }
    } catch (e) {
      console.error(
        `! Error loading concept from ${conceptFilePath}:`,
        e,
      );
    }
  }

  // Seed exercises after all concepts loaded --- added for seeding exercise library at start ---
  if (exerciseLibrary) {
    await seedExercises(exerciseLibrary, db as Db);
  }
  //-----

  console.log(`\nServer listening on http://localhost:${PORT}`);
  Deno.serve({ port: PORT }, app.fetch);
}

// ============================================================
// SYNC: Seed Global Exercises on Startup
// Purpose: Ensure exercise library is populated before users start
// Trigger: Server initialization
// Concepts: ExerciseLibrary
// Note: will be refactored in A5 with proper sync infrastructure
// ============================================================
async function seedExercises(exerciseLibrary: any, db: Db) {
  try {
    const exerciseData = JSON.parse(
      Deno.readTextFileSync("src/concepts/ExerciseLibrary/exercise-data.json")
    );
    
    await exerciseLibrary.seedGlobalExercises({ exerciseData });
    console.log(`\n✓ Seeded ${exerciseData.length} global exercises`);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An internal error occurred."
    if (errorMessage.includes("already seeded")) {
      console.log(`\n✓ Global exercises already seeded`);
    } else {
      console.error("\n✗ Failed to seed exercises:", errorMessage);
    }
  }
}
// ============================================================
// END SYNC
// ============================================================

// Run the server
main();