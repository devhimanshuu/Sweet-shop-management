import request from "supertest";
import app from "../../src/server";
import pool from "../../src/config/database";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["integration%"]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM users WHERE email LIKE $1", ["integration%"]);
    await pool.end();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/auth/register").send({
        email: "integration@test.com",
        password: "password123",
        name: "Integration Test",
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("integration@test.com");
    });

    it("should return 400 for duplicate email", async () => {
      await request(app).post("/api/auth/register").send({
        email: "integration_duplicate@test.com",
        password: "password123",
        name: "Test",
      });

      const response = await request(app).post("/api/auth/register").send({
        email: "integration_duplicate@test.com",
        password: "password123",
        name: "Test",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeAll(async () => {
      await request(app).post("/api/auth/register").send({
        email: "integration_login@test.com",
        password: "password123",
        name: "Login Test",
      });
    });

    it("should login with valid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "integration_login@test.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body.user.email).toBe("integration_login@test.com");
    });

    it("should return 401 for invalid credentials", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "integration_login@test.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
    });
  });
});
