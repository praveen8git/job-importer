import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  jobId: { type: String, required: true, unique: true }, // extracted unique ID from source
  title: String,
  company: String,
  location: String,
  type: String,
  category: String,
  description: String,
  url: String,
  source: String, // jobicy / higheredjobs, etc.
  postedAt: Date,
  updatedAt: Date
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
