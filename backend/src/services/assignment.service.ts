import Employee, { IEmployee } from '../models/Employee.model';
import Desk, { IDesk } from '../models/Desk.model';
import { PolicyService } from './policy.service';
import DeskAreaMapping from '../models/DeskAreaMapping.model';
import { Document, Types } from 'mongoose';

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

interface IDeskPreferences {
  location?: string;
  deskType?: 'sitting' | 'standing' | 'any';
  dualMonitors?: boolean;
  accessibility?: boolean;
  noiseLevel?: 'quiet' | 'moderate' | 'high';
  teamZone?: string;
  preferredFloor?: string;
}

export class AssignmentService {
  private policyService: PolicyService;

  constructor() {
    this.policyService = new PolicyService();
  }

  async findOptimalDesk(employee: IEmployeeDocument, date: Date): Promise<IDeskDocument | null> {
    try {
      // Get all available desks
      const availableDesks = await Desk.find({ status: 'available' });

      // Filter desks based on employee preferences and policies
      const suitableDesks = [];
      for (const desk of availableDesks) {
        if (await this.policyService.validateDeskAssignment(desk as IDeskDocument, employee, date)) {
          suitableDesks.push(desk);
        }
      }

      if (suitableDesks.length === 0) {
        return null;
      }

      // Sort desks by preference match score
      const scoredDesks = suitableDesks.map(desk => ({
        desk,
        score: this.calculatePreferenceScore(desk as IDeskDocument, employee)
      }));

      scoredDesks.sort((a, b) => b.score - a.score);

      return scoredDesks[0].desk as IDeskDocument;
    } catch (error) {
      console.error('Error finding optimal desk:', error);
      return null;
    }
  }

  async assignDesk(employeeId: string, deskId: string, date: Date): Promise<boolean> {
    try {
      const [employee, desk] = await Promise.all([
        Employee.findById(employeeId),
        Desk.findById(deskId)
      ]);

      if (!employee || !desk) {
        return false;
      }

      // Validate assignment
      if (!(await this.policyService.validateDeskAssignment(desk as IDeskDocument, employee as IEmployeeDocument, date))) {
        return false;
      }

      // Update desk status
      desk.status = 'assigned';
      desk.assignedTo = employeeId;
      desk.lastUsed = date;
      await desk.save();

      // Update employee assignments
      employee.assignments.push(desk._id as Types.ObjectId);
      await employee.save();

      return true;
    } catch (error) {
      console.error('Error assigning desk:', error);
      return false;
    }
  }

  async releaseDesk(deskId: string): Promise<boolean> {
    try {
      const desk = await Desk.findById(deskId);
      if (!desk) {
        return false;
      }

      // Update desk status
      desk.status = 'available';
      desk.assignedTo = undefined;
      await desk.save();

      // Remove desk from employee's assignments
      await Employee.updateMany(
        { assignments: desk._id },
        { $pull: { assignments: desk._id } }
      );

      return true;
    } catch (error) {
      console.error('Error releasing desk:', error);
      return false;
    }
  }

  async assignDeskByPreferences(employeeId: string, preferences: IDeskPreferences): Promise<{ success: boolean; desk?: IDeskDocument; message?: string }> {
    try {
      const employee = await Employee.findById(employeeId);
      if (!employee) {
        return { success: false, message: 'Employee not found' };
      }

      // Find available desks matching preferences
      const availableDesks = await Desk.find({
        status: 'available',
        ...(preferences.location && { floor: preferences.location }),
        ...(preferences.deskType && { 'features.deskType': preferences.deskType }),
        ...(preferences.dualMonitors && { 'features.hasDualMonitor': true }),
        ...(preferences.accessibility && { 'features.isAccessible': true }),
        ...(preferences.noiseLevel && { 'features.noiseLevel': preferences.noiseLevel }),
        ...(preferences.teamZone && { 'features.teamZone': preferences.teamZone }),
        ...(preferences.preferredFloor && { floor: preferences.preferredFloor })
      });

      if (availableDesks.length === 0) {
        return { success: false, message: 'No suitable desks available' };
      }

      // Score and sort desks by preference match
      const scoredDesks = availableDesks.map(desk => ({
        desk,
        score: this.calculatePreferenceScore(desk as IDeskDocument, employee as IEmployeeDocument)
      }));

      scoredDesks.sort((a, b) => b.score - a.score);
      const selectedDesk = scoredDesks[0].desk;

      // Validate assignment with policy service
      if (!(await this.policyService.validateDeskAssignment(selectedDesk as IDeskDocument, employee as IEmployeeDocument, new Date()))) {
        return { success: false, message: 'Desk assignment violates policy rules' };
      }

      // Update desk status
      selectedDesk.status = 'assigned';
      selectedDesk.assignedTo = employeeId;
      selectedDesk.lastUsed = new Date();
      await selectedDesk.save();

      // Update employee assignments
      employee.assignments.push(selectedDesk._id as Types.ObjectId);
      await employee.save();

      // Create desk area mapping if needed
      if (preferences.location) {
        await DeskAreaMapping.create({
          deskId: selectedDesk.deskId,
          areaId: preferences.location,
          notes: `Assigned to ${employee.name}`
        });
      }

      return { success: true, desk: selectedDesk as IDeskDocument };
    } catch (error) {
      console.error('Error assigning desk by preferences:', error);
      return { success: false, message: 'Error assigning desk' };
    }
  }

  private calculatePreferenceScore(desk: IDeskDocument, employee: IEmployeeDocument): number {
    let score = 0;

    // Desk type preference
    if (desk.features.deskType === employee.preferences.deskType) {
      score += 3;
    }

    // Location preference
    if (employee.preferences.locationPreference === 'window' && desk.features.hasWindow) {
      score += 2;
    }
    if (employee.preferences.locationPreference === 'quiet' && desk.features.noiseLevel === 'quiet') {
      score += 2;
    }
    if (employee.preferences.locationPreference === 'collaborative' && desk.features.nearHighTraffic) {
      score += 2;
    }

    // Team zone preference
    if (desk.features.teamZone === employee.preferences.teamZone) {
      score += 2;
    }

    // Noise preference
    if (employee.preferences.noisePreference === desk.features.noiseLevel) {
      score += 1;
    }

    // Accessibility needs
    if (employee.preferences.accessibilityNeeds && desk.features.isAccessible) {
      score += 3;
    }

    // Dual monitor requirements
    if (employee.preferences.requiresDualMonitor && desk.features.hasDualMonitor) {
      score += 2;
    }

    // Preferred floor
    if (employee.preferences.preferredFloor === desk.floor) {
      score += 1;
    }

    return score;
  }
} 