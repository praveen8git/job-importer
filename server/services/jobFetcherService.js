import axios from 'axios';
import xml2js from 'xml2js';

const parser = new xml2js.Parser({ explicitArray: false });

/**
 * Fetch and parse job feed XML from a given URL
 * @param {string} feedUrl
 * @returns {Array} normalized jobs
 */
export const fetchJobsFromFeed = async (feedUrl) => {
  try {
    const { data: xml } = await axios.get(feedUrl);
    const json = await parser.parseStringPromise(xml);

    // Extract and normalize jobs
    const rawJobs = json.rss?.channel?.item || [];

    const jobs = rawJobs.map((item) => ({
      // jobId: item.guid || item.link, // Use guid or link as unique ID
      jobId: typeof item.guid === 'object' ? item.guid._ : item.guid || item.link,
      title: item.title,
      company: item['job:company'] || 'Unknown',
      location: item['job:location'] || '',
      type: item['job:employmentType'] || '',
      category: item['job:category'] || '',
      description: item.description,
      url: item.link,
      source: feedUrl,
      postedAt: item.pubDate ? new Date(item.pubDate) : null,
      updatedAt: new Date(),
    }));

    return jobs;
  } catch (error) {
    console.error(`Failed to fetch jobs from ${feedUrl}:`, error.message);
    return [];
  }
};
