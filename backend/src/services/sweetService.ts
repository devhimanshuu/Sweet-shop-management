import pool from "../config/database";

interface CreateSweetData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
}

interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class SweetService {
  async createSweet(data: CreateSweetData) {
    const { name, category, price, quantity, description, image_url } = data;

    if (price < 0) {
      throw new Error("Price must be positive");
    }

    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    const result = await pool.query(
      `INSERT INTO sweets (name, category, price, quantity, description, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, category, price, quantity, description || null, image_url || null]
    );

    return result.rows[0];
  }

  async getAllSweets() {
    const result = await pool.query(
      "SELECT * FROM sweets ORDER BY created_at DESC"
    );
    return result.rows;
  }

  async getSweetById(id: number) {
    const result = await pool.query("SELECT * FROM sweets WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      throw new Error("Sweet not found");
    }

    return result.rows[0];
  }

  async searchSweets(params: SearchParams) {
    let query = "SELECT * FROM sweets WHERE 1=1";
    const values: any[] = [];
    let paramCount = 1;

    if (params.name) {
      query += ` AND name ILIKE $${paramCount}`;
      values.push(`%${params.name}%`);
      paramCount++;
    }

    if (params.category) {
      query += ` AND category = $${paramCount}`;
      values.push(params.category);
      paramCount++;
    }

    if (params.minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(params.minPrice);
      paramCount++;
    }

    if (params.maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(params.maxPrice);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }

  async updateSweet(id: number, updates: Partial<CreateSweetData>) {
    const sweet = await this.getSweetById(id);

    const {
      name = sweet.name,
      category = sweet.category,
      price = sweet.price,
      quantity = sweet.quantity,
      description = sweet.description,
      image_url = sweet.image_url,
    } = updates;

    if (price < 0) {
      throw new Error("Price must be positive");
    }

    if (quantity < 0) {
      throw new Error("Quantity cannot be negative");
    }

    const result = await pool.query(
      `UPDATE sweets 
       SET name = $1, category = $2, price = $3, quantity = $4, 
           description = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, category, price, quantity, description, image_url, id]
    );

    return result.rows[0];
  }

  async purchaseSweet(id: number, purchaseQuantity: number) {
    if (purchaseQuantity <= 0) {
      throw new Error("Invalid purchase quantity");
    }

    const sweet = await this.getSweetById(id);

    if (sweet.quantity < purchaseQuantity) {
      throw new Error("Insufficient quantity");
    }

    const result = await pool.query(
      `UPDATE sweets 
       SET quantity = quantity - $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [purchaseQuantity, id]
    );

    return result.rows[0];
  }

  async restockSweet(id: number, restockQuantity: number) {
    if (restockQuantity <= 0) {
      throw new Error("Invalid restock quantity");
    }

    await this.getSweetById(id); // Verify sweet exists

    const result = await pool.query(
      `UPDATE sweets 
       SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [restockQuantity, id]
    );

    return result.rows[0];
  }

  async deleteSweet(id: number) {
    await this.getSweetById(id); // Verify sweet exists

    await pool.query("DELETE FROM sweets WHERE id = $1", [id]);

    return { message: "Sweet deleted successfully" };
  }
}
