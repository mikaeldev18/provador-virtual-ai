import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createTryOnPrediction, getTryOnStatus } from '@/lib/replicate';

// ─── CORS headers (widget roda em domínios externos como Shopify) ─────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(storeId: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(storeId);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(storeId, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

// ─── Converte base64 data URL para Blob ───────────────────────────────────────
function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg';
  const binary = Buffer.from(base64, 'base64');
  return new Blob([binary], { type: mime });
}

function isDataUrl(str: string): boolean {
  return str.startsWith('data:');
}

// ─── GET: consulta status de uma predição ─────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const predictionId = searchParams.get('id');

  if (!predictionId) {
    return NextResponse.json(
      { error: 'id é obrigatório' },
      { status: 400, headers: CORS }
    );
  }

  try {
    const result = await getTryOnStatus(predictionId);
    return NextResponse.json(result, { headers: CORS });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { status: 'failed', error: 'Erro ao verificar status' },
      { headers: CORS }
    );
  }
}

// ─── POST: inicia geração (retorna imediatamente com predictionId) ─────────────
export async function POST(req: NextRequest) {
  try {
    const { storeId, userPhotoUrl, garmentUrl, productUrl, productName, sessionId } =
      await req.json();

    if (!storeId || !userPhotoUrl || !garmentUrl) {
      return NextResponse.json(
        { error: 'storeId, userPhotoUrl e garmentUrl são obrigatórios' },
        { status: 400, headers: CORS }
      );
    }

    // Verifica se loja existe e tem assinatura ativa
    const user = await prisma.user.findUnique({
      where: { storeId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404, headers: CORS });
    }

    if (user.subscription?.status !== 'active') {
      return NextResponse.json(
        { error: 'Plano inativo. Ative sua assinatura no dashboard.' },
        { status: 403, headers: CORS }
      );
    }

    // Rate limiting
    if (!checkRateLimit(storeId)) {
      return NextResponse.json(
        { error: 'Muitas requisições. Aguarde.' },
        { status: 429, headers: CORS }
      );
    }

    // Verifica limite mensal
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const usesThisMonth = await prisma.usage.count({
      where: { storeId, timestamp: { gte: monthStart } },
    });

    const freeLimit = user.subscription?.freeUsesLimit ?? 100;
    const isExtra = usesThisMonth >= freeLimit;

    // Converte base64 → Blob se necessário
    const userPhoto = isDataUrl(userPhotoUrl) ? dataUrlToBlob(userPhotoUrl) : userPhotoUrl;
    const garment  = isDataUrl(garmentUrl)   ? dataUrlToBlob(garmentUrl)   : garmentUrl;

    // Cria predição de forma assíncrona (não bloqueia a função)
    const { predictionId, cost } = await createTryOnPrediction({
      userPhotoUrl: userPhoto,
      garmentUrl:   garment,
      garmentDesc:  productName ?? 'roupa',
    });

    // Registra uso (com custo estimado)
    await prisma.usage.create({
      data: {
        storeId,
        sessionId,
        productUrl,
        productName,
        cost,
        billedExtra: isExtra,
      },
    });

    return NextResponse.json(
      { success: true, predictionId, isExtra },
      { headers: CORS }
    );
  } catch (error) {
    console.error('TryOn error:', error);
    return NextResponse.json(
      { error: 'Erro ao iniciar geração. Tente novamente.' },
      { status: 500, headers: CORS }
    );
  }
}

// ─── PATCH: registrar conversão ───────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    const { sessionId, storeId, revenue } = await req.json();

    if (!sessionId || !storeId) {
      return NextResponse.json(
        { error: 'sessionId e storeId são obrigatórios' },
        { status: 400, headers: CORS }
      );
    }

    const usage = await prisma.usage.findFirst({
      where: { storeId, sessionId },
      orderBy: { timestamp: 'desc' },
    });

    if (usage) {
      await prisma.usage.update({
        where: { id: usage.id },
        data: { converted: true, revenue: revenue ?? 0 },
      });
    }

    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (error) {
    console.error('Conversion track error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500, headers: CORS });
  }
}
