import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  const isDev = process.env.NODE_ENV !== 'production';
  console.log(`Servidor rodando em http://localhost:${PORT} [${isDev ? 'dev' : 'prod'}]`);
});
