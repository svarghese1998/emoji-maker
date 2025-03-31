import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';

export async function GET() {
  try {
    // 1. Test Clerk Auth
    console.log('Testing Clerk auth...');
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized - No userId from Clerk',
        step: 'auth'
      }, { status: 401 });
    }
    console.log('Auth successful, userId:', userId);

    // 2. Test Supabase Connection
    console.log('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.from('emojis').select('count');
      if (error) {
        return NextResponse.json({ 
          error: 'Supabase connection failed',
          details: error.message,
          step: 'connection'
        }, { status: 500 });
      }
      console.log('Supabase connection successful');
    } catch (e) {
      return NextResponse.json({ 
        error: 'Supabase connection error',
        details: e instanceof Error ? e.message : 'Unknown error',
        step: 'connection'
      }, { status: 500 });
    }

    // 3. Get Emojis
    console.log('Fetching emojis...');
    const { data: emojis, error: emojisError } = await supabase
      .from('emojis')
      .select(`
        id,
        image_url,
        prompt,
        likes_count,
        creator_user_id,
        created_at
      `);

    if (emojisError) {
      return NextResponse.json({ 
        error: 'Failed to fetch emojis',
        details: emojisError.message,
        step: 'emojis'
      }, { status: 500 });
    }
    console.log('Emojis fetched:', emojis?.length || 0, 'records');

    // 4. Test Storage Access
    console.log('Testing storage access...');
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('emoji')
      .list();

    if (storageError) {
      return NextResponse.json({ 
        error: 'Failed to access storage',
        details: storageError.message,
        step: 'storage'
      }, { status: 500 });
    }
    console.log('Storage access successful:', storageData?.length || 0, 'files');

    // 5. Get User Profile
    console.log('Fetching user profile...');
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json({ 
        error: 'Failed to fetch profile',
        details: profileError.message,
        step: 'profile'
      }, { status: 500 });
    }
    console.log('Profile fetch result:', userProfile ? 'found' : 'not found');

    // Return successful response
    return NextResponse.json({
      status: 'success',
      emojis: {
        count: emojis?.length || 0,
        data: emojis
      },
      storage: {
        count: storageData?.length || 0,
        files: storageData
      },
      userProfile,
      debug: {
        userId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Detailed error in test endpoint:', error);
    return NextResponse.json({
      error: 'Test endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 