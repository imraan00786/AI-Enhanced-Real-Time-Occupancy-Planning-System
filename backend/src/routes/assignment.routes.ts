import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';

const router = Router();
const assignmentController = new AssignmentController();

// Find optimal desk for an employee
router.post('/find-optimal', assignmentController.findOptimalDesk);

// Assign desk to employee
router.post('/assign', assignmentController.assignDesk);

// Release desk
router.delete('/desk/:deskId', assignmentController.releaseDesk);

// Get assignments for an employee
router.get('/employee/:employeeId', assignmentController.getEmployeeAssignments);

// Get assignment status for a desk
router.get('/desk/:deskId', assignmentController.getDeskAssignment);

export default router; 