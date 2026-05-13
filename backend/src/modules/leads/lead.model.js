import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  email:        { type: String, trim: true, lowercase: true },
  phone:        { type: String, trim: true },
  status:       { type: String, enum: ['new','contacted','qualified','lost','converted'], default: 'new' },
  source:       { type: String, enum: ['manual','web','referral','import'], default: 'manual' },
  organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Org' },
  assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted:    { type: Boolean, default: false },
}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────
leadSchema.index({ isDeleted: 1, createdAt: -1 });   // every list query
leadSchema.index({ assignedTo: 1, isDeleted: 1 });   // "my leads" filter
leadSchema.index({ status: 1, isDeleted: 1 });       // filter by status
leadSchema.index({ organisation: 1 });               // leads by org
leadSchema.index({ email: 1 });                      // lookup by email

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
