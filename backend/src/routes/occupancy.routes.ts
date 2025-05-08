import { Router } from 'express';
import { getOccupancyData } from '../controllers/occupancy.controller';

const router = Router();
router.get('/', getOccupancyData);
export default router;
