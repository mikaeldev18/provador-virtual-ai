import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import BillingClient from './BillingClient';
import { startOfMonth, endOfMonth } from 'date-fns';

export const revalidate = 60;

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [subscription, usagesThisMonth, payments, dbUser] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: user.id } }),
    prisma.usage.findMany({
      where: { storeId: user.storeId, timestamp: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.payment.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.user.findUnique({ where: { id: user.id } }),
  ]);

  const totalUses = usagesThisMonth.length;
  const freeLimit = subscription?.freeUsesLimit ?? 100;
  const extraUses = Math.max(0, totalUses - freeLimit);
  const extraCost = extraUses * ((subscription?.extraUseCost ?? 10) / 100);
  const planCost = (subscription?.priceMonthly ?? 1990) / 100;

  return (
    <BillingClient
      subscription={{
        status: subscription?.status ?? 'inactive',
        plan: subscription?.plan ?? 'basic',
        currentPeriodEnd: subscription?.currentPeriodEnd?.toISOString() ?? null,
      }}
      billing={{
        planCost,
        extraUses,
        extraCost,
        totalCost: planCost + extraCost,
        totalUses,
        freeLimit,
      }}
      payments={payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        status: p.status,
        type: p.type,
        description: p.description ?? '',
        createdAt: p.createdAt.toISOString(),
        paidAt: p.paidAt?.toISOString() ?? null,
      }))}
      user={{ name: dbUser?.name ?? '', email: dbUser?.email ?? '' }}
    />
  );
}
