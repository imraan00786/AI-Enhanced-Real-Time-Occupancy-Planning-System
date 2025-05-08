import { Request, Response } from 'express';
import { AssignmentService } from '../services/assignment.service';
import Employee, { IEmployee } from '../models/Employee.model';
import Desk, { IDesk } from '../models/Desk.model';
import { Document, Types } from 'mongoose';

interface IEmployeeDocument extends Document {
  _id: Types.ObjectId;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  isExecutive: boolean;
  preferences: {
    deskType: 'sitting' | 'standing' | 'any';
    locationPreference: 'window' | 'quiet' | 'collaborative' | 'any';
    accessibilityNeeds: boolean;
    requiresDualMonitor: boolean;
    preferredFloor?: string;
    noisePreference: 'quiet' | 'moderate' | 'any';
    teamZone?: string;
    preferredDays: string[];
  };
  schedule: {
    inOfficeDays: string[];
    workHours: {
      start: string;
      end: string;
    };
  };
  assignments: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

interface IDeskDocument extends Document {
  _id: Types.ObjectId;
  deskId: string;
  floor: string;
  status: 'available' | 'assigned' | 'maintenance' | 'quarantine';
  assignedTo?: string;
  coordinates: {
    x: number;
    y: number;
  };
  features: {
    deskType: 'sitting' | 'standing' | 'any';
    isAccessible: boolean;
    hasDualMonitor: boolean;
    isExecutive: boolean;
    isVentilated: boolean;
    nearHVAC: boolean;
    nearEmergencyExit: boolean;
    nearWellnessRoom: boolean;
    nearQuarantineRoom: boolean;
    isEmergencyDesk: boolean;
    hasWindow: boolean;
    nearHighTraffic: boolean;
    teamZone?: string;
    noiseLevel: 'quiet' | 'moderate' | 'high';
  };
  lastUsed?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class AssignmentController {
  private assignmentService: AssignmentService;

  constructor() {
    this.assignmentService = new AssignmentService();
  }

  async findOptimalDesk(req: Request, res: Response) {
    try {
      const { employeeId, date } = req.body;
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      const desk = await this.assignmentService.findOptimalDesk(employee as IEmployeeDocument, new Date(date));
      if (!desk) {
        return res.status(404).json({ message: 'No suitable desk found' });
      }

      res.json(desk);
    } catch (error) {
      res.status(500).json({ message: 'Error finding optimal desk', error });
    }
  }

  async assignDesk(req: Request, res: Response) {
    try {
      const { employeeId, deskId, date } = req.body;
      const success = await this.assignmentService.assignDesk(employeeId, deskId, new Date(date));
      
      if (!success) {
        return res.status(400).json({ message: 'Failed to assign desk' });
      }

      res.json({ message: 'Desk assigned successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning desk', error });
    }
  }

  async releaseDesk(req: Request, res: Response) {
    try {
      const { deskId } = req.params;
      const success = await this.assignmentService.releaseDesk(deskId);
      
      if (!success) {
        return res.status(400).json({ message: 'Failed to release desk' });
      }

      res.json({ message: 'Desk released successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error releasing desk', error });
    }
  }

  async getEmployeeAssignments(req: Request, res: Response) {
    try {
      const { employeeId } = req.params;
      const employee = await Employee.findById(employeeId).populate('assignments');
      
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(employee.assignments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employee assignments', error });
    }
  }

  async getDeskAssignment(req: Request, res: Response) {
    try {
      const { deskId } = req.params;
      const desk = await Desk.findById(deskId);
      
      if (!desk) {
        return res.status(404).json({ message: 'Desk not found' });
      }

      if (desk.status !== 'assigned') {
        return res.json({ status: desk.status, assignedTo: null });
      }

      const employee = await Employee.findOne({ assignments: desk._id });
      res.json({
        status: desk.status,
        assignedTo: employee ? {
          employeeId: employee.employeeId,
          name: employee.name,
          email: employee.email
        } : null
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching desk assignment', error });
    }
  }

  async assignDeskByPreferences(req: Request, res: Response) {
    try {
      const { employeeId, preferences } = req.body;
      
      const result = await this.assignmentService.assignDeskByPreferences(employeeId, preferences);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.status(200).json({
        message: 'Desk assigned successfully',
        deskId: result.desk?.deskId,
        floor: result.desk?.floor,
        features: result.desk?.features
      });
    } catch (error) {
      res.status(500).json({ message: 'Error assigning desk', error });
    }
  }
} 