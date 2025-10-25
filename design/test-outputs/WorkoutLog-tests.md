# WorkoutLog test outputs

[0m[38;5;245mrunning 7 tests from ./src/concepts/WorkoutLog/WorkoutLogConcept.test.ts[0m
Principle: Log sets and retrieve workout history ...
[0m[38;5;245m------- output -------[0m
📝 Testing operational principle...
✅ Logged and retrieved 3 sets

[0m[38;5;245m----- output end -----[0m
Principle: Log sets and retrieve workout history ... [0m[32mok[0m [0m[38;5;245m(728ms)[0m
Action: getLastWorkout returns most recent set ...
[0m[38;5;245m------- output -------[0m
📝 Testing getLastWorkout...
✅ Retrieved last workout: 230lbs × 5 reps

[0m[38;5;245m----- output end -----[0m
Action: getLastWorkout returns most recent set ... [0m[32mok[0m [0m[38;5;245m(622ms)[0m
Action: getSummary provides structured data ...
[0m[38;5;245m------- output -------[0m
📝 Testing getSummary...
✅ Summary: 2 sets across 1 sessions

[0m[38;5;245m----- output end -----[0m
Action: getSummary provides structured data ... [0m[32mok[0m [0m[38;5;245m(657ms)[0m
Action: logSet requires weight >= 0 ...
[0m[38;5;245m------- output -------[0m
📝 Testing weight validation...
✅ Correctly rejected negative weight

[0m[38;5;245m----- output end -----[0m
Action: logSet requires weight >= 0 ... [0m[32mok[0m [0m[38;5;245m(583ms)[0m
Action: logSet requires reps > 0 ...
[0m[38;5;245m------- output -------[0m
📝 Testing reps validation...
✅ Correctly rejected zero reps

[0m[38;5;245m----- output end -----[0m
Action: logSet requires reps > 0 ... [0m[32mok[0m [0m[38;5;245m(513ms)[0m
Action: getLastWorkout throws when no history exists ...
[0m[38;5;245m------- output -------[0m
📝 Testing error handling for missing history...
✅ Correctly threw error for missing history

[0m[38;5;245m----- output end -----[0m
Action: getLastWorkout throws when no history exists ... [0m[32mok[0m [0m[38;5;245m(487ms)[0m
Action: logSet accepts duration for timed exercises ...
[0m[38;5;245m------- output -------[0m
📝 Testing duration logging...
✅ Logged timed exercise (60 seconds)

[0m[38;5;245m----- output end -----[0m
Action: logSet accepts duration for timed exercises ... [0m[32mok[0m [0m[38;5;245m(547ms)[0m

[0m[32mok[0m | 7 passed | 0 failed [0m[38;5;245m(4s)[0m

