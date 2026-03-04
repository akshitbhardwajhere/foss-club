import { Router } from "express";
import {
  getEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  initSheet,
} from "../controllers/sheetController";

const router = Router();

router.get("/", getEntries);
router.post("/", addEntry);
router.post("/init", initSheet);
router.put("/:rowIndex", updateEntry);
router.delete("/:rowIndex", deleteEntry);

export default router;
