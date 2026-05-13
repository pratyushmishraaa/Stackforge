import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  // Who did it
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName:   { type: String },               // denormalized — survives user deletion

  // What they did
  action:     { type: String, required: true, enum: ['created', 'updated', 'deleted'] },

  // What resource was affected
  resource:   { type: String, required: true, enum: ['org', 'lead', 'deal', 'task', 'user'] },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },

  // Optional: what changed (only on updates)
  changes:    { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────
activitySchema.index({ resource: 1, resourceId: 1, createdAt: -1 }); // fetch log for one record
activitySchema.index({ user: 1, createdAt: -1 });                    // fetch log for one user
activitySchema.index({ createdAt: -1 });                             // global feed

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;
