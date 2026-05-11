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

const Task = mongoose.model('Task', taskSchema);
export default Task;
