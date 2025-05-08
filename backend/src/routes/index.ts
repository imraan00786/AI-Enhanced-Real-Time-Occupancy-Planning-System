import { Router } from 'express';
import occupancyRouter from './occupancy.routes';
import assignDeskRouter from './assignDesk.routes';
import nlpQueryRouter from './nlpQuery.routes';

const router = Router();

router.use('/query-availability', occupancyRouter);
router.use('/assign-desk', assignDeskRouter);
router.use('/nlp-query', nlpQueryRouter);

export default router;
