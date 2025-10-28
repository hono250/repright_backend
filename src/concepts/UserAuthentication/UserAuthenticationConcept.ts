import { Collection, Db } from "npm:mongodb";
import { ID, Empty } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

/**
 * User document
 */
interface UserDoc {
  _id: ID;
  username: string;
  passwordHash: string;
}

/**
 * Session document
 */
interface SessionDoc {
  _id: ID;
  user: ID;
  token: string;
}

export default class UserAuthenticationConcept {
  private readonly users: Collection<UserDoc>;
  private readonly sessions: Collection<SessionDoc>;

  constructor(private readonly db: Db) {
    this.users = db.collection("users");
    this.sessions = db.collection("sessions");
  }

  /**
   * Register new user
   */
  async register(params: {username: string, password: string}): Promise<{ userId: ID }> {
    const {username,password} = params;
    const existing = await this.users.findOne({ username });
    if (existing) {
      throw new Error("Username already taken");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const passwordHash = await bcrypt.hash(password);
    const userId = freshID();

    await this.users.insertOne({
      _id: userId,
      username,
      passwordHash,
    });

    return {userId};
  }


  /**
   * Login - creates session and returns token
   */
  async login(params: {username: string, password: string}): Promise<{ token: string }> {
    const { username, password } = params;
    const user = await this.users.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new Error("Invalid credentials");
    }

    const token = freshID();
    await this.sessions.insertOne({
      _id: freshID(),
      user: user._id,
      token,
    });

    return {token};
  }

  /**
   * Authenticate token - returns user ID
   */
  async authenticate(params: { token: string }): Promise<{ userId: ID }> {
    const { token } = params;
    const session = await this.sessions.findOne({ token });
    if (!session) {
      throw new Error("Invalid or expired session");
    }

    return { userId: session.user };
  }

  /**
   * Logout - removes session
   */
  async logout(params: {token: string}): Promise<Empty> {
    const { token } = params;
    const result = await this.sessions.deleteOne({ token });
    if (result.deletedCount === 0) {
      throw new Error("Session not found");
    }
    return {} as Empty;
  }

  /**
   * Delete account - removes user and all sessions
   */
  async deleteAccount(params: { userId: ID }): Promise<Empty> {
    const { userId } = params;
    const user = await this.users.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    await this.users.deleteOne({ _id: userId });
    await this.sessions.deleteMany({ user: userId });

    return {} as Empty; 
  }
}