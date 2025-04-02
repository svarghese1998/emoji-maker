import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

interface AdminRequest {
  table: string;
  action: 'select' | 'insert' | 'update' | 'delete';
  data?: Record<string, unknown>;
  match?: Record<string, unknown>;
}

interface SupabaseResponse {
  data: unknown[] | null;
  error: {
    message: string;
    code: string;
  } | null;
}

const ALLOWED_TABLES = ['profiles', 'emojis', 'likes'];

export async function POST(req: Request) {
  try {
    // Verify admin status
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse and validate request
    const body: AdminRequest = await req.json();
    const { table, action, data, match } = body;

    if (!ALLOWED_TABLES.includes(table)) {
      return NextResponse.json(
        { error: `Invalid table: ${table}` },
        { status: 400 }
      );
    }

    // Execute request based on action
    let response: SupabaseResponse;

    switch (action) {
      case 'select':
        response = await supabaseAdmin
          .from(table)
          .select('*')
          .eq(match ? Object.keys(match)[0] : 'id', match ? Object.values(match)[0] : '*');
        break;

      case 'insert':
        if (!data) {
          return NextResponse.json(
            { error: 'Data is required for insert' },
            { status: 400 }
          );
        }
        response = await supabaseAdmin
          .from(table)
          .insert(data)
          .select();
        break;

      case 'update':
        if (!data || !match) {
          return NextResponse.json(
            { error: 'Data and match criteria are required for update' },
            { status: 400 }
          );
        }
        response = await supabaseAdmin
          .from(table)
          .update(data)
          .match(match)
          .select();
        break;

      case 'delete':
        if (!match) {
          return NextResponse.json(
            { error: 'Match criteria is required for delete' },
            { status: 400 }
          );
        }
        response = await supabaseAdmin
          .from(table)
          .delete()
          .match(match)
          .select();
        break;

      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}` },
          { status: 400 }
        );
    }

    if (response.error) {
      throw response.error;
    }

    return NextResponse.json({ data: response.data });
  } catch (error) {
    console.error('Admin operation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 