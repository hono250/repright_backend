# UserAuthentication test outputs

[0m[38;5;245mrunning 7 tests from ./src/concepts/UserAuthentication/UserAuthenticationConcept.test.ts[0m
Principle: Register, login, authenticate, logout ...
[0m[38;5;245m------- output -------[0m
📝 Testing operational principle...
  ✓ Registered user: 019a1d38-467a-7647-829a-d81b195c54af
  ✓ Logged in with token
  ✓ Authenticated successfully
  ✓ Logged out
✅ Complete registration → login → logout flow

[0m[38;5;245m----- output end -----[0m
Principle: Register, login, authenticate, logout ... [0m[32mok[0m [0m[38;5;245m(991ms)[0m
Action: register rejects duplicate username ...
[0m[38;5;245m------- output -------[0m
📝 Testing duplicate username rejection...
✅ Correctly rejected duplicate username

[0m[38;5;245m----- output end -----[0m
Action: register rejects duplicate username ... [0m[32mok[0m [0m[38;5;245m(1s)[0m
Action: register requires password >= 6 characters ...
[0m[38;5;245m------- output -------[0m
📝 Testing password length validation...
✅ Correctly rejected short password

[0m[38;5;245m----- output end -----[0m
Action: register requires password >= 6 characters ... [0m[32mok[0m [0m[38;5;245m(590ms)[0m
Action: login rejects invalid credentials ...
[0m[38;5;245m------- output -------[0m
📝 Testing invalid credentials...
✅ Correctly rejected invalid credentials

[0m[38;5;245m----- output end -----[0m
Action: login rejects invalid credentials ... [0m[32mok[0m [0m[38;5;245m(864ms)[0m
Action: User can have multiple active sessions ...
[0m[38;5;245m------- output -------[0m
📝 Testing multiple sessions...
✅ Multiple sessions work correctly

[0m[38;5;245m----- output end -----[0m
Action: User can have multiple active sessions ... [0m[32mok[0m [0m[38;5;245m(1s)[0m
Action: deleteAccount removes user and all sessions ...
[0m[38;5;245m------- output -------[0m
📝 Testing account deletion...
✅ Account and sessions deleted successfully

[0m[38;5;245m----- output end -----[0m
Action: deleteAccount removes user and all sessions ... [0m[32mok[0m [0m[38;5;245m(1s)[0m
Action: logout throws error for invalid token ...
[0m[38;5;245m------- output -------[0m
📝 Testing logout with invalid token...
✅ Correctly rejected invalid logout token

[0m[38;5;245m----- output end -----[0m
Action: logout throws error for invalid token ... [0m[32mok[0m [0m[38;5;245m(607ms)[0m

[0m[32mok[0m | 7 passed | 0 failed [0m[38;5;245m(6s)[0m

