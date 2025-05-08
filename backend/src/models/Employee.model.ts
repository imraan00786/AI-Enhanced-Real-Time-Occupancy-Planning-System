import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployee extends Document {
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
  assignments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const employeeSchema = new Schema<IEmployee>({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  isExecutive: { type: Boolean, default: false },
  preferences: {
    deskType: {
      type: String,
      enum: ['sitting', 'standing', 'any'],
      default: 'any'
    },
    locationPreference: {
      type: String,
      enum: ['window', 'quiet', 'collaborative', 'any'],
      default: 'any'
    },
    accessibilityNeeds: { type: Boolean, default: false },
    requiresDualMonitor: { type: Boolean, default: false },
    preferredFloor: { type: String },
    noisePreference: {
      type: String,
      enum: ['quiet', 'moderate', 'any'],
      default: 'any'
    },
    teamZone: { type: String },
    preferredDays: [{ type: String }]
  },
  schedule: {
    inOfficeDays: [{ type: String }],
    workHours: {
      start: { type: String, required: true },
      end: { type: String, required: true }
    }
  },
  assignments: [{ type: Schema.Types.ObjectId, ref: 'Desk' }]
}, {
  timestamps: true
});

export default mongoose.model<IEmployee>('Employee', employeeSchema);
