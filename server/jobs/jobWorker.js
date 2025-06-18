import 'dotenv/config';
import connectDB from '../config/db.js';
import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import Job from '../models/Job.js';

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

const startWorker = async () => {
  await connectDB();

  const jobWorker = new Worker(
    process.env.QUEUE_NAME,
    async (job) => {
      const data = job.data;

      try {
        const result = await Job.updateOne(
          { jobId: data.jobId },
          { $set: data },
          { upsert: true }
        );

        return {
          status: result.upserted ? 'created' : 'updated',
          jobId: data.jobId,
        };
      } catch (err) {
        console.error(`❌ Failed to insert job ${data.jobId}: ${err.message}`);
        throw new Error(err.message);
      }
    },
    {
      connection,
      concurrency: parseInt(process.env.MAX_CONCURRENCY || '5'),
    }
  );

  jobWorker.on('completed', (job, result) => {
    console.log(`✅ Job ${result.jobId} ${result.status}`);
  });

  jobWorker.on('failed', (job, err) => {
    console.error(`❌ Job ${job?.data?.jobId} failed:`, err.message);
  });

  console.log('🚀 Worker is ready and listening for jobs...');
};

startWorker();
