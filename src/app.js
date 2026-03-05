import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import adsRouter from './routes/ads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(join(__dirname, '..', 'public')));

app.use('/api/ads', adsRouter);

const isDev = process.env.NODE_ENV !== 'production';

app.use((err, req, res, _next) => {
  console.error(err);
  const payload = { error: err.message };
  if (isDev) {
    payload.stack = err.stack;
    payload.cause = err.cause ?? null;
    payload.code = err.code ?? null;
    payload.errno = err.errno ?? null;
    payload.sqlState = err.sqlState ?? null;
    payload.sqlMessage = err.sqlMessage ?? null;
  }
  res.status(err.status || 500).json(payload);
});

export default app;
