import cron from 'node-cron';
import 'dotenv/config.js';
import connectDB from '../config/db.js';
import { fetchJobsFromFeed } from '../services/jobFetcherService.js';
import { enqueueJobs } from '../jobs/jobProducer.js';
import ImportLog from '../models/ImportLog.js';

const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
];

const runJobImport = async () => {
  await connectDB();

  for (const feedUrl of FEED_URLS) {
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
  }
};

// ⏰ Schedule job to run every hour
cron.schedule('0 * * * *', async () => {
  console.log('🔁 Starting hourly job import...');
  await runJobImport();
});

// Optional: run immediately for testing
if (process.env.RUN_CRON_IMMEDIATELY === 'true') {
  runJobImport();
}
