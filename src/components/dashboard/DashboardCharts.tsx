'use client';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

interface ChartPoint {
  date: string;
  usos: number;
  conversoes: number;
}

export default function DashboardCharts({ data }: { data: ChartPoint[] }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Usos e conversões (30 dias)</h3>
          <p className="text-xs text-gray-400 mt-0.5">Evolução diária de usos do provador</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full bg-brand-500" />
            Usos
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full bg-green-500" />
            Conversões
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUsos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#db2777" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#db2777" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConversoes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #f1f5f9',
              fontSize: 12,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="usos"
            name="Usos"
            stroke="#db2777"
            strokeWidth={2}
            fill="url(#colorUsos)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="conversoes"
            name="Conversões"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#colorConversoes)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
