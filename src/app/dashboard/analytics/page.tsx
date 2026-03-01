import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AnalyticsClient from './AnalyticsClient';
import { subDays, format, startOfDay } from 'date-fns';

export const revalidate = 60;

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const since = subDays(new Date(), 30);

  const usages = await prisma.usage.findMany({
    where: { storeId: user.storeId, timestamp: { gte: since } },
    orderBy: { timestamp: 'asc' },
  });

  // Agrupar por dia
  const byDay: Record<string, { usos: number; conversoes: number; receita: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(new Date(), i), 'dd/MM');
    byDay[d] = { usos: 0, conversoes: 0, receita: 0 };
  }

  for (const u of usages) {
    const key = format(new Date(u.timestamp), 'dd/MM');
    if (byDay[key]) {
      byDay[key].usos++;
      if (u.converted) {
        byDay[key].conversoes++;
        byDay[key].receita += u.revenue;
      }
    }
  }

  const chartData = Object.entries(byDay).map(([date, val]) => ({ date, ...val }));

  const totalUsos = usages.length;
  const totalConversoes = usages.filter((u) => u.converted).length;
  const totalReceita = usages.reduce((s, u) => s + u.revenue, 0);
  const totalCusto = usages.reduce((s, u) => s + u.cost, 0);
  const taxaConversao = totalUsos > 0 ? (totalConversoes / totalUsos) * 100 : 0;

  // Top produtos
  const byProduct: Record<string, { name: string; usos: number; conversoes: number }> = {};
  for (const u of usages) {
    const key = u.productUrl || 'desconhecido';
    if (!byProduct[key]) {
      byProduct[key] = { name: u.productName || u.productUrl || 'Produto', usos: 0, conversoes: 0 };
    }
    byProduct[key].usos++;
    if (u.converted) byProduct[key].conversoes++;
  }
  const topProducts = Object.values(byProduct)
    .sort((a, b) => b.usos - a.usos)
    .slice(0, 5);

  return (
    <AnalyticsClient
      chartData={chartData}
      summary={{ totalUsos, totalConversoes, totalReceita, totalCusto, taxaConversao }}
      topProducts={topProducts}
    />
  );
}
