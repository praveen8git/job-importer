import express from 'express';
import { getImportLogs } from '../controllers/importLogs.controller.js';

const router = express.Router();

router.get('/', getImportLogs); // GET /api/import-logs

export default router;
