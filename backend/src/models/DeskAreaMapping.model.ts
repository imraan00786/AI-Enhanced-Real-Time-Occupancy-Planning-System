import mongoose, { Schema, Document } from 'mongoose';

export interface IDeskAreaMapping extends Document {
  deskId: string;
  areaId: string;
  notes?: string;
}

const DeskAreaMappingSchema: Schema = new Schema({
  deskId: { type: String, required: true },
  areaId: { type: String, required: true },
  notes: { type: String },
});

export default mongoose.model<IDeskAreaMapping>('DeskAreaMapping', DeskAreaMappingSchema);
