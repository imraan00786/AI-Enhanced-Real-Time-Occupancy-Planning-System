import mongoose, { Schema, Document } from 'mongoose';

export interface IPolicyRule extends Document {
  name: string;
  description: string;
  type: 'hard' | 'soft';
  ruleCode: string; // can be used to apply logic in code
  active: boolean;
}

const PolicyRuleSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['hard', 'soft'], default: 'hard' },
  ruleCode: { type: String, required: true },
  active: { type: Boolean, default: true },
});

export default mongoose.model<IPolicyRule>('PolicyRule', PolicyRuleSchema);
