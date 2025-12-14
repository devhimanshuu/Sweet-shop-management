import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { SweetService } from "../services/sweetService";

const sweetService = new SweetService();

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, price, quantity, description, image_url } =
      req.body;

    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const sweet = await sweetService.createSweet({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
      image_url,
    });

    res.status(201).json(transformSweet(sweet));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to transform sweet data (convert price and quantity to numbers)
const transformSweet = (sweet: any) => ({
  ...sweet,
  price: parseFloat(sweet.price),
  quantity: parseInt(sweet.quantity),
});

export const getAllSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await sweetService.getAllSweets();
    res.json(sweets.map(transformSweet));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSweetById = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await sweetService.getSweetById(parseInt(req.params.id));
    res.json(transformSweet(sweet));
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const params: any = {};
    if (name) params.name = name as string;
    if (category) params.category = category as string;
    if (minPrice) params.minPrice = parseFloat(minPrice as string);
    if (maxPrice) params.maxPrice = parseFloat(maxPrice as string);

    const sweets = await sweetService.searchSweets(params);
    res.json(sweets.map(transformSweet));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response) => {
  try {
    const updates = req.body;
    if (updates.price) updates.price = parseFloat(updates.price);
    if (updates.quantity) updates.quantity = parseInt(updates.quantity);

    const sweet = await sweetService.updateSweet(
      parseInt(req.params.id),
      updates
    );
    res.json(transformSweet(sweet));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Valid quantity required" });
    }

    const sweet = await sweetService.purchaseSweet(
      parseInt(req.params.id),
      parseInt(quantity)
    );

    res.json(transformSweet(sweet));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Valid quantity required" });
    }

    const sweet = await sweetService.restockSweet(
      parseInt(req.params.id),
      parseInt(quantity)
    );

    res.json(transformSweet(sweet));
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  try {
    const result = await sweetService.deleteSweet(parseInt(req.params.id));
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
