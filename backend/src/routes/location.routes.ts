import { Router } from 'express';
import {
  updateUserLocationHandler,
  getUserLocationHandler,
  getNearbyDiscoveryHandler,
} from '../controllers/location.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Protected Location Endpoints
router.patch('/users/me/location', authMiddleware, updateUserLocationHandler);
router.get('/users/me/location', authMiddleware, getUserLocationHandler);
router.get('/discovery/nearby', authMiddleware, getNearbyDiscoveryHandler);

export default router;
