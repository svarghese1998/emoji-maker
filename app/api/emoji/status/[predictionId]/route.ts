import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import Replicate from 'replicate';

export const runtime = 'edge';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(
  request: Request,
  { params }: { params: { predictionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { predictionId } = params;
    if (!predictionId) {
      return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }

    const prediction = await replicate.predictions.get(predictionId);

    if (prediction.status === "succeeded") {
      const imageUrl = prediction.output?.[0];
      if (!imageUrl || typeof imageUrl !== 'string') {
        throw new Error("Invalid image URL received");
      }

      return NextResponse.json({
        status: 'succeeded',
        image_url: imageUrl
      });
    }

    if (prediction.status === "failed") {
      return NextResponse.json({
        status: 'failed',
        error: prediction.error || 'Image generation failed'
      });
    }

    return NextResponse.json({
      status: prediction.status
    });
  } catch (error) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check prediction status' },
      { status: 500 }
    );
  }
} 