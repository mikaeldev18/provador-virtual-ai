import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number; // custo estimado em reais
}

/**
 * Virtual Try-On usando Replicate
 * Modelo: levihsu/cat-vton (CatVTON - state-of-the-art virtual try-on)
 */
export async function runVirtualTryOn(params: {
  userPhotoUrl: string;
  garmentUrl: string;
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

  // Custo estimado: ~$0.02 USD por chamada ≈ R$0.10 (cotação 5.0)
  const cost = 0.10;

  return { imageUrl, cost };
}

/**
 * Fallback: retorna simulação se Replicate não estiver configurado
 */
export async function runVirtualTryOnSafe(params: {
  userPhotoUrl: string;
  garmentUrl: string;
  category?: 'upper_body' | 'lower_body' | 'dresses';
}): Promise<TryOnResult> {
  if (!process.env.REPLICATE_API_TOKEN) {
    // Mock para desenvolvimento
    return {
      imageUrl: params.userPhotoUrl,
      cost: 0.10,
    };
  }
  return runVirtualTryOn(params);
}
