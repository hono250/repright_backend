import * as XLSX from "npm:xlsx";

function extractUrl(cell: any): string | null {
  // Check if cell has hyperlink
  if (cell && cell.l && cell.l.Target) {
    return cell.l.Target;
  }
  // Otherwise use cell value (might be plain text URL)
  if (cell && cell.v) {
    return cell.v;
  }
  return null;
}


// Map Excel columns to schema
function mapExercise(row: any, worksheet: any, rowIndex: number): any {
  const equipment = row["Primary Equipment"];
  const hasWeight = equipment !== "Bodyweight" && equipment !== "Stability Ball";
  
  // Get video URL from cell (handles hyperlinks)
  const videoCellAddress = XLSX.utils.encode_cell({ r: rowIndex, c: 1 }); // Column B
  const videoCell = worksheet[videoCellAddress];
  
  return {
    name: row["Exercise"],
    hasWeight,
    trackingType: inferTrackingType(row["Exercise"], equipment),
    targetMuscleGroup: mapMuscleGroup(row["Target Muscle Group"]),
    primeMoverMuscle: row["Prime Mover Muscle"],
    equipment: mapEquipment(equipment),
    exerciseClassification: mapClassification(row["Primary Exercise Classification"]),
    forceType: mapForceType(row["Force Type"]),
    posture: mapPosture(row["Posture"]),
    videoUrl: extractUrl(videoCell),
  };
}

function inferTrackingType(name: string, equipment: string): "reps" | "duration" {
  const timedKeywords = ["plank", "hold", "wall sit"];
  const nameLower = name.toLowerCase();
  
  if (timedKeywords.some(keyword => nameLower.includes(keyword))) {
    return "duration";
  }
  return "reps";
}

function mapMuscleGroup(value: string): string | undefined {
  if (!value) return undefined;
  
  const mapping: Record<string, string> = {
    "Abdominals": "Core",
    "Obliques": "Core",
    "Glutes": "Glutes",
    "Gluteus Maximus": "Glutes",
    "Quadriceps": "Legs",
    "Hamstrings": "Legs",
    "Calves": "Legs",
    "Hip Flexors": "Legs",
    "Chest": "Chest",
    "Pectorals": "Chest",
    "Back": "Back",
    "Lats": "Back",
    "Shoulders": "Shoulders",
    "Deltoids": "Shoulders",
    "Biceps": "Arms",
    "Triceps": "Arms",
    "Forearms": "Arms",
  };
  
  return mapping[value] || "Other";
}

function mapEquipment(value: string): string | undefined {
  if (!value) return undefined;
  if (value.includes("Barbell")) return "Barbell";
  if (value.includes("Dumbbell")) return "Dumbbell";
  if (value.includes("Kettlebell")) return "Kettlebell";
  if (value === "Bodyweight") return "Bodyweight";
  if (value.includes("Cable")) return "Cable";
  if (value.includes("Machine")) return "Machine";
  if (value.includes("Band")) return "Resistance Band";
  if (value.includes("Stability Ball")) return "Other";
  return "Other";
}

function mapClassification(value: string): string | undefined {
  if (!value) return undefined;
  
  const mapping: Record<string, string> = {
    "Bodybuilding": "Bodybuilding",
    "Powerlifting": "Powerlifting",
    "Olympic": "Olympic Weightlifting",
    "Postural": "Functional",
  };
  
  return mapping[value] || "Other";
}

function mapForceType(value: string): string | undefined {
  if (!value) return undefined;
  const lower = value.toLowerCase();
  if (lower.includes("push")) return "Push";
  if (lower.includes("pull")) return "Pull";
  return "Other";
}

function mapPosture(value: string): string | undefined {
  if (!value) return undefined;
  
  const mapping: Record<string, string> = {
    "Standing": "Standing",
    "Seated": "Seated",
    "Supine": "Supine",
    "Prone": "Prone",
    "Quadruped": "Quadruped",
    "Bridge": "Bridge",
  };
  
  return mapping[value] || "Other";
}

// Read file with Deno, then parse with XLSX
const fileData = Deno.readFileSync("src/concepts/ExerciseLibrary/exercise-database.xlsx");
const workbook = XLSX.read(fileData, { type: "buffer" });

const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

const exercises = data
  .map((row, index) => mapExercise(row, worksheet, index + 1)) // +1 for header row
  .filter((ex: any) => ex.name && ex.name.trim().length > 0);

// Write to JSON
Deno.writeTextFileSync(
  "src/concepts/ExerciseLibrary/exercise-data.json",
  JSON.stringify(exercises, null, 2)
);

console.log(`✅ Imported ${exercises.length} exercises to exercise-data.json`);
console.log(`   - ${exercises.filter((e: any) => e.trackingType === "duration").length} timed exercises`);
console.log(`   - ${exercises.filter((e: any) => e.trackingType === "reps").length} rep-based exercises`);