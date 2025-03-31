import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';

export async function GET() {
  try {
    // Get the user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all emojis from the database
    const { data: emojis, error } = await supabase
      .from('emojis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emojis:', error);
      return NextResponse.json(
        { error: 'Failed to fetch emojis' },
        { status: 500 }
      );
    }

    return NextResponse.json({ emojis });
  } catch (error) {
    console.error('Error in emoji GET endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 