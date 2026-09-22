import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  DATABASE_URL: process.env.DATABASE_URL || 'file:./dev.db',
  JWT_SECRET: process.env.JWT_SECRET || 'sih1392_ecocycle_super_secret_jwt_key_2026',
  NODE_ENV: process.env.NODE_ENV || 'development',
  AI_DEMO_MODE: process.env.AI_DEMO_MODE !== 'false',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  ALLOWED_ORIGINS: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ],
};
