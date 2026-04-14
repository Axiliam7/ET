import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
