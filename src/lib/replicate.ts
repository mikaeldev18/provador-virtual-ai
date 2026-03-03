import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export interface TryOnResult {
  imageUrl: string;
  cost: number;
}

// ─── Modelo ──────────────────────────────────────────────────────────────────
const IDM_VTON_VERSION = '0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985';

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

// ─── Categorias ──────────────────────────────────────────────────────────────

export type ClothingCategory = 'upper_body' | 'lower_body' | 'dresses';
export type JewelryCategory = 'necklace' | 'bracelet' | 'earring' | 'ring' | 'watch';
export type ProductType = 'clothing' | 'jewelry';

// ─── Prompt avançado (garment_des do IDM-VTON) ──────────────────────────────
// Quanto mais detalhada e precisa, melhor o resultado.

function buildGarmentDescription(rawName: string, category: ClothingCategory): string {
  const categoryHint: Record<ClothingCategory, string> = {
    upper_body: 'top/blouse/shirt',
    lower_body: 'pants/trousers/shorts',
    dresses:    'dress/jumpsuit',
  };

  const itemName = rawName && rawName !== 'clothing garment'
    ? rawName.replace(/[^\w\s,\-().'/]/g, '').slice(0, 100)
    : categoryHint[category];

  return (
    `Masterpiece, high-fidelity fashion imagery. ` +
    `The garment is: ${itemName}. ` +
    `Render with perfect accuracy to the real product's exact color, fabric curves, and intricate texture, ` +
    `showing realistic textile weight and stitching details. ` +
    `Professional color grading, optimized saturation to make the garment's color vibrant and true-to-life. ` +
    `Ultra-sharp focus on clothing texture, 8k resolution, professional retouching aesthetic.`
  );
}

function buildJewelryDescription(productName: string, category: JewelryCategory): string {
  const jewelryHint: Record<JewelryCategory, string> = {
    necklace:  'elegant necklace',
    bracelet:  'stylish bracelet',
    earring:   'refined earrings',
    ring:      'exquisite ring',
    watch:     'luxury wristwatch',
  };

  const itemDesc = productName
    ? productName.replace(/[^\w\s,\-().'/]/g, '').slice(0, 100)
    : jewelryHint[category];

  return (
    `Ultra-realistic commercial luxury jewelry photography. ` +
    `The jewelry is: ${itemDesc}. ` +
    `Render with perfect accuracy to the real product's exact color, luster, and detailed texture, ` +
    `sitting naturally on the person's skin. ` +
    `Advanced color depth, boosted saturation to enhance metal warmth and gem color. ` +
    `Perfect focus on the jewelry, octane render quality, hyper-realism, 8k resolution.`
  );
}

// ─── IDM-VTON para roupas ────────────────────────────────────────────────────

export async function createClothingTryOn(params: {
  userPhotoUrl: string | Blob;
  garmentUrl: string | Blob;
  garmentDesc?: string;
  category?: ClothingCategory;
}): Promise<{ predictionId: string; cost: number }> {
  const humanImg = await resolveImageUrl(params.userPhotoUrl);
  const garmImg = await resolveImageUrl(params.garmentUrl);

  const category = params.category ?? 'upper_body';
  const garmentDes = buildGarmentDescription(params.garmentDesc || '', category);

  const prediction = await replicate.predictions.create({
    version: IDM_VTON_VERSION,
    input: {
      human_img:    humanImg,
      garm_img:     garmImg,
      garment_des:  garmentDes,
      category,
      crop:         true,
      seed:         42,
      steps:        40,
      force_dc:     category === 'dresses',
    },
  });

  return { predictionId: prediction.id, cost: 0.10 };
}

// ─── IDM-VTON para joias / acessórios ───────────────────────────────────────
// Usa a imagem do produto (joia) como garm_img e category upper_body
// para que o modelo sobreponha a joia na região do tronco/pescoço.

export async function createJewelryTryOn(params: {
  userPhotoUrl: string | Blob;
  garmentUrl: string | Blob;
  productName?: string;
  category?: JewelryCategory;
}): Promise<{ predictionId: string; cost: number }> {
  const humanImg = await resolveImageUrl(params.userPhotoUrl);
  const jewelryImg = await resolveImageUrl(params.garmentUrl);
  const category = params.category ?? 'necklace';

  const garmentDes = buildJewelryDescription(params.productName ?? '', category);

  // Mapeia categoria de joia → categoria IDM-VTON
  const vtonCategory: ClothingCategory =
    category === 'necklace' || category === 'earring'
      ? 'upper_body'
      : category === 'bracelet' || category === 'ring' || category === 'watch'
        ? 'upper_body'
        : 'upper_body';

  const prediction = await replicate.predictions.create({
    version: IDM_VTON_VERSION,
    input: {
      human_img:    humanImg,
      garm_img:     jewelryImg,
      garment_des:  garmentDes,
      category:     vtonCategory,
      crop:         true,
      seed:         42,
      steps:        40,
      force_dc:     false,
    },
  });

  return { predictionId: prediction.id, cost: 0.10 };
}

// ─── Roteador: decide qual fluxo usar ───────────────────────────────────────

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
      garmentUrl:    params.garmentUrl,
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

// ─── Status ──────────────────────────────────────────────────────────────────

export async function getTryOnStatus(predictionId: string): Promise<{
  status: string;
  imageUrl?: string;
  error?: string;
}> {
  const prediction = await replicate.predictions.get(predictionId);

  if (prediction.status === 'succeeded') {
    const output = prediction.output;
    // IDM-VTON retorna string
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
