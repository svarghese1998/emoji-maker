import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { supabase } from '@/lib/utils/supabase';
import { uploadEmojiToStorage } from '@/lib/utils/emoji-storage';
import Replicate from 'replicate';

export const maxDuration = 300; // Set max duration to 300 seconds (5 minutes)
export const runtime = 'nodejs'; // Changed from edge to nodejs for compatibility with replicate package

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    // 1. Check authentication
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check if user exists in profiles and has enough credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, user_id')
      .eq('user_id', userId)
      .single();

    // If user doesn't exist in profiles, create them
    if (profileError?.code === 'PGRST116') {
      const { error: createError } = await supabase
        .from('profiles')
        .insert([{ user_id: userId }])
        .select()
        .single();

      if (createError) {
        throw new Error('Failed to create user profile');
      }
    } else if (profileError) {
      throw profileError;
    }

    // Check credits
    if (profile && profile.credits < 1) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 400 });
    }

    // 3. Get prompt and generate image
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Starting image generation with prompt:', prompt);
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        prompt: `${prompt}, emoji style, simple background`,
        num_outputs: 1,
        apply_watermark: false,
      },
    });

    // 4. Wait for generation to complete with exponential backoff
    let result = prediction;
    let attempts = 0;
    const maxAttempts = 15; // Reduced from 30
    let delay = 1000; // Start with 1 second delay

    while (result.status !== "succeeded" && result.status !== "failed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, delay));
      result = await replicate.predictions.get(prediction.id);
      attempts++;
      console.log(`Checking generation status (attempt ${attempts}): ${result.status}`);
      
      // Exponential backoff with max of 4 seconds
      delay = Math.min(delay * 1.5, 4000);
    }

    if (result.status === "failed") {
      throw new Error("Image generation failed");
    }

    if (attempts >= maxAttempts) {
      // Return the prediction ID so the client can continue polling
      return NextResponse.json({ 
        status: 'pending',
        predictionId: prediction.id
      }, { status: 202 });
    }

    const imageUrl = result.output?.[0];
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error("Invalid image URL received");
    }

    console.log('Image generated successfully:', imageUrl);

    // 5. Upload to Supabase storage and get public URL
    const publicUrl = await uploadEmojiToStorage(imageUrl, prompt);

    // 6. Save to emojis table with exact schema types
    const { data: emojiData, error: emojiError } = await supabase
      .from('emojis')
      .insert({
        image_url: publicUrl,
        prompt,
        creator_user_id: userId,
        likes_count: 0,
        created_at: new Date().toISOString()
      })
      .select('id, image_url, prompt, likes_count, creator_user_id, created_at')
      .single();

    if (emojiError) {
      console.error('Error saving emoji:', emojiError);
      throw new Error("Failed to save emoji data");
    }

    // 7. Deduct credit
    const { error: creditError } = await supabase
      .from('profiles')
      .update({ 
        credits: profile ? profile.credits - 1 : 2,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (creditError) {
      console.error('Error updating credits:', creditError);
    }

    return NextResponse.json({
      ...emojiData,
      creditsRemaining: profile ? profile.credits - 1 : 2
    });
  } catch (error) {
    console.error('Error generating emoji:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate emoji' },
      { status: 500 }
    );
  }
} 