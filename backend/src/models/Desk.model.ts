import mongoose, { Schema, Document } from 'mongoose';

export interface IDesk extends Document {
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

const deskSchema = new Schema<IDesk>({
  deskId: { type: String, required: true, unique: true },
  floor: { type: String, required: true },
  status: {
    type: String,
    enum: ['available', 'assigned', 'maintenance', 'quarantine'],
    default: 'available'
  },
  assignedTo: { type: String },
  coordinates: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  features: {
    deskType: {
      type: String,
      enum: ['sitting', 'standing', 'any'],
      default: 'sitting'
    },
    isAccessible: { type: Boolean, default: false },
    hasDualMonitor: { type: Boolean, default: false },
    isExecutive: { type: Boolean, default: false },
    isVentilated: { type: Boolean, default: false },
    nearHVAC: { type: Boolean, default: false },
    nearEmergencyExit: { type: Boolean, default: false },
    nearWellnessRoom: { type: Boolean, default: false },
    nearQuarantineRoom: { type: Boolean, default: false },
    isEmergencyDesk: { type: Boolean, default: false },
    hasWindow: { type: Boolean, default: false },
    nearHighTraffic: { type: Boolean, default: false },
    teamZone: { type: String },
    noiseLevel: {
      type: String,
      enum: ['quiet', 'moderate', 'high'],
      default: 'moderate'
    }
  },
  lastUsed: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IDesk>('Desk', deskSchema);
