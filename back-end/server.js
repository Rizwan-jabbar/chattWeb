// server.js / index.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/db.js';
import router from './routes/router.js';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { initializeVoiceCallSocket } from './socket/voiceCallSocket.js';

dotenv.config();

// Connect MongoDB
await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if running on Vercel
const isVercel = process.env.VERCEL === '1';

// Create HTTP server
const server = http.createServer(app);

// --------------------
// ✅ CORS Middleware (UPDATED)
// --------------------

// Env URLs (optional)
const allowedOrigins = (
  process.env.FRONTEND_URLS || 'http://localhost:5173'
)
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

// 🔥 SMART ORIGIN CHECK (IMPORTANT)
const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  // Allow localhost
  if (origin.includes('localhost')) return true;

  // Allow all Vercel deployments (IMPORTANT FIX)
  if (origin.includes('vercel.app')) return true;

  // Allow custom env URLs
  if (allowedOrigins.includes(origin)) return true;

  return false;
};

// Apply CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// --------------------
// ✅ Body Parser
// --------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// ✅ Static uploads
// --------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --------------------
// ✅ API routes
// --------------------
app.use('/api', router);

// Root route
app.get('/', (_req, res) => {
  res.status(200).json({ message: 'Chat API is running' });
});

// --------------------
// ✅ Socket.IO (local only)
// --------------------
if (!isVercel) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  initializeVoiceCallSocket(io);

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// --------------------
// ✅ Export for Vercel
// --------------------
export default app;