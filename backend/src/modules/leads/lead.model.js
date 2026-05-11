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

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
