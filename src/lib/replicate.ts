import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

type ImageInput = string | Blob;

// ─── Async prediction (non-blocking) ──────────────────────────────────────────

export async function createTryOnPrediction(params: {
  userPhotoUrl: ImageInput;
  garmentUrl: ImageInput;
  category?: string;
}): Promise<{ predictionId: string; cost: number }> {
  const prediction = await replicate.predictions.create({
    version: '78ae3c3e3f24a4b1fb96e0d85c88f5e79d27d5048a9ce3c8697bace2da1e7df6',
    input: {
      human_image: params.userPhotoUrl,
      garment_image: params.garmentUrl,
      cloth_type: params.category ?? 'upper_body',
      num_inference_steps: 30,
      guidance_scale: 2.5,
      seed: Math.floor(Math.random() * 1000000),
    },
  });

  return { predictionId: prediction.id, cost: 0.10 };
}

export async function getTryOnStatus(predictionId: string): Promise<{
  status: string;
  imageUrl?: string;
  error?: string;
}> {
  const prediction = await replicate.predictions.get(predictionId);

  if (prediction.status === 'succeeded') {
    const output = prediction.output;
    const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
    return { status: 'succeeded', imageUrl };
  }

  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    return { status: 'failed', error: String(prediction.error ?? 'Falhou') };
  }

  return { status: prediction.status }; // starting | processing
}
