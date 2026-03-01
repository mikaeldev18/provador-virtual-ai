import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, formatDate } from '@/lib/utils';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import {
  Activity, TrendingUp, DollarSign, Zap, AlertCircle, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const revalidate = 60;

async function getDashboardData(storeId: string, userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    usagesThisMonth,
    usagesLastMonth,
    subscription,
    recentUsages,
    payments,
  ] = await Promise.all([
    prisma.usage.findMany({
      where: { storeId, timestamp: { gte: monthStart, lte: monthEnd } },
    }),
    prisma.usage.findMany({
      where: { storeId, timestamp: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    prisma.subscription.findUnique({ where: { userId } }),
    prisma.usage.findMany({
      where: { storeId },
      orderBy: { timestamp: 'desc' },
      take: 8,
    }),
    prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
  ]);

  const totalUsesThisMonth = usagesThisMonth.length;
  const totalUsesLastMonth = usagesLastMonth.length;
  const conversionsThisMonth = usagesThisMonth.filter((u) => u.converted).length;
  const revenueThisMonth = usagesThisMonth.reduce((s, u) => s + u.revenue, 0);
  const extraUses = Math.max(0, totalUsesThisMonth - (subscription?.freeUsesLimit ?? 100));
  const extraCost = extraUses * ((subscription?.extraUseCost ?? 10) / 100);
  const totalCost = (subscription?.priceMonthly ?? 1990) / 100 + extraCost;
  const roi = revenueThisMonth > 0
    ? ((revenueThisMonth - totalCost) / totalCost) * 100
    : 0;
  const conversionRate =
    totalUsesThisMonth > 0 ? (conversionsThisMonth / totalUsesThisMonth) * 100 : 0;

  // Chart data: usos por dia nos últimos 30 dias
  const usagesLast30 = await prisma.usage.findMany({
    where: { storeId, timestamp: { gte: subMonths(now, 1) } },
    orderBy: { timestamp: 'asc' },
  });

  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const key = format(d, 'MM/dd');
    const dayUsages = usagesLast30.filter(
      (u) => format(new Date(u.timestamp), 'MM/dd') === key
    );
    return {
      date: key,
      usos: dayUsages.length,
      conversoes: dayUsages.filter((u) => u.converted).length,
    };
  });

  return {
    totalUsesThisMonth,
    totalUsesLastMonth,
    conversionsThisMonth,
    conversionRate,
    revenueThisMonth,
    extraUses,
    extraCost,
    totalCost,
    roi,
    subscription,
    recentUsages,
    payments,
    chartData,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session!.user as any;

  const data = await getDashboardData(user.storeId, user.id);

  const metrics = [
    {
      label: 'Usos este mês',
      value: data.totalUsesThisMonth.toString(),
      sub: `${data.totalUsesLastMonth} no mês passado`,
      icon: Activity,
      color: 'text-blue-600 bg-blue-50',
      trend: data.totalUsesThisMonth >= data.totalUsesLastMonth ? 'up' : 'down',
    },
    {
      label: 'Taxa de conversão',
      value: `${data.conversionRate.toFixed(1)}%`,
      sub: `${data.conversionsThisMonth} conversões`,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-50',
      trend: 'up',
    },
    {
      label: 'Receita gerada',
      value: data.revenueThisMonth.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      sub: 'Estimativa por conversões',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-50',
      trend: 'up',
    },
    {
      label: 'ROI do mês',
      value: `${data.roi.toFixed(0)}%`,
      sub: `Custo total: ${data.totalCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`,
      icon: Zap,
      color: 'text-orange-600 bg-orange-50',
      trend: data.roi > 0 ? 'up' : 'down',
    },
  ];

  const isInactive = data.subscription?.status !== 'active';
  const freeLimit = data.subscription?.freeUsesLimit ?? 100;
  const usagePercent = Math.min(100, (data.totalUsesThisMonth / freeLimit) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Acompanhe os resultados do seu provador virtual
        </p>
      </div>

      {/* Inactive subscription alert */}
      {isInactive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-800">Plano inativo</p>
            <p className="text-xs text-yellow-700">
              Ative seu plano para liberar o provador virtual na sua loja.
            </p>
          </div>
          <Link href="/dashboard/billing" className="btn-primary text-xs py-2 px-4">
            Ativar plano
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center`}>
                <m.icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  m.trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {m.trend === 'up' ? '↑' : '↓'}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
            <div className="text-xs text-gray-500 mt-1">{m.label}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Usage bar + billing */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Usage progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Usos do mês</h3>
            <span className="text-xs text-gray-500">
              {data.totalUsesThisMonth} / {freeLimit} inclusos
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
            <div
              className="bg-brand-500 h-2.5 rounded-full transition-all"
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{usagePercent.toFixed(0)}% utilizado</span>
            <span>
              {data.extraUses > 0 ? (
                <span className="text-orange-600 font-medium">
                  {data.extraUses} extras × R$0,10 = {data.extraCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
              ) : (
                <span className="text-green-600">{freeLimit - data.totalUsesThisMonth} restantes</span>
              )}
            </span>
          </div>
        </div>

        {/* Plan summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 text-sm">Plano Básico</h3>
            <Link href="/dashboard/billing" className="text-xs text-brand-600 hover:underline">
              Ver detalhes
            </Link>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Usos inclusos</span>
              <span>{freeLimit} / mês</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Usos este mês</span>
              <span>{data.totalUsesThisMonth}</span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900">
              <span>Restantes</span>
              <span className={data.extraUses > 0 ? 'text-orange-600' : 'text-green-600'}>
                {Math.max(0, freeLimit - data.totalUsesThisMonth)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts data={data.chartData} />

      {/* Recent usages */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Usos recentes</h3>
        {data.recentUsages.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-gray-400">Nenhum uso ainda.</p>
            <Link href="/dashboard/embed" className="text-xs text-brand-600 hover:underline mt-1 block">
              Instale o widget na sua loja →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                  <th className="pb-2 font-medium">Data</th>
                  <th className="pb-2 font-medium">Produto</th>
                  <th className="pb-2 font-medium">Converteu?</th>
                  <th className="pb-2 font-medium">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentUsages.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="py-2.5 text-gray-500 text-xs">
                      {formatDate(u.timestamp)}
                    </td>
                    <td className="py-2.5 text-gray-700 max-w-[200px] truncate text-xs">
                      {u.productName || u.productUrl || '–'}
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`badge ${
                          u.converted
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {u.converted ? 'Sim' : 'Não'}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-700 font-medium text-xs">
                      {u.revenue > 0
                        ? u.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                        : '–'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
