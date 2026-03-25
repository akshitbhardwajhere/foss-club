import { Router } from "express";
import {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  initSheet,
} from "../controllers/sheetController";

/**
 * @file sheetRoutes.ts
 * @description Express routes for direct Google Sheets interactions (`/api/sheet`).
 * 
 * Typically used by the frontend dashboard to execute CRUD operations synced to the main Google Sheet.
 */
const router = Router();

router.get("/", getEntries);
router.post("/", addEntry);
router.post("/init", initSheet);
router.put("/:rowIndex", updateEntry);
router.delete("/:rowIndex", deleteEntry);

export default router;
