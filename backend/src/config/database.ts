import { Pool } from "pg";
import dotenv from "dotenv";

import { types } from "pg";

// Configure pg to parse numeric/decimal columns as floats instead of strings
types.setTypeParser(1700, (val) => parseFloat(val));

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("connect", () => {
  console.log("✅ Database connected successfully");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
  process.exit(-1);
});

export default pool;
