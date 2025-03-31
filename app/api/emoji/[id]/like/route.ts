import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const { userId } = await auth();
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

    // Get the request body to check if we're liking or unliking
    const { action } = await request.json();
    
    // Update the likes count based on the action
    const newLikesCount = action === 'like' 
      ? (emoji.likes_count || 0) + 1 
      : Math.max((emoji.likes_count || 0) - 1, 0); // Ensure we don't go below 0

    // Update the emoji with new likes count
    const { data: updatedEmoji, error: updateError } = await supabase
      .from('emojis')
      .update({ 
        likes_count: newLikesCount
      })
      .eq('id', emojiId)
      .select('id, likes_count')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      id: emojiId,
      likes_count: updatedEmoji.likes_count,
      isLiked: action === 'like'
    });
  } catch (error) {
    console.error('Error toggling emoji like:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to toggle like' },
      { status: 500 }
    );
  }
} 