import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    location: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending'
    },
    aiAnalysis: {
      priority: String,
      department: String,
      summary: String,
      response: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Complaint', complaintSchema);