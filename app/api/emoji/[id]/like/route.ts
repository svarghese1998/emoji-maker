import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const emojiId = params.id;
    if (!emojiId) {
      return NextResponse.json({ error: 'Emoji ID is required' }, { status: 400 });
    }

    // Get the current emoji to check its like status
    const { data: emoji, error: getError } = await supabase
      .from('emojis')
      .select('likes_count')
      .eq('id', emojiId)
      .single();

    if (getError) {
      throw getError;
    }

    // Toggle the like by updating likes_count
    const { data: updatedEmoji, error: updateError } = await supabase
      .from('emojis')
      .update({ 
        likes_count: (emoji.likes_count || 0) + 1
      })
      .eq('id', emojiId)
      .select('id, likes_count')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      id: emojiId,
      likes_count: updatedEmoji.likes_count
    });
  } catch (error) {
    console.error('Error toggling emoji like:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to toggle like' },
      { status: 500 }
    );
  }
} 