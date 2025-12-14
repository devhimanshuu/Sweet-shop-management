import { AuthService } from "../../src/services/authService";
import pool from "../../src/config/database";

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(async () => {
    authService = new AuthService();
    // Clean test data
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["test%"]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["test%"]);
    await pool.end();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "test1@example.com",
        password: "password123",
        name: "Test User",
      };

      const result = await authService.register(userData);

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe(userData.email);
      expect(result.user.name).toBe(userData.name);
      expect(result.user).not.toHaveProperty("password");
    });

    it("should hash password before storing", async () => {
      const userData = {
        email: "test2@example.com",
        password: "password123",
        name: "Test User 2",
      };

      await authService.register(userData);

      const dbResult = await pool.query(
        "SELECT password FROM users WHERE email = $1",
        [userData.email]
      );
      expect(dbResult.rows[0].password).not.toBe(userData.password);
      expect(dbResult.rows[0].password.length).toBeGreaterThan(20);
    });

    it("should throw error for duplicate email", async () => {
      const userData = {
        email: "test3@example.com",
        password: "password123",
        name: "Test User 3",
      };

      await authService.register(userData);

      await expect(authService.register(userData)).rejects.toThrow(
        "Email already exists"
      );
    });

    it("should validate email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "password123",
        name: "Test User",
      };

      await expect(authService.register(userData)).rejects.toThrow(
        "Invalid email format"
      );
    });

    it("should validate password length", async () => {
      const userData = {
        email: "test4@example.com",
        password: "123",
        name: "Test User",
      };

      await expect(authService.register(userData)).rejects.toThrow(
        "Password must be at least 6 characters"
      );
    });
  });

  describe("login", () => {
    beforeAll(async () => {
      await authService.register({
        email: "test_login@example.com",
        password: "password123",
        name: "Login Test",
      });
    });

    it("should login with valid credentials", async () => {
      const result = await authService.login(
        "test_login@example.com",
        "password123"
      );

      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token");
      expect(result.user.email).toBe("test_login@example.com");
    });

    it("should throw error for non-existent user", async () => {
      await expect(
        authService.login("nonexistent@example.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error for wrong password", async () => {
      await expect(
        authService.login("test_login@example.com", "wrongpassword")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
