import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

// ─── Modelos ──────────────────────────────────────────────────────────────────
const IDM_VTON_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';
const FLUX_FILL_VERSION = 'a053f84125613d83e65328a289e14eb6639e10725c243e8fb0c24128e5573f4c';

// ─── Upload explícito para o Replicate Files API ─────────────────────────────
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

async function resolveImageUrl(img: string | Blob): Promise<string> {
  return img instanceof Blob ? await uploadBlobToReplicate(img) : img;
}

// ─── Roupas: IDM-VTON (virtual try-on dedicado) ─────────────────────────────

export type ClothingCategory = 'upper_body' | 'lower_body' | 'dresses';

export async function createClothingTryOn(params: {
  userPhotoUrl: string | Blob;
  garmentUrl: string | Blob;
  garmentDesc?: string;
  category?: ClothingCategory;
}): Promise<{ predictionId: string; cost: number }> {
  const humanImg = await resolveImageUrl(params.userPhotoUrl);
  const garmImg = await resolveImageUrl(params.garmentUrl);

  const category = params.category ?? 'upper_body';

  const prediction = await replicate.predictions.create({
    version: IDM_VTON_VERSION,
    input: {
      human_img:    humanImg,
      garm_img:     garmImg,
      garment_des:  params.garmentDesc || 'clothing garment, high quality',
      category,
      crop:         true,
      seed:         42,
      steps:        40,
      force_dc:     category === 'dresses',
    },
  });

  return { predictionId: prediction.id, cost: 0.10 };
}

// ─── Joias / Acessórios: FLUX Fill Dev (inpainting) ─────────────────────────

export type JewelryCategory = 'necklace' | 'bracelet' | 'earring' | 'ring' | 'watch';

// Gera uma máscara SVG inline (branco = área de inpainting)
function buildJewelryMaskSvg(category: JewelryCategory): string {
  // A máscara define a área onde o modelo vai "pintar" a joia
  const regions: Record<JewelryCategory, string> = {
    necklace:  '<ellipse cx="50%" cy="32%" rx="28%" ry="14%" fill="white"/>',
    bracelet:  '<ellipse cx="18%" cy="68%" rx="12%" ry="8%" fill="white"/><ellipse cx="82%" cy="68%" rx="12%" ry="8%" fill="white"/>',
    earring:   '<ellipse cx="28%" cy="22%" rx="6%" ry="10%" fill="white"/><ellipse cx="72%" cy="22%" rx="6%" ry="10%" fill="white"/>',
    ring:      '<ellipse cx="18%" cy="72%" rx="8%" ry="6%" fill="white"/><ellipse cx="82%" cy="72%" rx="8%" ry="6%" fill="white"/>',
    watch:     '<ellipse cx="16%" cy="65%" rx="10%" ry="8%" fill="white"/>',
  };

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 1024">` +
    `<rect width="100%" height="100%" fill="black"/>` +
    regions[category] +
    `</svg>`
  )}`;
}

function buildJewelryPrompt(productName: string, category: JewelryCategory): string {
  const base: Record<JewelryCategory, string> = {
    necklace:  'wearing an elegant necklace',
    bracelet:  'wearing a bracelet on the wrist',
    earring:   'wearing beautiful earrings',
    ring:      'wearing a ring on the finger',
    watch:     'wearing a wristwatch',
  };

  const desc = productName
    ? `${base[category]}, ${productName}, `
    : `${base[category]}, `;

  return `photorealistic portrait of a person ${desc}jewelry product photography, natural lighting, high detail, 8k`;
}

export async function createJewelryTryOn(params: {
  userPhotoUrl: string | Blob;
  productName?: string;
  category?: JewelryCategory;
}): Promise<{ predictionId: string; cost: number }> {
  const humanImg = await resolveImageUrl(params.userPhotoUrl);
  const category = params.category ?? 'necklace';

  const prediction = await replicate.predictions.create({
    version: FLUX_FILL_VERSION,
    input: {
      image:     humanImg,
      mask:      buildJewelryMaskSvg(category),
      prompt:    buildJewelryPrompt(params.productName ?? '', category),
      guidance:  30,
      num_inference_steps: 35,
      output_format: 'jpg',
      output_quality: 90,
    },
  });

  return { predictionId: prediction.id, cost: 0.06 };
}

// ─── Roteador: decide qual modelo usar ───────────────────────────────────────

export type ProductType = 'clothing' | 'jewelry';

export async function createTryOnPrediction(params: {
  userPhotoUrl: string | Blob;
  garmentUrl: string | Blob;
  garmentDesc?: string;
  productType?: ProductType;
  category?: string;
}): Promise<{ predictionId: string; cost: number }> {
  const type = params.productType ?? 'clothing';

  if (type === 'jewelry') {
    return createJewelryTryOn({
      userPhotoUrl:  params.userPhotoUrl,
      productName:   params.garmentDesc,
      category:      (params.category as JewelryCategory) ?? 'necklace',
    });
  }

  return createClothingTryOn({
    userPhotoUrl:  params.userPhotoUrl,
    garmentUrl:    params.garmentUrl,
    garmentDesc:   params.garmentDesc,
    category:      (params.category as ClothingCategory) ?? 'upper_body',
  });
}

// ─── Status (funciona para ambos os modelos) ─────────────────────────────────

export async function getTryOnStatus(predictionId: string): Promise<{
  status: string;
  imageUrl?: string;
  error?: string;
}> {
  const prediction = await replicate.predictions.get(predictionId);

  if (prediction.status === 'succeeded') {
    const output = prediction.output;
    // IDM-VTON retorna string, FLUX Fill retorna array
    let imageUrl: string;
    if (Array.isArray(output)) {
      imageUrl = String(output[0]);
    } else if (typeof output === 'string') {
      imageUrl = output;
    } else {
      imageUrl = String(output);
    }
    return { status: 'succeeded', imageUrl };
  }

  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    return { status: 'failed', error: String(prediction.error ?? 'Falhou') };
  }

  return { status: prediction.status }; // starting | processing
}
