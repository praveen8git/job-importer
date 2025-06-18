import 'dotenv/config';
import connectDB from '../config/db.js';
import { fetchJobsFromFeed } from '../services/jobFetcherService.js';
import { enqueueJobs } from '../jobs/jobProducer.js';
import ImportLog from '../models/ImportLog.js';

const feedUrl = 'https://jobicy.com/?feed=job_feed&job_categories=data-science';

const run = async () => {
  try {
    await connectDB(); // ✅ Ensure MongoDB is connected

    console.log(`📥 Fetching jobs from: ${feedUrl}`);
    const jobs = await fetchJobsFromFeed(feedUrl);

    if (!jobs.length) {
      console.warn('⚠️ No jobs fetched. Skipping import.');
      return;
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

    console.log(`✅ Import log created for ${jobs.length} jobs.`);
  } catch (err) {
    console.error('❌ Import failed:', err.message);
  }
};

run();
