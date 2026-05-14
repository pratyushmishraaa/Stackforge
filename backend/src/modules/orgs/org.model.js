import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema({
  name:      { type: String, required: true, unique: true, trim: true },
  industry:  { type: String, trim: true },
  website:   { type: String, trim: true },
  phone:     { type: String, trim: true },
  isDeleted: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────
// name index is created automatically by unique:true on the field
orgSchema.index({ isDeleted: 1, createdAt: -1 });    // all list queries filter isDeleted
orgSchema.index({ industry: 1 });                    // filter by industry

const Org = mongoose.model('Org', orgSchema);
export default Org;
