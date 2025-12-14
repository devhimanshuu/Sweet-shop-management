import bcrypt from "bcryptjs";
import pool from "../config/database";
import { generateToken } from "../utils/jwt";

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  async register(userData: RegisterData) {
    const { email, password, name } = userData;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      "INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, role",
      [email, hashedPassword, name]
    );

    const user = result.rows[0];
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  async login(email: string, password: string) {
    // Normalize email to lowercase for case-insensitive comparison
    const normalizedEmail = email.toLowerCase().trim();
    const DEBUG = process.env.DEBUG === "true";
    
    const result = await pool.query("SELECT * FROM users WHERE LOWER(email) = $1", [
      normalizedEmail,
    ]);

    if (result.rows.length === 0) {
      if (DEBUG) console.log(`[AUTH] User not found: ${normalizedEmail}`);
      throw new Error("Invalid credentials");
    }

    const user = result.rows[0];
    if (DEBUG) console.log(`[AUTH] User found: ${user.email}, role: ${user.role}`);
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (DEBUG) console.log(`[AUTH] Password match: ${isValidPassword}`);

    if (!isValidPassword) {
      if (DEBUG) console.log(`[AUTH] Invalid password for user: ${normalizedEmail}`);
      throw new Error("Invalid credentials");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    if (DEBUG) console.log(`[AUTH] Login successful for user: ${user.email}`);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }
}
