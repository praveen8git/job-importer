import express from 'express';
import { triggerImportNow } from '../controllers/importJobs.controller.js';

const router = express.Router();

router.post('/', triggerImportNow); // POST /api/import-jobs

export default router;
