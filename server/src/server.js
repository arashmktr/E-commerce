import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';

const startServer = async () => {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`سرور روی http://localhost:${env.port} اجرا شد`);
  });
};

startServer().catch((error) => {
  console.error('اجرای سرور ناموفق بود:', error.message);
  process.exit(1);
});
