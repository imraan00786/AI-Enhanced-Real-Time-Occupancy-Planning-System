import Employee, { IEmployee } from '../models/Employee.model';
import mongoose from 'mongoose';

export const getAllEmployees = () => Employee.find().sort({ createdAt: -1 });

export const getEmployeeById = (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid employee ID format');
  }
  return Employee.findById(id);
};

export const getEmployeeByEmail = (email: string) => Employee.findOne({ email });

export const getEmployeeByEmployeeId = (employeeId: string) => Employee.findOne({ employeeId });

export const createEmployee = async (data: Partial<IEmployee>) => {
  // Check for existing employee with same email or employeeId
  const existingEmployee = await Employee.findOne({
    $or: [
      { email: data.email },
      { employeeId: data.employeeId }
    ]
  });

  if (existingEmployee) {
    throw new Error('Employee with this email or employeeId already exists');
  }

  return Employee.create(data);
};

export const updateEmployee = async (id: string, data: Partial<IEmployee>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid employee ID format');
  }

  // If email or employeeId is being updated, check for duplicates
  if (data.email || data.employeeId) {
    const existingEmployee = await Employee.findOne({
      $and: [
        { _id: { $ne: id } },
        {
          $or: [
            { email: data.email },
            { employeeId: data.employeeId }
          ]
        }
      ]
    });

    if (existingEmployee) {
      throw new Error('Employee with this email or employeeId already exists');
    }
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    throw new Error('Employee not found');
  }

  return updatedEmployee;
};

export const deleteEmployee = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid employee ID format');
  }

  const deletedEmployee = await Employee.findByIdAndDelete(id);
  
  if (!deletedEmployee) {
    throw new Error('Employee not found');
  }

  return deletedEmployee;
};

export const getEmployeesByPreferences = async (preferences: Partial<IEmployee['preferences']>) => {
  const query: any = {};
  
  if (preferences) {
    query.preferences = {};
    
    if (preferences.deskType) {
      query.preferences.deskType = preferences.deskType;
    }
    if (preferences.locationPreference) {
      query.preferences.locationPreference = preferences.locationPreference;
    }
    if (preferences.accessibilityNeeds !== undefined) {
      query.preferences.accessibilityNeeds = preferences.accessibilityNeeds;
    }
    if (preferences.requiresDualMonitor !== undefined) {
      query.preferences.requiresDualMonitor = preferences.requiresDualMonitor;
    }
    if (preferences.preferredFloor) {
      query.preferences.preferredFloor = preferences.preferredFloor;
    }
    if (preferences.teamZone) {
      query.preferences.teamZone = preferences.teamZone;
    }
  }

  return Employee.find(query);
};

export const getEmployeesBySchedule = async (day: string, time?: string) => {
  const query: any = {
    'schedule.inOfficeDays': day.toLowerCase()
  };

  if (time) {
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    
    query['schedule.workHours.start'] = { $lte: time };
    query['schedule.workHours.end'] = { $gte: time };
  }

  return Employee.find(query);
};

export const getEmployeesByAccessibility = async (accessibilityNeeds: boolean) => {
  return Employee.find({
    'preferences.accessibilityNeeds': accessibilityNeeds
  });
};

export const getEmployeesByDeskRequirements = async (requirements: {
  deskType?: 'sitting' | 'standing' | 'any';
  requiresDualMonitor?: boolean;
}) => {
  const query: any = { preferences: {} };

  if (requirements.deskType) {
    query.preferences.deskType = requirements.deskType;
  }
  if (requirements.requiresDualMonitor !== undefined) {
    query.preferences.requiresDualMonitor = requirements.requiresDualMonitor;
  }

  return Employee.find(query);
};

export const getEmployeesByLocation = async (location: {
  preferredFloor?: string;
  teamZone?: string;
  locationPreference?: 'window' | 'quiet' | 'collaborative' | 'any';
}) => {
  const query: any = { preferences: {} };

  if (location.preferredFloor) {
    query.preferences.preferredFloor = location.preferredFloor;
  }
  if (location.teamZone) {
    query.preferences.teamZone = location.teamZone;
  }
  if (location.locationPreference) {
    query.preferences.locationPreference = location.locationPreference;
  }

  return Employee.find(query);
};

export const updateEmployeePreferences = async (id: string, preferences: Partial<IEmployee['preferences']>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid employee ID format');
  }

  const updatedEmployee = await Employee.findByIdAndUpdate(
    id,
    { $set: { preferences } },
    { new: true, runValidators: true }
  );

  if (!updatedEmployee) {
    throw new Error('Employee not found');
  }

  return updatedEmployee;
};

export const bulkUpdateEmployeePreferences = async (
  employeeIds: string[],
  preferences: Partial<IEmployee['preferences']>
) => {
  const validIds = employeeIds.filter(id => mongoose.Types.ObjectId.isValid(id));
  
  if (validIds.length === 0) {
    throw new Error('No valid employee IDs provided');
  }

  const result = await Employee.updateMany(
    { _id: { $in: validIds } },
    { $set: { preferences } }
  );

  return result;
};
