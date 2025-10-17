# RepRight Backend

AI-powered workout progression guidance system built with concept-driven architecture.

## Overview

RepRight helps fitness enthusiasts break through training plateaus by providing intelligent, LLM-powered recommendations based on workout history. The backend implements three independent concepts that work together to track workouts, generate personalized progression advice, and manage user authentication.

## Architecture

Built using **concept-driven design** - each concept is independently implemented and tested, ensuring modularity and scalability.

### Concepts

1. **WorkoutLog** - Tracks workout performance over time
   - Log sets with exercise, weight, and reps
   - Retrieve workout history with configurable time ranges
   - Generate structured summaries for analysis

2. **ProgressionGuidance** - AI-powered workout recommendations
   - Analyzes workout patterns using Gemini LLM
   - Detects plateaus and suggests interventions (deload, maintain, progress)
   - Includes validators preventing AI hallucinations (weight limits, rep ranges, strategy consistency)
   - Users can accept, dismiss, or review recommendation history

3. **UserAuthentication** - Secure user management
   - bcrypt password hashing
   - Token-based session management
   - Multi-session support

## Tech Stack

- **Runtime:** Deno
- **Database:** MongoDB Atlas
- **Language:** TypeScript
- **AI Integration:** Google Gemini API
- **Testing:** Deno built-in test framework
- **Authentication:** bcrypt

## Project Structure
```
repright_backend/
├── src/
│   ├── concepts/
│   │   ├── WorkoutLog/
│   │   │   ├── WorkoutLogConcept.ts
│   │   │   └── WorkoutLogConcept.test.ts
│   │   ├── ProgressionGuidance/
│   │   │   ├── ProgressionGuidanceConcept.ts
│   │   │   └── ProgressionGuidanceConcept.test.ts
│   │   └── UserAuthentication/
│   │       ├── UserAuthenticationConcept.ts
│   │       └── UserAuthenticationConcept.test.ts
│   └── utils/
│       ├── database.ts
│       └── types.ts
├── design/
│   ├── concepts/           # Concept specifications
│   ├── design-evolution.md # Design decisions & changes
│   └── test-outputs/       # Test execution logs
└── context/                # Development history snapshots
```

## Setup

### Prerequisites
- [Deno](https://deno.land/) installed
- MongoDB Atlas account
- Gemini API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/hono250/repright_backend.git
cd repright_backend
```

2. Install dependencies
```bash
deno install
```

3. Configure environment variables

Create `.env` file:
```env
MONGODB_URL=your_mongodb_connection_string
DB_NAME=repright
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

4. Run tests
```bash
deno test -A
```

## Key Features

### AI-Powered Recommendations
- Context-aware prompt engineering considers exercise type and fatigue patterns
- Validates LLM outputs to prevent dangerous suggestions:
  - Maximum 20% weight change from recent average
  - Rep ranges constrained to 1-20
  - Plateau detection requires strategy consistency

### Concept Independence
- Concepts communicate only through action return values
- No shared state or direct function calls between concepts
- Easy to test, maintain, and extend

### Comprehensive Testing
- 21 test cases across all concepts
- 100% action coverage
- Mock LLM for cost-free testing
- Validates both success and error paths

## Design Highlights

Key architectural decisions include:

- **`getSummary()` action** in WorkoutLog enables concept decoupling - ProgressionGuidance receives structured data without accessing internal state
- **Accept/dismiss actions** give users control over AI suggestions with full recommendation history
- **Three LLM validators** prevent hallucinations: weight change limits (±20%), rep ranges (1-20), plateau-strategy consistency
- **bcrypt authentication** provides secure password hashing with session-based token management

See [design-evolution.md](design/design-evolution.md) for detailed rationale and implementation notes.

## Test Results

All tests passing across WorkoutLog, ProgressionGuidance, and UserAuthentication concepts.

View detailed test outputs in `design/test-outputs/`

## Future Work

- Frontend implementation
- - **Workout Templates** - Save and reuse exercise groupings (e.g., "Leg Day", "Push Day") for one-tap workout starts
- Real-time LLM integration in production 
- Exercise library with metadata (units, movement types)
- Advanced analytics and progress visualization

## Course Context

Built for MIT 6.1040 (Software Studio) Assignment 4a - Concept Implementation.

## License

MIT

---

**Author:** Honorine Munezero  
