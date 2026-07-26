import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { supabase, supabaseConfig } from './config/supabase.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);

// Root route health check
app.get('/', (req, res) => {
  res.json({ message: 'Habit Tracker API is running...' });
});

app.get('/api/health/supabase', async (req, res) => {
  const { error } = await supabase.from('users').select('id').limit(1);

  if (!error) {
    return res.json({
      connected: true,
      projectRef: supabaseConfig.projectRef,
      keyPreview: supabaseConfig.keyPreview,
      message: 'Supabase is connected and the required users table exists.',
    });
  }

  const tableMissing = error.code === 'PGRST205' || error.code === '42P01';
  return res.status(tableMissing ? 424 : 502).json({
    connected: !/invalid api key/i.test(error.message),
    projectRef: supabaseConfig.projectRef,
    keyPreview: supabaseConfig.keyPreview,
    code: error.code,
    message: tableMissing
      ? 'Supabase key is valid, but the required public.users table has not been created yet. Run supabase/migrations/20260725151500_create_habitflow_tables.sql in Supabase SQL Editor.'
      : error.message,
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
