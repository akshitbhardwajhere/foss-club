import express from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { protect } from '../middleware/authMiddleware';

/**
 * @file statsRoutes.ts
 * @description Express routes for fetching dashboard statistics (`/api/stats`).
 * 
 * Returns aggregated data for admins. Protected route.
 */
const router = express.Router();

router.get('/', protect, getDashboardStats);

export default router;
