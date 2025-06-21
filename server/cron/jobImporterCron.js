import cron from 'node-cron';
import { fetchJobsFromFeed } from '../services/jobFetcherService.js';
import { enqueueJobs } from '../jobs/jobProducer.js';
import ImportLog from '../models/ImportLog.js';

// Feed URLs to import from
const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
];

/**
 * Run a single job import cycle.
 * Emits a socket event if `io` is provided.
 */
const runJobImport = async (io = null) => {
  for (const feedUrl of FEED_URLS) {
    try {
      console.log(`⏳ Fetching from ${feedUrl}`);

      const jobs = await fetchJobsFromFeed(feedUrl);

      if (!jobs.length) {
        console.warn(`⚠️ No jobs fetched from ${feedUrl}`);
        continue;
      }

      await enqueueJobs(jobs);

      const importLog = new ImportLog({
        source: feedUrl,
        fileName: new URL(feedUrl).pathname.replace(/\W+/g, '_'),
        totalFetched: jobs.length,
        totalImported: jobs.length,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: [],
      });

      await importLog.save();
      console.log(`✅ Logged import of ${jobs.length} jobs`);

      // 🔁 Emit real-time update via Socket.IO
      if (io) {
        io.emit('import-complete', importLog);
        console.log('📡 Emitted import-complete via Socket.IO');
      }
    } catch (err) {
      console.error(`❌ Failed to process ${feedUrl}: ${err.message}`);
    }
  }
};

/**
 * Start the cron job (runs every hour).
 * @param {import('socket.io').Server} io - optional socket.io instance
 */
export const startCronJob = (io) => {
  cron.schedule('0 * * * *', async () => {
    console.log('⏰ [CRON] Starting hourly import...');
    await runJobImport(io);
  });

  // Optional: run immediately if needed
  if (process.env.RUN_CRON_IMMEDIATELY === 'true') {
    runJobImport(io);
  }
};
