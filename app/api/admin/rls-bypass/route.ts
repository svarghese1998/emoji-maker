import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// List of admin user IDs that are allowed to bypass RLS
// In a production app, this should be stored securely, not hardcoded
const ADMIN_USER_IDS = process.env.ADMIN_USER_IDS ? 
  process.env.ADMIN_USER_IDS.split(',') : 
  [];

// Define filter types
type EqFilter = [string, string | number | boolean];

interface Filters {
  eq?: EqFilter;
}

interface AdminRequest {
  operation: 'select' | 'insert' | 'update' | 'delete';
  table: string;
  data?: any;
  filters?: Filters;
}

// Define proper types for the response data
type SupabaseResponse = {
  data: unknown;
  error: null | {
    message: string;
    code: string;
  };
};

/**
 * Handler for admin operations that need to bypass RLS
 */
export async function POST(req: Request) {
  try {
    // Check if user is authenticated and is an admin
    const { userId } = auth();
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get operation details from request
    const { operation, table, data, filters } = await req.json() as AdminRequest;

    // Create Supabase client with service role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let result: SupabaseResponse;
    switch (operation) {
      case 'select':
        {
          let query = supabase
            .from(table)
            .select(data || '*');
            
          if (filters?.eq) {
            query = query.eq(filters.eq[0], filters.eq[1]);
          }
          
          result = await query;
        }
        break;
      
      case 'insert':
        result = await supabase
          .from(table)
          .insert(data)
          .select();
        break;
      
      case 'update':
        {
          let query = supabase
            .from(table)
            .update(data);
            
          if (filters?.eq) {
            query = query.eq(filters.eq[0], filters.eq[1]);
          }
          
          result = await query.select();
        }
        break;
      
      case 'delete':
        {
          let query = supabase
            .from(table)
            .delete();
            
          if (filters?.eq) {
            query = query.eq(filters.eq[0], filters.eq[1]);
          }
          
          result = await query.select();
        }
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid operation' }, { status: 400 });
    }

    if (result.error) {
      throw new Error(`Admin operation failed: ${result.error.message}`);
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in admin RLS bypass:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Admin operation failed' },
      { status: 500 }
    );
  }
} 