import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true, trim: true },
  industry:  { type: String, trim: true },
  website:   { type: String, trim: true },
  phone:     { type: String, trim: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Org = mongoose.model('Org', orgSchema);
export default Org;
