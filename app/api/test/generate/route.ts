import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';
import { uploadEmojiToStorage } from '@/lib/utils/emoji-storage';

export async function POST(req: Request) {
  try {
    // 1. Test auth
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        step: 'auth'
      }, { status: 401 });
    }

    // 2. Test profile creation/retrieval
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      return NextResponse.json({
        error: 'Failed to check profile',
        details: profileError.message,
        step: 'profile_check'
      }, { status: 500 });
    }

    if (!profile) {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (createError) {
        return NextResponse.json({
          error: 'Failed to create profile',
          details: createError.message,
          step: 'profile_create'
        }, { status: 500 });
      }
    }

    // 3. Test storage upload
    const testImageUrl = 'https://placekitten.com/200/200'; // Test image URL
    try {
      const publicUrl = await uploadEmojiToStorage(testImageUrl, userId);
      
      // 4. Test database insert
      const { data: emojiData, error: emojiError } = await supabase
        .from('emojis')
        .insert({
          image_url: publicUrl,
          prompt: 'Test emoji',
          creator_user_id: userId,
          likes_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (emojiError) {
        return NextResponse.json({
          error: 'Failed to save emoji',
          details: emojiError.message,
          step: 'database_insert'
        }, { status: 500 });
      }

      // 5. Verify the saved data
      const { data: verifyData, error: verifyError } = await supabase
        .from('emojis')
        .select('*')
        .eq('id', emojiData.id)
        .single();

      if (verifyError) {
        return NextResponse.json({
          error: 'Failed to verify saved data',
          details: verifyError.message,
          step: 'verification'
        }, { status: 500 });
      }

      return NextResponse.json({
        status: 'success',
        steps: {
          auth: 'passed',
          profile: profile ? 'existed' : 'created',
          storage: 'uploaded',
          database: 'inserted',
          verification: 'passed'
        },
        data: verifyData
      });

    } catch (storageError) {
      return NextResponse.json({
        error: 'Failed to upload to storage',
        details: storageError instanceof Error ? storageError.message : 'Unknown error',
        step: 'storage_upload'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Test failed:', error);
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 