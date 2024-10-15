import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Director', 'Deputy Director', 'Senior Manager', 'Team Member'], required: true },
  department: { type: String, enum: ['B2B', 'B2C'] },
  unit: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);