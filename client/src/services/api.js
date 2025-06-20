import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const getImportLogs = () => API.get('/import-logs');
export const runImportNow = () => API.post('/import-jobs');
