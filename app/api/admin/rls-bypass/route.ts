import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { createClient } from '@supabase/supabase-js';

// Define allowed tables for extra security
const ALLOWED_TABLES = ['emojis', 'profiles'] as const;
type AllowedTable = typeof ALLOWED_TABLES[number];

// Define filter types
type EqFilter = [string, string | number | boolean];

interface Filters {
  eq?: EqFilter;
}

interface AdminRequest {
  operation: 'select' | 'insert' | 'update' | 'delete';
  table: AllowedTable;
  data?: Record<string, unknown>;
  filters?: Filters;
}

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
    const { userId } = await auth();
    if (!userId || !process.env.ADMIN_USER_IDS?.split(',').includes(userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get operation details from request
    const body = await req.json();
    
    // Validate table name
    if (!ALLOWED_TABLES.includes(body.table)) {
      return NextResponse.json({ error: 'Invalid table' }, { status: 400 });
    }
    
    const { operation, table, data, filters } = body as AdminRequest;

    // Create Supabase client with service role key
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let result: SupabaseResponse;
    switch (operation) {
      case 'select': {
        let query = supabase
          .from(table)
          .select(data ? Object.keys(data).join(',') : '*');
          
        if (filters?.eq) {
          query = query.eq(filters.eq[0], filters.eq[1]);
        }
        
        result = await query;
        break;
      }
      
      case 'insert': {
        if (!data) {
          return NextResponse.json({ error: 'Data required for insert' }, { status: 400 });
        }
        result = await supabase
          .from(table)
          .insert(data)
          .select();
        break;
      }
      
      case 'update': {
        if (!data) {
          return NextResponse.json({ error: 'Data required for update' }, { status: 400 });
        }
        if (!filters?.eq) {
          return NextResponse.json({ error: 'Filter required for update' }, { status: 400 });
        }
        
        let query = supabase
          .from(table)
          .update(data)
          .eq(filters.eq[0], filters.eq[1]);
        
        result = await query.select();
        break;
      }
      
      case 'delete': {
        if (!filters?.eq) {
          return NextResponse.json({ error: 'Filter required for delete' }, { status: 400 });
        }
        
        let query = supabase
          .from(table)
          .delete()
          .eq(filters.eq[0], filters.eq[1]);
        
        result = await query.select();
        break;
      }
      
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