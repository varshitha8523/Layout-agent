import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chatRoute from './routes/chat.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));
app.use('/api/chat', chatRoute);
app.get('/health', (_, res) => res.json({ status: 'ok' }));

// Serve frontend
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Layout Agent server running on http://localhost:${PORT}`);
});