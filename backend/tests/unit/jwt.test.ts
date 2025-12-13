import { generateToken, verifyToken } from "../../src/utils/jwt";

describe("JWT Utils", () => {
  const mockPayload = {
    id: 1,
    email: "test@example.com",
    role: "user",
  };

  it("should generate a valid JWT token", () => {
    const token = generateToken(mockPayload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
  });

  it("should verify and decode token correctly", () => {
    const token = generateToken(mockPayload);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(mockPayload.id);
    expect(decoded.email).toBe(mockPayload.email);
    expect(decoded.role).toBe(mockPayload.role);
  });

  it("should throw error for invalid token", () => {
    expect(() => verifyToken("invalid-token")).toThrow();
  });
});
