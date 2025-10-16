import { assertEquals, assertRejects } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import UserAuthenticationConcept from "./UserAuthenticationConcept.ts";

// Test 1: Operational Principle
Deno.test("Principle: Register, login, authenticate, logout", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing operational principle...");
  
  // Register
  const userId = await auth.register("alice", "password123");
  console.log(`  ✓ Registered user: ${userId}`);
  
  // Login
  const token = await auth.login("alice", "password123");
  console.log(`  ✓ Logged in with token`);
  
  // Authenticate
  const authenticatedUser = await auth.authenticate(token);
  assertEquals(authenticatedUser, userId, "Should return same user ID");
  console.log(`  ✓ Authenticated successfully`);
  
  // Logout
  await auth.logout(token);
  console.log(`  ✓ Logged out`);
  
  // Verify can't authenticate after logout
  await assertRejects(
    async () => await auth.authenticate(token),
    Error,
    "Invalid or expired session"
  );
  
  console.log("✅ Complete registration → login → logout flow\n");
  
  await client.close();
});

// Test 2: Duplicate username rejected
Deno.test("Action: register rejects duplicate username", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing duplicate username rejection...");
  
  await auth.register("bob", "password123");
  
  await assertRejects(
    async () => await auth.register("bob", "different_password"),
    Error,
    "Username already taken"
  );
  
  console.log("✅ Correctly rejected duplicate username\n");
  
  await client.close();
});

// Test 3: Password length validation
Deno.test("Action: register requires password >= 6 characters", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing password length validation...");
  
  await assertRejects(
    async () => await auth.register("charlie", "short"),
    Error,
    "Password must be at least 6 characters"
  );
  
  console.log("✅ Correctly rejected short password\n");
  
  await client.close();
});

// Test 4: Invalid credentials on login
Deno.test("Action: login rejects invalid credentials", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing invalid credentials...");
  
  await auth.register("dave", "correctpass");
  
  // Wrong password
  await assertRejects(
    async () => await auth.login("dave", "wrongpass"),
    Error,
    "Invalid credentials"
  );
  
  // Non-existent user
  await assertRejects(
    async () => await auth.login("nonexistent", "anypass"),
    Error,
    "Invalid credentials"
  );
  
  console.log("✅ Correctly rejected invalid credentials\n");
  
  await client.close();
});

// Test 5: Multiple sessions for same user
Deno.test("Action: User can have multiple active sessions", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing multiple sessions...");
  
  await auth.register("eve", "password123");
  
  const token1 = await auth.login("eve", "password123");
  const token2 = await auth.login("eve", "password123");
  
  // Both tokens should work
  const user1 = await auth.authenticate(token1);
  const user2 = await auth.authenticate(token2);
  assertEquals(user1, user2, "Both tokens should authenticate same user");
  
  console.log("✅ Multiple sessions work correctly\n");
  
  await client.close();
});

// Test 6: Delete account removes all sessions
Deno.test("Action: deleteAccount removes user and all sessions", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing account deletion...");
  
  const userId = await auth.register("frank", "password123");
  const token1 = await auth.login("frank", "password123");
  const token2 = await auth.login("frank", "password123");
  
  // Delete account
  await auth.deleteAccount(userId);
  
  // All sessions should be invalid
  await assertRejects(
    async () => await auth.authenticate(token1),
    Error,
    "Invalid or expired session"
  );
  
  await assertRejects(
    async () => await auth.authenticate(token2),
    Error,
    "Invalid or expired session"
  );
  
  // Can't login again
  await assertRejects(
    async () => await auth.login("frank", "password123"),
    Error,
    "Invalid credentials"
  );
  
  console.log("✅ Account and sessions deleted successfully\n");
  
  await client.close();
});

// Test 7: Logout invalid token
Deno.test("Action: logout throws error for invalid token", async () => {
  const [db, client] = await testDb();
  const auth = new UserAuthenticationConcept(db);

  console.log("📝 Testing logout with invalid token...");
  
  await assertRejects(
    async () => await auth.logout("fake-token-12345"),
    Error,
    "Session not found"
  );
  
  console.log("✅ Correctly rejected invalid logout token\n");
  
  await client.close();
});