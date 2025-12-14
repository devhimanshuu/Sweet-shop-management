import { SweetService } from "../../src/services/sweetService";
import pool from "../../src/config/database";

describe("SweetService", () => {
  let sweetService: SweetService;
  let testSweetId: number;

  beforeAll(async () => {
    sweetService = new SweetService();
    await pool.query("DELETE FROM sweets WHERE name LIKE $1", ["Test%"]);
  });

  afterAll(async () => {
    await pool.query("DELETE FROM sweets WHERE name LIKE $1", ["Test%"]);
  });

  describe("createSweet", () => {
    it("should create a new sweet with valid data", async () => {
      const sweetData = {
        name: "Test Chocolate",
        category: "Chocolate",
        price: 2.5,
        quantity: 100,
        description: "Test description",
      };

      const sweet = await sweetService.createSweet(sweetData);
      testSweetId = sweet.id;

      expect(sweet).toHaveProperty("id");
      expect(sweet.name).toBe(sweetData.name);
      expect(sweet.price).toBe(sweetData.price);
      expect(sweet.quantity).toBe(sweetData.quantity);
    });

    it("should throw error for negative price", async () => {
      const sweetData = {
        name: "Test Sweet",
        category: "Candy",
        price: -5,
        quantity: 10,
      };

      await expect(sweetService.createSweet(sweetData)).rejects.toThrow(
        "Price must be positive"
      );
    });

    it("should throw error for negative quantity", async () => {
      const sweetData = {
        name: "Test Sweet 2",
        category: "Candy",
        price: 5,
        quantity: -10,
      };

      await expect(sweetService.createSweet(sweetData)).rejects.toThrow(
        "Quantity cannot be negative"
      );
    });
  });

  describe("getAllSweets", () => {
    it("should return all sweets", async () => {
      const sweets = await sweetService.getAllSweets();
      expect(Array.isArray(sweets)).toBe(true);
      expect(sweets.length).toBeGreaterThan(0);
    });
  });

  describe("getSweetById", () => {
    it("should return sweet by id", async () => {
      const sweet = await sweetService.getSweetById(testSweetId);
      expect(sweet).toBeDefined();
      expect(sweet.id).toBe(testSweetId);
    });

    it("should throw error for non-existent sweet", async () => {
      await expect(sweetService.getSweetById(99999)).rejects.toThrow(
        "Sweet not found"
      );
    });
  });

  describe("searchSweets", () => {
    it("should search by name", async () => {
      const results = await sweetService.searchSweets({ name: "Test" });
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain("Test");
    });

    it("should filter by category", async () => {
      const results = await sweetService.searchSweets({
        category: "Chocolate",
      });
      results.forEach((sweet) => {
        expect(sweet.category).toBe("Chocolate");
      });
    });

    it("should filter by price range", async () => {
      const results = await sweetService.searchSweets({
        minPrice: 2,
        maxPrice: 5,
      });

      results.forEach((sweet) => {
        expect(sweet.price).toBeGreaterThanOrEqual(2);
        expect(sweet.price).toBeLessThanOrEqual(5);
      });
    });
  });

  describe("updateSweet", () => {
    it("should update sweet details", async () => {
      const updates = { price: 3.5, quantity: 150 };
      const updated = await sweetService.updateSweet(testSweetId, updates);

      expect(updated.price).toBe(3.5);
      expect(updated.quantity).toBe(150);
    });
  });

  describe("purchaseSweet", () => {
    it("should decrease quantity when purchased", async () => {
      const initial = await sweetService.getSweetById(testSweetId);
      await sweetService.purchaseSweet(testSweetId, 10);
      const updated = await sweetService.getSweetById(testSweetId);

      expect(updated.quantity).toBe(initial.quantity - 10);
    });

    it("should throw error for insufficient quantity", async () => {
      await expect(
        sweetService.purchaseSweet(testSweetId, 10000)
      ).rejects.toThrow("Insufficient quantity");
    });

    it("should throw error for invalid quantity", async () => {
      await expect(sweetService.purchaseSweet(testSweetId, -5)).rejects.toThrow(
        "Invalid purchase quantity"
      );
    });
  });

  describe("restockSweet", () => {
    it("should increase quantity when restocked", async () => {
      const initial = await sweetService.getSweetById(testSweetId);
      await sweetService.restockSweet(testSweetId, 50);
      const updated = await sweetService.getSweetById(testSweetId);

      expect(updated.quantity).toBe(initial.quantity + 50);
    });

    it("should throw error for invalid restock quantity", async () => {
      await expect(sweetService.restockSweet(testSweetId, -10)).rejects.toThrow(
        "Invalid restock quantity"
      );
    });
  });

  describe("deleteSweet", () => {
    it("should delete sweet successfully", async () => {
      const newSweet = await sweetService.createSweet({
        name: "Test Delete",
        category: "Candy",
        price: 1,
        quantity: 10,
      });

      await sweetService.deleteSweet(newSweet.id);

      await expect(sweetService.getSweetById(newSweet.id)).rejects.toThrow(
        "Sweet not found"
      );
    });
  });
});
