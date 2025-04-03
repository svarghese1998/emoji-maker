import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Create Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Create a function to get an authenticated Supabase client for the current user
export async function getAuthenticatedClient() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('User not authenticated');
  }

  // Create a custom JWT token that Supabase will accept
  const supabaseAccessToken = await createSupabaseToken(userId);

  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`,
      },
    },
  });
}

// Helper function to create a Supabase-compatible JWT token
async function createSupabaseToken(userId: string): Promise<string> {
  // For now, we'll use the service role key directly
  // In production, you should implement proper JWT token generation
  return supabaseServiceRoleKey!;
}

// Export a default client for unauthenticated operations
export const supabase = createClient(supabaseUrl!, supabaseServiceRoleKey!, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
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