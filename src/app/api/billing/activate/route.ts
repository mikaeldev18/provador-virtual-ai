import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 30);

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
  });

  return NextResponse.json({ success: true });
}
