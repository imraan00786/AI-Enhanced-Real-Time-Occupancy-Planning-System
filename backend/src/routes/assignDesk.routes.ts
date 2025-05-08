import { Router } from 'express';
import { assignDesk } from '../controllers/assignDesk.controller';

const router = Router();
router.post('/', assignDesk);
export default router;
