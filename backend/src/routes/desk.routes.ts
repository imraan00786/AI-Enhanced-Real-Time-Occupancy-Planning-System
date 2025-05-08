import { Router } from 'express';
import { DeskController } from '../controllers/desk.controller';

const router = Router();
const deskController = new DeskController();

// Get all desks
router.get('/', deskController.getAllDesks);

// Get desk by ID
router.get('/:id', deskController.getDeskById);

// Get desks by floor
router.get('/floor/:floor', deskController.getDesksByFloor);

// Get available desks
router.get('/available', deskController.getAvailableDesks);

// Get desks by features
router.get('/features', deskController.getDesksByFeatures);

// Create new desk
router.post('/', deskController.createDesk);

// Update desk
router.put('/:id', deskController.updateDesk);

// Delete desk
router.delete('/:id', deskController.deleteDesk);

export default router; 