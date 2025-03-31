import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function ensureEmojiBucketExists() {
  try {
    // Check if bucket exists - use admin client for storage operations
    const { data: buckets, error: listError } = await supabaseClient
      .storage
      .listBuckets();

    if (listError) throw listError;

    const emojiBucket = buckets?.find(bucket => bucket.name === 'emoji');
    
    if (!emojiBucket) {
      console.log('Emoji bucket not found, creating...');
      const { data, error: createError } = await supabaseClient
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

    // Upload to Supabase Storage
    const fileName = `${userId}/${Date.now()}.png`;
    const { error } = await supabaseClient.storage
      .from('emojis')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        cacheControl: '3600'
      });

    if (error) {
      throw error;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabaseClient.storage
      .from('emojis')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading emoji:', error);
    throw error;
  }
} 