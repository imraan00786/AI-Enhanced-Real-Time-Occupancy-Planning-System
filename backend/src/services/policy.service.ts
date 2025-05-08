import Desk from '../models/Desk.model';
import Employee from '../models/Employee.model';
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

export class PolicyService {
  async validateDeskAssignment(desk: IDeskDocument, employee: IEmployeeDocument, date: Date): Promise<boolean> {
    // Check executive desk policy
    if (desk.features.isExecutive && !employee.isExecutive) {
      return false;
    }

    // Check accessibility requirements
    if (employee.preferences.accessibilityNeeds && !desk.features.isAccessible) {
      return false;
    }

    // Check dual monitor requirements
    if (employee.preferences.requiresDualMonitor && !desk.features.hasDualMonitor) {
      return false;
    }

    // Check social distancing
    if (!(await this.checkSocialDistancing(desk))) {
      return false;
    }

    // Check floor occupancy
    if (!(await this.checkFloorOccupancy(desk.floor))) {
      return false;
    }

    // Check consecutive days
    if (!(await this.checkConsecutiveDays(desk, employee))) {
      return false;
    }

    // Check sanitization period
    if (!this.checkSanitizationPeriod(desk)) {
      return false;
    }

    // Check emergency desk availability
    if (!this.checkEmergencyDeskAvailability(desk)) {
      return false;
    }

    return true;
  }

  private async checkSocialDistancing(desk: IDeskDocument): Promise<boolean> {
    // Get nearby desks
    const nearbyDesks = await Desk.find({
      'coordinates.x': { $gte: desk.coordinates.x - 6, $lte: desk.coordinates.x + 6 },
      'coordinates.y': { $gte: desk.coordinates.y - 6, $lte: desk.coordinates.y + 6 },
      status: 'assigned'
    });

    return nearbyDesks.length === 0;
  }

  private async checkFloorOccupancy(floor: string): Promise<boolean> {
    const [totalDesks, occupiedDesks] = await Promise.all([
      Desk.countDocuments({ floor }),
      Desk.countDocuments({ floor, status: 'assigned' })
    ]);

    return (occupiedDesks / totalDesks) <= 0.8; // 80% occupancy limit
  }

  private async checkConsecutiveDays(desk: IDeskDocument, employee: IEmployeeDocument): Promise<boolean> {
    const employeeAssignments = await Desk.find({
      assignedTo: employee._id,
      status: 'assigned'
    }).sort({ lastUsed: -1 }).limit(2);

    if (employeeAssignments.length < 2) {
      return true;
    }

    const lastAssignment = employeeAssignments[0];
    const secondLastAssignment = employeeAssignments[1];

    if (!lastAssignment.lastUsed || !secondLastAssignment.lastUsed) {
      return true;
    }

    // Check if the last two assignments were on consecutive days
    const lastDate = new Date(lastAssignment.lastUsed);
    const secondLastDate = new Date(secondLastAssignment.lastUsed);
    const diffDays = Math.abs(lastDate.getTime() - secondLastDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays > 1;
  }

  private checkSanitizationPeriod(desk: IDeskDocument): boolean {
    if (!desk.lastUsed) {
      return true;
    }

    const lastUsed = new Date(desk.lastUsed);
    const now = new Date();
    const hoursSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60);

    return hoursSinceLastUse >= 12; // 12-hour sanitization period
  }

  private checkEmergencyDeskAvailability(desk: IDeskDocument): boolean {
    // Check if the desk is marked as an emergency desk
    if (desk.features.isEmergencyDesk) {
      return false; // Emergency desks should not be assigned
    }

    // Check if the desk is near emergency exits
    if (desk.features.nearEmergencyExit) {
      return false; // Desks near emergency exits should not be assigned
    }

    return true;
  }
} 