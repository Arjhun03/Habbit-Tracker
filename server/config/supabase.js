import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const readEnv = (...names) => {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }
  return undefined;
};

const supabaseUrl =
  readEnv('SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL');

const supabaseKey =
  readEnv(
    'SUPABASE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
    'VITE_SUPABASE_PUBLISHABLE_KEY'
  );

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'WARNING: Supabase URL or publishable key is missing. Check server/.env.'
  );
}

export const supabaseConfig = {
  url: supabaseUrl,
  projectRef: readEnv('SUPABASE_PROJECT_REF') || 'wdwhkfxvjjszziwrhqcd',
  keyPreview: supabaseKey
    ? `${supabaseKey.slice(0, 18)}...${supabaseKey.slice(-6)}`
    : null,
};

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
