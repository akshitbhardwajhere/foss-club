"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * @file contactRoutes.ts
 * @description Express routes for the public contact and community registration form (`/api/contact`).
 *
 * Allows users to submit their application, and admins to approve them dashboard-side.
 */
const router = express_1.default.Router();
router.route("/").post(contactController_1.submitContactForm);
router.route("/approve").post(authMiddleware_1.protect, contactController_1.approveCommunityRequest);
exports.default = router;
