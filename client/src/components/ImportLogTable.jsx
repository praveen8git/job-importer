/* eslint-disable react/prop-types */
const ImportLogTable = ({ logs }) => {
  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-200 font-semibold">
          <tr>
            <th className="px-4 py-2">Timestamp</th>
            <th className="px-4 py-2">Source</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">New</th>
            <th className="px-4 py-2">Updated</th>
            <th className="px-4 py-2">Failed</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log._id} className="border-t">
              <td className="px-4 py-2 text-xs text-gray-600">
                {new Date(log.timestamp).toLocaleString()}
              </td>
              <td className="px-4 py-2">{log.fileName || '-'}</td>
              <td className="px-4 py-2">{log.totalFetched}</td>
              <td className="px-4 py-2">{log.newJobs}</td>
              <td className="px-4 py-2">{log.updatedJobs}</td>
              <td className="px-4 py-2">{log.failedJobs?.length || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImportLogTable;
