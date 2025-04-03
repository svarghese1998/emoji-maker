import { getAuthenticatedClient } from './supabase';
import { SupabaseClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs';

interface Bucket {
  name: string;
  [key: string]: any;
}

async function ensureEmojiBucketExists(supabase: SupabaseClient) {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();

    if (listError) throw listError;

    const emojiBucket = buckets?.find((bucket: Bucket) => bucket.name === 'emoji');
    
    if (!emojiBucket) {
      console.log('Emoji bucket not found, creating...');
      const { error: createError } = await supabase
        .storage
        .createBucket('emoji', {
          public: true,
          allowedMimeTypes: ['image/png'],
          fileSizeLimit: 1024 * 1024, // 1MB
        });

      if (createError) throw createError;
      console.log('Emoji bucket created successfully');
    } else {
      console.log('Emoji bucket already exists');
    }
  } catch (error) {
    console.error('Error ensuring emoji bucket exists:', error);
    throw error;
  }
}

async function downloadImage(imageUrl: string): Promise<Blob> {
  let attempts = 3;
  let lastError: Error | null = null;

  while (attempts > 0) {
    try {
      console.log(`Attempting to download image (${attempts} attempts left)`);
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      console.log('Image downloaded successfully');
      return blob;
    } catch (error) {
      attempts--;
      lastError = error as Error;
      if (attempts > 0) {
        console.log(`Download failed, retrying... (${attempts} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error('Failed to download image after all attempts');
}

export async function uploadEmojiToStorage(imageUrl: string, prompt: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const supabase = await getAuthenticatedClient();
    
    // Ensure emoji bucket exists
    await ensureEmojiBucketExists(supabase);
    
    // Download the image from the URL
    const imageBlob = await downloadImage(imageUrl);
    
    // Generate a unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
    
    // Upload to Supabase Storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('emoji')
      .upload(filename, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600',
      });

    if (storageError) {
      throw storageError;
    }

    // Get the public URL
    const { data: publicUrl } = supabase
      .storage
      .from('emoji')
      .getPublicUrl(filename);

    // Save to emojis table
    const { error: dbError } = await supabase
      .from('emojis')
      .insert([
        {
          image_url: publicUrl.publicUrl,
          prompt,
          likes_count: 0,
          creator_user_id: userId,
        },
      ]);

    if (dbError) {
      throw dbError;
    }

    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading emoji:', error);
    throw error;
  }
} 