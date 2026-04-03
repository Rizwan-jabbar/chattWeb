
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import router from './routes/router.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { initializeVoiceCallSocket } from './socket/voiceCallSocket.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const allowedOrigins = (
  process.env.FRONTEND_URLS ||
  'https://chatt-web.vercel.app,http://localhost:5173,http://localhost:4173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(router);
app.use('/api', router);
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Chat API is running' });
});

const io = new Server(server, {
  cors: corsOptions,
});

initializeVoiceCallSocket(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
