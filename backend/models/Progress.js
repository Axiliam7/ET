import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
      unique: true,
      trim: true,
    },
    learnerState: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    // Automatically manages createdAt and updatedAt
    timestamps: true,
  }
);

const Progress = mongoose.model('Progress', progressSchema);

export default Progress;
