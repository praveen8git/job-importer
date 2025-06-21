import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import importLogRoutes from './routes/importLogs.route.js';
import importJobRoutes from './routes/importJobs.route.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// API route
app.use('/api/import-logs', importLogRoutes);
app.use('/api/import-jobs', importJobRoutes);

app.get('/', (req, res) => res.send('🌐 Job Importer API is live'));

export default app;
