/**
 * Entry point for an application built with concepts + synchronizations.
 * Requires the Requesting concept as a bootstrap concept.
 * Please run "deno run import" or "generate_imports.ts" to prepare "@concepts".
 */
import * as concepts from "@concepts";
import { ExerciseLibrary } from "@concepts";


// Use the following line instead to run against the test database, which resets each time.
// import * as concepts from "@test-concepts";

const { Engine } = concepts;
import { Logging } from "@engine";
import { startRequestingServer } from "@concepts/Requesting/RequestingConcept.ts";
import syncs from "@syncs";

/**
 * Available logging levels:
 *   Logging.OFF
 *   Logging.TRACE - display a trace of the actions.
 *   Logging.VERBOSE - display full record of synchronization.
 */
Engine.logging = Logging.TRACE;

// Register synchronizations
Engine.register(syncs);

// Seed exercises on startup
try {
  const exerciseData = JSON.parse(
    await Deno.readTextFile("src/concepts/ExerciseLibrary/exercise-data.json")
  );
  
  await ExerciseLibrary.seedGlobalExercises({ exerciseData });
  console.log(`✓ Seeded ${exerciseData.length} global exercises`);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : "An internal error occurred."
  if (errorMessage?.includes("already seeded")) {
    console.log(`✓ Global exercises already seeded`);
  } else {
    console.error("✗ Failed to seed exercises:", err);
  }
}

// Start a server to provide the Requesting concept with external/system actions.
startRequestingServer(concepts);