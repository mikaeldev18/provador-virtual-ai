'use client';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { Activity, TrendingUp, DollarSign, Cpu } from 'lucide-react';

interface Props {
  chartData: { date: string; usos: number; conversoes: number; receita: number }[];
  summary: {
    totalUsos: number;
    totalConversoes: number;
    totalReceita: number;
    totalCusto: number;
    taxaConversao: number;
  };
  topProducts: { name: string; usos: number; conversoes: number }[];
}

export default function AnalyticsClient({ chartData, summary, topProducts }: Props) {
  const roi = summary.totalCusto > 0
    ? ((summary.totalReceita - summary.totalCusto) / summary.totalCusto) * 100
    : 0;

  const cards = [
    { label: 'Total de usos (30d)', value: summary.totalUsos.toString(), icon: Activity, color: 'text-blue-600 bg-blue-50' },
    { label: 'Taxa de conversão', value: `${summary.taxaConversao.toFixed(1)}%`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Receita gerada', value: summary.totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: DollarSign, color: 'text-purple-600 bg-purple-50' },
    { label: 'Custo IA total', value: summary.totalCusto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), icon: Cpu, color: 'text-orange-600 bg-orange-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Desempenho do provador virtual nos últimos 30 dias</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className={`w-9 h-9 rounded-lg ${c.color} flex items-center justify-center mb-3`}>
              <c.icon className="w-4 h-4" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            <div className="text-xs text-gray-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      {/* ROI */}
      <div className="card bg-gradient-to-r from-brand-50 to-pink-50 border-brand-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-700">ROI estimado (30 dias)</div>
            <div className="text-4xl font-black text-gray-900 mt-1">
              {roi >= 0 ? '+' : ''}{roi.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              (Receita R${summary.totalReceita.toFixed(2)} − Custo R${summary.totalCusto.toFixed(2)}) / Custo
            </div>
          </div>
          <div className="text-5xl">{roi >= 100 ? '🚀' : roi >= 0 ? '📈' : '⚠️'}</div>
        </div>
      </div>

      {/* Area Chart – usos */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Usos diários (30 dias)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradUsos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#db2777" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} />
            <Area type="monotone" dataKey="usos" name="Usos" stroke="#db2777" strokeWidth={2} fill="url(#gradUsos)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart – receita */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Receita diária (R$)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f1f5f9', fontSize: 12 }} formatter={(v: number) => [`R$${Number(v).toFixed(2)}`, 'Receita']} />
            <Bar dataKey="receita" fill="#db2777" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 text-sm mb-4">Top 5 produtos com mais usos</h3>
          <div className="space-y-3">
            {topProducts.map((p, i) => {
              const rate = p.usos > 0 ? (p.conversoes / p.usos) * 100 : 0;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 text-xs text-gray-400 font-bold shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 truncate">{p.name}</div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-brand-500 h-1.5 rounded-full"
                        style={{ width: `${(p.usos / (topProducts[0]?.usos || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold text-gray-900">{p.usos} usos</div>
                    <div className="text-[10px] text-green-600">{rate.toFixed(0)}% conv.</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
