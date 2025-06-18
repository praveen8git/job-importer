import { jobQueue } from './jobQueue.js';

/**
 * Enqueues an array of job objects to BullMQ queue
 * @param {Array} jobs - array of normalized job objects
 */
export const enqueueJobs = async (jobs) => {
  const enqueuePromises = jobs.map((job) =>
    jobQueue.add('import-job', job, {
      removeOnComplete: true,
      removeOnFail: false,
    })
  );

  await Promise.all(enqueuePromises);
  console.log(`${jobs.length} jobs enqueued`);
};
