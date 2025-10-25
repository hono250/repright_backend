# ExerciseLibrary test outputs

[0m[38;5;245mrunning 9 tests from ./src/concepts/ExerciseLibrary/ExerciseLibraryConcept.test.ts[0m
Action: seedGlobalExercises imports exercise database ...
[0m[38;5;245m------- output -------[0m
📝 Testing global exercise seeding...
✅ Seeded 2 global exercises

[0m[38;5;245m----- output end -----[0m
Action: seedGlobalExercises imports exercise database ... [0m[32mok[0m [0m[38;5;245m(640ms)[0m
Action: searchExercises filters by muscle group ...
[0m[38;5;245m------- output -------[0m
📝 Testing search with filters...
✅ Filtered exercises by muscle group

[0m[38;5;245m----- output end -----[0m
Action: searchExercises filters by muscle group ... [0m[32mok[0m [0m[38;5;245m(613ms)[0m
Action: addCustomExercise creates user-specific exercise ...
[0m[38;5;245m------- output -------[0m
📝 Testing custom exercise creation...
✅ Created custom exercise

[0m[38;5;245m----- output end -----[0m
Action: addCustomExercise creates user-specific exercise ... [0m[32mok[0m [0m[38;5;245m(656ms)[0m
Principle: Custom exercises only visible to creator ...
[0m[38;5;245m------- output -------[0m
📝 Testing user-scoped custom exercises...
✅ Custom exercises properly scoped to user

[0m[38;5;245m----- output end -----[0m
Principle: Custom exercises only visible to creator ... [0m[32mok[0m [0m[38;5;245m(678ms)[0m
Action: updateCustomExercise modifies metadata ...
[0m[38;5;245m------- output -------[0m
📝 Testing custom exercise update...
✅ Updated custom exercise metadata

[0m[38;5;245m----- output end -----[0m
Action: updateCustomExercise modifies metadata ... [0m[32mok[0m [0m[38;5;245m(662ms)[0m
Action: deleteCustomExercise removes exercise ...
[0m[38;5;245m------- output -------[0m
📝 Testing custom exercise deletion...
✅ Deleted custom exercise

[0m[38;5;245m----- output end -----[0m
Action: deleteCustomExercise removes exercise ... [0m[32mok[0m [0m[38;5;245m(654ms)[0m
Action: searchExercises requires query or filters ...
[0m[38;5;245m------- output -------[0m
📝 Testing search validation...
✅ Correctly rejected empty search

[0m[38;5;245m----- output end -----[0m
Action: searchExercises requires query or filters ... [0m[32mok[0m [0m[38;5;245m(538ms)[0m
Action: addCustomExercise requires valid trackingType ...
[0m[38;5;245m------- output -------[0m
📝 Testing trackingType validation...
✅ Created exercises with different trackingTypes

[0m[38;5;245m----- output end -----[0m
Action: addCustomExercise requires valid trackingType ... [0m[32mok[0m [0m[38;5;245m(642ms)[0m
Action: updateCustomExercise prevents changing immutable fields ...
[0m[38;5;245m------- output -------[0m
📝 Testing immutable field protection...
✅ Immutable fields protected

[0m[38;5;245m----- output end -----[0m
Action: updateCustomExercise prevents changing immutable fields ... [0m[32mok[0m [0m[38;5;245m(680ms)[0m

[0m[32mok[0m | 9 passed | 0 failed [0m[38;5;245m(5s)[0m

