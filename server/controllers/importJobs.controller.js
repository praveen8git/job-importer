import { fetchJobsFromFeed } from '../services/jobFetcherService.js';
import { enqueueJobs } from '../jobs/jobProducer.js';
import ImportLog from '../models/ImportLog.js';

const FEED_URLS = [
  'https://jobicy.com/?feed=job_feed&job_categories=data-science',
  'https://jobicy.com/?feed=job_feed&job_categories=design-multimedia',
];

export const triggerImportNow = async (req, res) => {
  try {
    const logs = [];

    for (const feedUrl of FEED_URLS) {
      const jobs = await fetchJobsFromFeed(feedUrl);
      if (!jobs.length) continue;

      await enqueueJobs(jobs);

      const log = new ImportLog({
        source: feedUrl,
        fileName: new URL(feedUrl).pathname.replace(/\W+/g, '_'),
        totalFetched: jobs.length,
        totalImported: jobs.length,
        newJobs: 0,
        updatedJobs: 0,
        failedJobs: [],
      });

      await log.save();

      const io = req.app.get('io');
      if (io) {
        io.emit('import-complete', log);
      }
      
      logs.push(log);
    }

    res.status(200).json({ message: 'Import triggered', logs });
  } catch (err) {
    console.error('❌ Manual import error:', err.message);
    res.status(500).json({ error: 'Failed to import jobs' });
  }
};
