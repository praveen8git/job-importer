import { fetchJobsFromFeed } from '../services/jobFetcherService.js';

const TEST_FEED = 'https://jobicy.com/?feed=job_feed';

const run = async () => {
  const jobs = await fetchJobsFromFeed(TEST_FEED);
  console.log(`Fetched ${jobs.length} jobs`);
  console.log(jobs[0]); // show one
};

run();
