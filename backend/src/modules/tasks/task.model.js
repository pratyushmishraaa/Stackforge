import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  dueDate:    { type: Date, required: true },
  priority:   { type: String, enum: ['low','medium','high'], default: 'medium' },
  status:     { type: String, enum: ['open','in_progress','done'], default: 'open' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lead:       { type: mongoose.Schema.Types.ObjectId, ref: 'Lead' },
  deal:       { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' },
  isDeleted:  { type: Boolean, default: false },
}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────
taskSchema.index({ isDeleted: 1, createdAt: -1 });   // every list query
taskSchema.index({ assignedTo: 1, isDeleted: 1 });   // "my tasks" filter (?assignedTo=me)
taskSchema.index({ status: 1, isDeleted: 1 });       // filter by status
taskSchema.index({ dueDate: 1, isDeleted: 1 });      // reminder queries (due in next 24h)
taskSchema.index({ lead: 1 });                       // tasks linked to a lead
taskSchema.index({ deal: 1 });                       // tasks linked to a deal

const Task = mongoose.model('Task', taskSchema);
export default Task;
