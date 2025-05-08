import { Router } from 'express';
import { handleNLPQuery } from '../controllers/nlpQuery.controller';

const router = Router();
router.post('/', handleNLPQuery);
export default router;
