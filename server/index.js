import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { Server } from 'socket.io';
import http from 'http';
import { startCronJob } from './cron/jobImporterCron.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);

    //setup socket.io server
    const io = new Server(server, {
      cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
      }
    });

    app.set('io', io);

    io.on('connection', (socket) => {
      console.log('📡 New client connected');
      socket.on('disconnect', () => console.log('🔌 Client disconnected'));
    });

    //run crom
    startCronJob(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server start error:', err.message);
    process.exit(1);
  }
};

startServer();
