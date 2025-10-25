# WorkoutTemplate test outputs

[0m[38;5;245mrunning 7 tests from ./src/concepts/WorkoutTemplate/WorkoutTemplateConcept.test.ts[0m
Action: createTemplate creates workout template ...
[0m[38;5;245m------- output -------[0m
📝 Testing template creation...
✅ Created template with 2 exercises

[0m[38;5;245m----- output end -----[0m
Action: createTemplate creates workout template ... [0m[32mok[0m [0m[38;5;245m(697ms)[0m
Action: createTemplate supports timed exercises ...
[0m[38;5;245m------- output -------[0m
📝 Testing timed exercise template...
✅ Created template with timed exercise

[0m[38;5;245m----- output end -----[0m
Action: createTemplate supports timed exercises ... [0m[32mok[0m [0m[38;5;245m(607ms)[0m
Action: getTemplates returns sorted list ...
[0m[38;5;245m------- output -------[0m
📝 Testing template listing...
✅ Retrieved sorted templates

[0m[38;5;245m----- output end -----[0m
Action: getTemplates returns sorted list ... [0m[32mok[0m [0m[38;5;245m(727ms)[0m
Action: updateTemplate modifies exercises ...
[0m[38;5;245m------- output -------[0m
📝 Testing template update...
✅ Updated template exercises

[0m[38;5;245m----- output end -----[0m
Action: updateTemplate modifies exercises ... [0m[32mok[0m [0m[38;5;245m(622ms)[0m
Action: deleteTemplate removes template ...
[0m[38;5;245m------- output -------[0m
📝 Testing template deletion...
✅ Deleted template

[0m[38;5;245m----- output end -----[0m
Action: deleteTemplate removes template ... [0m[32mok[0m [0m[38;5;245m(660ms)[0m
Action: createTemplate rejects reps + duration in same set ...
[0m[38;5;245m------- output -------[0m
📝 Testing set validation...
✅ Rejected invalid set configuration

[0m[38;5;245m----- output end -----[0m
Action: createTemplate rejects reps + duration in same set ... [0m[32mok[0m [0m[38;5;245m(538ms)[0m
Action: createTemplate requires reps or duration ...
[0m[38;5;245m------- output -------[0m
📝 Testing missing target validation...
✅ Rejected empty set

[0m[38;5;245m----- output end -----[0m
Action: createTemplate requires reps or duration ... [0m[32mok[0m [0m[38;5;245m(558ms)[0m

[0m[32mok[0m | 7 passed | 0 failed [0m[38;5;245m(4s)[0m

