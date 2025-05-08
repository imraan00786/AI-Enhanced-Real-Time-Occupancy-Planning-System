import express from 'express';
import * as controller from '../controllers/employee.controller';
const router = express.Router();

// Basic CRUD operations
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

// Preference-based routes
router.get('/preferences/search', controller.getByPreferences);
router.put('/preferences/:id', controller.updatePreferences);
router.put('/preferences/bulk', controller.bulkUpdatePreferences);

// Schedule-based routes
router.get('/schedule/:id', controller.getSchedule);
router.put('/schedule/:id', controller.updateSchedule);
router.get('/schedule/day/:day', controller.getBySchedule);
router.get('/schedule/day/:day/time/:time', controller.getBySchedule);

// Location-based routes
router.get('/location/search', controller.getByLocation);
router.get('/location/floor/:floor', controller.getByFloor);
router.get('/location/team/:teamZone', controller.getByTeamZone);

// Accessibility routes
router.get('/accessibility/:needs', controller.getByAccessibility);

// Desk requirements routes
router.get('/desk-requirements', controller.getByDeskRequirements);

// Team-based routes
router.get('/team/:teamZone', controller.getByTeamZone);

export default router;
