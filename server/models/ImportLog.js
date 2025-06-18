import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  source: String, // URL of the feed
  fileName: String, // you can derive this from feed URL or input
  totalFetched: Number,
  totalImported: Number,
  newJobs: Number,
  updatedJobs: Number,
  failedJobs: [
    {
      jobId: String,
      reason: String,
    }
  ]
}, { timestamps: true });

export default mongoose.model('ImportLog', importLogSchema);
