import { supabase } from './supabase';
import { supabaseAdmin } from './supabase-admin';

async function ensureEmojiBucketExists() {
  try {
    // Check if bucket exists - use admin client for storage operations
    const { data: buckets, error: listError } = await supabaseAdmin
      .storage
      .listBuckets();

    if (listError) throw listError;

    const emojiBucket = buckets?.find(bucket => bucket.name === 'emoji');
    
    if (!emojiBucket) {
      console.log('Emoji bucket not found, creating...');
      const { data, error: createError } = await supabaseAdmin
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

export async function uploadEmojiToStorage(
  imageUrl: string,
  userId: string
): Promise<string> {
  try {
    // First ensure the bucket exists
    await ensureEmojiBucketExists();

    // Download the image
    console.log('Downloading image from:', imageUrl);
    const imageBlob = await downloadImage(imageUrl);

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `${userId}-${timestamp}.png`;
    console.log('Generated filename:', filename);

    // Upload to Supabase storage with retries
    let uploadAttempts = 3;
    let uploadError: Error | null = null;

    while (uploadAttempts > 0) {
      try {
        // Use admin client for storage operations
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('emoji')
          .upload(filename, imageBlob, {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;
        
        console.log('Upload successful:', uploadData);

        // Get the public URL
        const { data: { publicUrl } } = supabaseAdmin
          .storage
          .from('emoji')
          .getPublicUrl(filename);

        console.log('Generated public URL:', publicUrl);
        return publicUrl;
      } catch (error) {
        uploadAttempts--;
        uploadError = error as Error;
        if (uploadAttempts > 0) {
          console.log(`Upload failed, retrying... (${uploadAttempts} attempts left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    throw uploadError || new Error('Failed to upload image after all attempts');
  } catch (error) {
    console.error('Error in uploadEmojiToStorage:', error);
    throw error;
  }
} 