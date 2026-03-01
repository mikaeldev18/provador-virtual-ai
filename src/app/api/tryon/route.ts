import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { runVirtualTryOnSafe } from '@/lib/replicate';

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(storeId: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(storeId);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(storeId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false; // max 10 req/min por loja
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { storeId, userPhotoUrl, garmentUrl, productUrl, productName, sessionId } =
      await req.json();

    if (!storeId || !userPhotoUrl || !garmentUrl) {
      return NextResponse.json(
        { error: 'storeId, userPhotoUrl e garmentUrl são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se loja existe e tem assinatura ativa
    const user = await prisma.user.findUnique({
      where: { storeId },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Loja não encontrada' }, { status: 404 });
    }

    if (user.subscription?.status !== 'active') {
      return NextResponse.json(
        { error: 'Plano inativo. Ative sua assinatura no dashboard.' },
        { status: 403 }
      );
    }

    // Rate limiting
    if (!checkRateLimit(storeId)) {
      return NextResponse.json({ error: 'Muitas requisições. Aguarde.' }, { status: 429 });
    }

    // Verifica limite mensal e se deve cobrar extra
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const usesThisMonth = await prisma.usage.count({
      where: { storeId, timestamp: { gte: monthStart } },
    });

    const freeLimit = user.subscription?.freeUsesLimit ?? 100;
    const isExtra = usesThisMonth >= freeLimit;

    // Executa try-on IA
    const { imageUrl, cost } = await runVirtualTryOnSafe({
      userPhotoUrl,
      garmentUrl,
    });

    // Registra uso
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

    return NextResponse.json({
      success: true,
      imageUrl,
      isExtra,
      message: isExtra
        ? 'Uso extra registrado. Será cobrado na próxima fatura.'
        : 'Uso incluído no plano.',
    });
  } catch (error) {
    console.error('TryOn error:', error);
    return NextResponse.json({ error: 'Erro ao processar imagem. Tente novamente.' }, { status: 500 });
  }
}

// Registrar conversão (chamado pelo widget quando cliente clica em comprar)
export async function PATCH(req: NextRequest) {
  try {
    const { sessionId, storeId, revenue } = await req.json();

    if (!sessionId || !storeId) {
      return NextResponse.json({ error: 'sessionId e storeId são obrigatórios' }, { status: 400 });
    }

    // Atualiza o uso mais recente desta sessão
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Conversion track error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
