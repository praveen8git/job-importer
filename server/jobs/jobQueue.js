import dotenv from 'dotenv/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';


const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

export const jobQueue = new Queue(process.env.QUEUE_NAME, {
  connection,
});
