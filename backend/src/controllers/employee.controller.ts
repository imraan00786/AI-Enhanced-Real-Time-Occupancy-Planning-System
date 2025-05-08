import { Request, Response } from 'express';
import * as service from '../services/employee.service';
import { IEmployee } from '../models/Employee.model';

// Validation helper functions
const validateWorkHours = (hours: { start: string; end: string }) => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(hours.start) || !timeRegex.test(hours.end)) {
    throw new Error('Invalid time format. Use HH:MM format (24-hour)');
  }
};

const validateDays = (days: string[]) => {
  const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const invalidDays = days.filter(day => !validDays.includes(day.toLowerCase()));
  if (invalidDays.length > 0) {
    throw new Error(`Invalid days: ${invalidDays.join(', ')}. Valid days are: ${validDays.join(', ')}`);
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const employees = await service.getAllEmployees();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error: (error as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const employee = await service.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const employeeData: Partial<IEmployee> = req.body;
    
    // Validate required fields
    if (!employeeData.name || !employeeData.email || !employeeData.department || !employeeData.employeeId) {
      return res.status(400).json({ 
        message: 'Name, email, department, and employeeId are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employeeData.email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate preferences if provided
    if (employeeData.preferences) {
      const { deskType, locationPreference, noisePreference, preferredDays } = employeeData.preferences;
      
      if (deskType && !['sitting', 'standing', 'any'].includes(deskType)) {
        return res.status(400).json({ message: 'Invalid desk type' });
      }
      
      if (locationPreference && !['window', 'quiet', 'collaborative', 'any'].includes(locationPreference)) {
        return res.status(400).json({ message: 'Invalid location preference' });
      }
      
      if (noisePreference && !['quiet', 'moderate', 'any'].includes(noisePreference)) {
        return res.status(400).json({ message: 'Invalid noise preference' });
      }

      if (preferredDays) {
        try {
          validateDays(preferredDays);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }
    }

    // Validate schedule if provided
    if (employeeData.schedule) {
      if (employeeData.schedule.inOfficeDays) {
        try {
          validateDays(employeeData.schedule.inOfficeDays);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }

      if (employeeData.schedule.workHours) {
        try {
          validateWorkHours(employeeData.schedule.workHours);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }
    }

    const employee = await service.createEmployee(employeeData);
    res.status(201).json(employee);
  } catch (error) {
    if ((error as Error).message.includes('duplicate key')) {
      return res.status(409).json({ message: 'Email or employeeId already exists' });
    }
    res.status(500).json({ message: 'Error creating employee', error: (error as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: Partial<IEmployee> = req.body;

    // Validate email format if email is being updated
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
    }

    // Validate preferences if being updated
    if (updateData.preferences) {
      const { deskType, locationPreference, noisePreference, preferredDays } = updateData.preferences;
      
      if (deskType && !['sitting', 'standing', 'any'].includes(deskType)) {
        return res.status(400).json({ message: 'Invalid desk type' });
      }
      
      if (locationPreference && !['window', 'quiet', 'collaborative', 'any'].includes(locationPreference)) {
        return res.status(400).json({ message: 'Invalid location preference' });
      }
      
      if (noisePreference && !['quiet', 'moderate', 'any'].includes(noisePreference)) {
        return res.status(400).json({ message: 'Invalid noise preference' });
      }

      if (preferredDays) {
        try {
          validateDays(preferredDays);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }
    }

    // Validate schedule if being updated
    if (updateData.schedule) {
      if (updateData.schedule.inOfficeDays) {
        try {
          validateDays(updateData.schedule.inOfficeDays);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }

      if (updateData.schedule.workHours) {
        try {
          validateWorkHours(updateData.schedule.workHours);
        } catch (error) {
          return res.status(400).json({ message: (error as Error).message });
        }
      }
    }

    const employee = await service.updateEmployee(id, updateData);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    if ((error as Error).message.includes('duplicate key')) {
      return res.status(409).json({ message: 'Email or employeeId already exists' });
    }
    res.status(500).json({ message: 'Error updating employee', error: (error as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const employee = await service.deleteEmployee(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error: (error as Error).message });
  }
};

export const getByPreferences = async (req: Request, res: Response) => {
  try {
    const preferences = req.query;
    const employees = await service.getEmployeesByPreferences(preferences as Partial<IEmployee['preferences']>);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by preferences', error: (error as Error).message });
  }
};

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const employee = await service.getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee.schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee schedule', error: (error as Error).message });
  }
};

export const updateSchedule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scheduleData = req.body;

    // Validate schedule data
    if (scheduleData.inOfficeDays) {
      try {
        validateDays(scheduleData.inOfficeDays);
      } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
      }
    }

    if (scheduleData.workHours) {
      try {
        validateWorkHours(scheduleData.workHours);
      } catch (error) {
        return res.status(400).json({ message: (error as Error).message });
      }
    }

    const employee = await service.updateEmployee(id, { schedule: scheduleData });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee schedule', error: (error as Error).message });
  }
};

export const getByTeamZone = async (req: Request, res: Response) => {
  try {
    const { teamZone } = req.params;
    const employees = await service.getEmployeesByPreferences({ teamZone });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by team zone', error: (error as Error).message });
  }
};

export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const preferences = req.body;

    // Validate preferences
    if (preferences.deskType && !['sitting', 'standing', 'any'].includes(preferences.deskType)) {
      return res.status(400).json({ message: 'Invalid desk type' });
    }
    if (preferences.locationPreference && !['window', 'quiet', 'collaborative', 'any'].includes(preferences.locationPreference)) {
      return res.status(400).json({ message: 'Invalid location preference' });
    }
    if (preferences.noisePreference && !['quiet', 'moderate', 'any'].includes(preferences.noisePreference)) {
      return res.status(400).json({ message: 'Invalid noise preference' });
    }

    const employee = await service.updateEmployeePreferences(id, preferences);
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee preferences', error: (error as Error).message });
  }
};

export const bulkUpdatePreferences = async (req: Request, res: Response) => {
  try {
    const { employeeIds, preferences } = req.body;

    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
      return res.status(400).json({ message: 'Valid employee IDs array is required' });
    }

    const result = await service.bulkUpdateEmployeePreferences(employeeIds, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error bulk updating employee preferences', error: (error as Error).message });
  }
};

export const getBySchedule = async (req: Request, res: Response) => {
  try {
    const { day, time } = req.params;
    const employees = await service.getEmployeesBySchedule(day, time);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by schedule', error: (error as Error).message });
  }
};

export const getByLocation = async (req: Request, res: Response) => {
  try {
    const location = req.query;
    const employees = await service.getEmployeesByLocation(location as any);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by location', error: (error as Error).message });
  }
};

export const getByFloor = async (req: Request, res: Response) => {
  try {
    const { floor } = req.params;
    const employees = await service.getEmployeesByLocation({ preferredFloor: floor });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by floor', error: (error as Error).message });
  }
};

export const getByAccessibility = async (req: Request, res: Response) => {
  try {
    const { needs } = req.params;
    const accessibilityNeeds = needs === 'true';
    const employees = await service.getEmployeesByAccessibility(accessibilityNeeds);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by accessibility needs', error: (error as Error).message });
  }
};

export const getByDeskRequirements = async (req: Request, res: Response) => {
  try {
    const requirements = req.query;
    const employees = await service.getEmployeesByDeskRequirements(requirements as any);
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees by desk requirements', error: (error as Error).message });
  }
};
