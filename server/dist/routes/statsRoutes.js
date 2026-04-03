"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statsController_1 = require("../controllers/statsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * @file statsRoutes.ts
 * @description Express routes for fetching dashboard statistics (`/api/stats`).
 *
 * Returns aggregated data for admins. Protected route.
 */
const router = express_1.default.Router();
router.get('/', authMiddleware_1.protect, statsController_1.getDashboardStats);
exports.default = router;
