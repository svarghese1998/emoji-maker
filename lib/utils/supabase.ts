import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with additional options
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Since we're using Clerk for auth
    autoRefreshToken: false,
  },
  db: {
    schema: 'public'
  }
});

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase.from('emojis').select('count');
    if (error) {
      console.error('Supabase connection test failed:', error.message);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (e) {
    console.error('Failed to test Supabase connection:', e);
  }
})(); 