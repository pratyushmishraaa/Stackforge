import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ADMIN, MANAGER, AGENT } from '../../constants/roles.js';
import { ACCOUNT_STATUS } from '../../constants/status.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type:      String,
      required:  [true, 'Name is required.'],
      trim:      true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required.'],
      unique:    true,
      lowercase: true,
      trim:      true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required.'],
      minlength: 8,
      select:    false,
    },
    role: {
      type:    String,
      enum:    [ADMIN, MANAGER, AGENT],
      default: AGENT,
    },
    status: {
      type:    String,
      enum:    Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

export default User;
