import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSubscription } from '@/lib/abacatepay';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });

  const user = session.user as any;

  try {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });

    const billing = await createSubscription({
      userId: dbUser.id,
      userName: dbUser.name,
      userEmail: dbUser.email,
      returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?activated=pending`,
    });

    // Registrar pagamento pendente
    await prisma.payment.create({
      data: {
        userId: dbUser.id,
        amount: 1990,
        status: 'pending',
        abacatePayId: billing.id,
        type: 'subscription',
        description: 'Plano Básico – Ativação',
      },
    });

await prisma.subscription.upsert({
  where: { userId: dbUser.id },
  update: { abacatePayBillId: billing.id },
  create: {
    userId: dbUser.id,
    abacatePayBillId: billing.id,
    status: 'pending',
    plan: 'basic',
    priceMonthly: 1990,
    freeUsesLimit: 100,
    extraUseCost: 10,
  },
});

    return NextResponse.json({ checkoutUrl: billing.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Erro ao criar link de pagamento' }, { status: 500 });
  }
}
