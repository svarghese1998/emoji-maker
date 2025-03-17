import { NextResponse } from 'next/server';
import Replicate from 'replicate';

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error('Missing REPLICATE_API_TOKEN environment variable');
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Creating prediction with prompt:', prompt);

    // Create the prediction
    const prediction = await replicate.predictions.create({
      version: "dee76b5afde21b0f01ed7925f0665b7e879c50ee718c5f78a9d38e04d523cc5e",
      input: {
        prompt: `${prompt}, emoji style, simple background`,
        num_outputs: 1,
        apply_watermark: false,
      },
    });

    console.log('Prediction created:', prediction);

    // Wait for the prediction to complete
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      console.log('Checking prediction status:', result.status);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      result = await replicate.predictions.get(prediction.id);
    }

    console.log('Final prediction result:', result);

    if (result.status === "failed") {
      throw new Error(result.error || "Image generation failed");
    }

    if (!result.output || !Array.isArray(result.output) || !result.output[0]) {
      throw new Error("No output received from the model");
    }

    const imageUrl = result.output[0];
    if (typeof imageUrl !== 'string' || !imageUrl.startsWith('http')) {
      throw new Error("Invalid image URL received from the model");
    }

    return NextResponse.json({ output: [imageUrl] });
  } catch (error) {
    console.error('Error generating emoji:', error);
    const message = error instanceof Error ? error.message : 'Failed to generate emoji';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
} 