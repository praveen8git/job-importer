import { useEffect, useState, useCallback, useMemo } from 'react';
import { getImportLogs, runImportNow } from '../services/api.js';
import ImportLogTable from '../components/ImportLogTable.jsx';
import { io } from 'socket.io-client';

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  const socket = useMemo(() => io('http://localhost:3000'), []);


  // Fetch logs (memoized)
  const fetchLogs = useCallback(async () => {
    try {
      const res = await getImportLogs();
      setLogs(res.data);
    } catch (err) {
      console.error('❌ Failed to load import logs:', err.message);
    }
  }, []);

  // Trigger fetch on mount
  useEffect(() => {
    fetchLogs().finally(() => setLoading(false));
    
    socket.on('import-complete', (log) => {
    console.log('📡 Real-time update received:', log);
    fetchLogs(); // Refresh logs
  });

  return () => {
    socket.disconnect();
  };

  }, [fetchLogs]);

  // Manual import trigger (memoized)
  const runManualImport = useCallback(async () => {
    setImporting(true);
    try {
      await runImportNow();
      await fetchLogs();
    } catch (err) {
      console.error('❌ Manual import failed:', err.message);
    } finally {
      setImporting(false);
    }
  }, [fetchLogs]);

  // Memoize sorted logs (most recent first)
  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [logs]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Import History</h1>
        <button
          onClick={runManualImport}
          disabled={importing || loading}
          className={`px-4 py-2 text-sm rounded text-white transition ${importing || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          {importing ? 'Importing...' : 'Run Import Now'}
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : sortedLogs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <ImportLogTable logs={sortedLogs} />
      )}
    </div>
  );
};

export default Dashboard;
