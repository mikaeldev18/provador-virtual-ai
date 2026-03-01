import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createExtraUsagePayment } from '@/lib/abacatepay';
import { startOfMonth } from 'date-fns';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const user = session.user as any;

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true },
    });

    if (!dbUser) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const monthStart = startOfMonth(new Date());
    const usesThisMonth = await prisma.usage.count({
      where: { storeId: dbUser.storeId, timestamp: { gte: monthStart } },
    });

    const freeLimit = dbUser.subscription?.freeUsesLimit ?? 100;
    const extraUses = Math.max(0, usesThisMonth - freeLimit);
    const extraCostPerUse = dbUser.subscription?.extraUseCost ?? 10; // centavos
    const totalCents = extraUses * extraCostPerUse;

    if (extraUses === 0) {
      return NextResponse.json({ error: 'Nenhum uso extra para cobrar' }, { status: 400 });
    }

    const billing = await createExtraUsagePayment({
      userId: dbUser.id,
      userName: dbUser.name,
      userEmail: dbUser.email,
      extraUsages: extraUses,
      amountCents: totalCents,
    });

    await prisma.payment.create({
      data: {
        userId: dbUser.id,
        amount: totalCents,
        status: 'pending',
        abacatePayId: billing.id,
        type: 'extra_usage',
        description: `${extraUses} usos extras`,
      },
    });

    return NextResponse.json({ checkoutUrl: billing.url, extraUses, totalCents });
  } catch (error) {
    console.error('Pay extras error:', error);
    return NextResponse.json({ error: 'Erro ao criar link de pagamento' }, { status: 500 });
  }
}
