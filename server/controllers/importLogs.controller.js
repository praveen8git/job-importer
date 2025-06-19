import ImportLog from '../models/ImportLog.js';

export const getImportLogs = async (req, res) => {
  try {
    const logs = await ImportLog.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(logs);
  } catch (err) {
    console.error('❌ Failed to fetch import logs:', err.message);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};
