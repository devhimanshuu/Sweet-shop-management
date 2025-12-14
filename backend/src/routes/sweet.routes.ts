import { Router } from "express";
import {
  createSweet,
  getAllSweets,
  getSweetById,
  searchSweets,
  updateSweet,
  purchaseSweet,
  restockSweet,
  deleteSweet,
} from "../controllers/sweetController";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post("/", createSweet);
router.get("/", getAllSweets);
router.get("/search", searchSweets);
router.get("/:id", getSweetById);
router.put("/:id", updateSweet);
router.post("/:id/purchase", purchaseSweet);
router.post("/:id/restock", isAdmin, restockSweet);
router.delete("/:id", isAdmin, deleteSweet);

export default router;
