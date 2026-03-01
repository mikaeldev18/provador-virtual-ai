import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

type ImageInput = string | Blob;

/**
 * Virtual Try-On usando Replicate
 * Modelo: levihsu/cat-vton (CatVTON)
 */
export async function runVirtualTryOn(params: {
  userPhotoUrl: ImageInput;
  garmentUrl: ImageInput;
  category?: 'upper_body' | 'lower_body' | 'dresses';
}): Promise<TryOnResult> {
  const output = await replicate.run(
    'levihsu/cat-vton:78ae3c3e3f24a4b1fb96e0d85c88f5e79d27d5048a9ce3c8697bace2da1e7df6',
    {
      input: {
        human_image: params.userPhotoUrl,
        garment_image: params.garmentUrl,
        cloth_type: params.category ?? 'upper_body',
        num_inference_steps: 30,
        guidance_scale: 2.5,
        seed: Math.floor(Math.random() * 1000000),
      },
    }
  );

  const imageUrl = Array.isArray(output) ? String(output[0]) : String(output);
  const cost = 0.10;

  return { imageUrl, cost };
}

/**
 * Fallback: retorna simulação se Replicate não estiver configurado
 */
export async function runVirtualTryOnSafe(params: {
  userPhotoUrl: ImageInput;
  garmentUrl: ImageInput;
  category?: 'upper_body' | 'lower_body' | 'dresses';
}): Promise<TryOnResult> {
  if (!process.env.REPLICATE_API_TOKEN) {
    const fallback = typeof params.userPhotoUrl === 'string'
      ? params.userPhotoUrl
      : 'https://placehold.co/400x600?text=IA+indisponivel';
    return { imageUrl: fallback, cost: 0.10 };
  }
  return runVirtualTryOn(params);
}
