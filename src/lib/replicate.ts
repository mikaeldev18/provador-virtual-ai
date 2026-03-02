import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

// cuuupid/idm-vton — modelo de virtual try-on ativo no Replicate
const MODEL_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

// ─── Upload explícito para o Replicate Files API ───────────────────────────────
// Evita problemas com upload implícito de Blob no ambiente serverless.
async function uploadBlobToReplicate(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('content', blob, 'photo.jpg');

  const res = await fetch('https://api.replicate.com/v1/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate file upload failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.urls.get as string;
}

// ─── Async prediction (non-blocking) ──────────────────────────────────────────

export async function createTryOnPrediction(params: {
  userPhotoUrl: string | Blob;
  garmentUrl: string | Blob;
  garmentDesc?: string;
  category?: 'upper_body' | 'lower_body' | 'dresses';
}): Promise<{ predictionId: string; cost: number }> {
  // Resolve Blobs para URLs hospedadas no Replicate
  const humanImg = params.userPhotoUrl instanceof Blob
    ? await uploadBlobToReplicate(params.userPhotoUrl)
    : params.userPhotoUrl;

  const garmImg = params.garmentUrl instanceof Blob
    ? await uploadBlobToReplicate(params.garmentUrl)
    : params.garmentUrl;

  const prediction = await replicate.predictions.create({
    version: MODEL_VERSION,
    input: {
      human_img:    humanImg,
      garm_img:     garmImg,
      garment_des:  params.garmentDesc ?? 'roupa',
      category:     params.category ?? 'upper_body',
      crop:         true,
      seed:         Math.floor(Math.random() * 1000000),
      steps:        30,
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
