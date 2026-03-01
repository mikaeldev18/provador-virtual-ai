import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

type ImageInput = string | Blob;

// cuuupid/idm-vton — modelo de virtual try-on funcional no Replicate
const MODEL_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

// ─── Async prediction (non-blocking) ──────────────────────────────────────────

export async function createTryOnPrediction(params: {
  userPhotoUrl: ImageInput;
  garmentUrl: ImageInput;
  garmentDesc?: string;
  category?: 'upper_body' | 'lower_body' | 'dresses';
}): Promise<{ predictionId: string; cost: number }> {
  const prediction = await replicate.predictions.create({
    version: MODEL_VERSION,
    input: {
      human_img: params.userPhotoUrl,
      garm_img: params.garmentUrl,
      garment_des: params.garmentDesc ?? 'roupa',
      category: params.category ?? 'upper_body',
      crop: true,
      seed: Math.floor(Math.random() * 1000000),
      steps: 30,
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
