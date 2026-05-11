import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title:      { type: String, required: true, trim: true },
  value:      { type: Number, required: true },
  stage:      { type: String, enum: ['prospecting','proposal','negotiation','won','lost'], default: 'prospecting' },
  lead:       { type: mongoose.Schema.Types.ObjectId, ref: 'Lead', required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closedAt:   { type: Date },
  isDeleted:  { type: Boolean, default: false },
}, { timestamps: true });

dealSchema.pre('save', function () {
  if (['won', 'lost'].includes(this.stage) && !this.closedAt) {
    this.closedAt = Date.now();
  }
});

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
