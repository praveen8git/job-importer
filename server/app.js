import express from 'express';
import cors from 'cors';
import importLogRoutes from './routes/importLogs.route.js';

const app = express();

app.use(cors());
app.use(express.json());

// Base API route
app.use('/api/import-logs', importLogRoutes);

app.get('/', (req, res) => res.send('🌐 Job Importer API is live'));

export default app;
