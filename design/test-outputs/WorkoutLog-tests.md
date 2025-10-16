# WorkoutLog test outputs

[0m[38;5;245mrunning 7 tests from ./src/concepts/WorkoutLog/WorkoutLogConcept.test.ts[0m
Principle: Log sets and retrieve workout history ...
[0m[38;5;245m------- output -------[0m
📝 Testing operational principle...
✅ Logged and retrieved 3 sets

[0m[38;5;245m----- output end -----[0m
Principle: Log sets and retrieve workout history ... [0m[32mok[0m [0m[38;5;245m(733ms)[0m
Action: getLastWorkout returns most recent set ...
[0m[38;5;245m------- output -------[0m
📝 Testing getLastWorkout...
✅ Retrieved last workout: 230lbs × 5 reps

[0m[38;5;245m----- output end -----[0m
Action: getLastWorkout returns most recent set ... [0m[32mok[0m [0m[38;5;245m(667ms)[0m
Action: getSummary provides structured data ...
[0m[38;5;245m------- output -------[0m
📝 Testing getSummary...
✅ Summary: 2 sets across 1 sessions

[0m[38;5;245m----- output end -----[0m
Action: getSummary provides structured data ... [0m[32mok[0m [0m[38;5;245m(632ms)[0m
Action: logSet requires weight >= 0 ...
[0m[38;5;245m------- output -------[0m
📝 Testing weight validation...
✅ Correctly rejected negative weight

[0m[38;5;245m----- output end -----[0m
Action: logSet requires weight >= 0 ... [0m[32mok[0m [0m[38;5;245m(551ms)[0m
Action: logSet requires reps > 0 ...
[0m[38;5;245m------- output -------[0m
📝 Testing reps validation...
✅ Correctly rejected zero reps

[0m[38;5;245m----- output end -----[0m
Action: logSet requires reps > 0 ... [0m[32mok[0m [0m[38;5;245m(499ms)[0m
Action: deleteSet removes specific workout ...
[0m[38;5;245m------- output -------[0m
📝 Testing deleteSet...
✅ Successfully deleted workout set

[0m[38;5;245m----- output end -----[0m
Action: deleteSet removes specific workout ... [0m[32mok[0m [0m[38;5;245m(612ms)[0m
Action: getLastWorkout throws when no history exists ...
[0m[38;5;245m------- output -------[0m
📝 Testing error handling for missing history...
✅ Correctly threw error for missing history

[0m[38;5;245m----- output end -----[0m
Action: getLastWorkout throws when no history exists ... [0m[32mok[0m [0m[38;5;245m(533ms)[0m

[0m[32mok[0m | 7 passed | 0 failed [0m[38;5;245m(4s)[0m

