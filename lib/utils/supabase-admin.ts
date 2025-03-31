import { createClient } from '@supabase/supabase-js';

// Environment variables for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseServiceKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
}

// Create admin client with service role key to bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

// Optional: Add a function to check if admin client is working
export const testAdminConnection = async () => {
  try {
    const { data, error } = await supabaseAdmin.from('emojis').select('count');
    if (error) {
      console.error('Supabase admin connection test failed:', error.message);
      return false;
    } else {
      console.log('Supabase admin connection test successful');
      return true;
    }
  } catch (e) {
    console.error('Failed to test Supabase admin connection:', e);
    return false;
  }
}; 