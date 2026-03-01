'use client';
import { useState } from 'react';
import { CheckCircle, XCircle, Clock, Zap, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';

interface BillingClientProps {
  subscription: { status: string; plan: string; currentPeriodEnd: string | null };
  billing: {
    planCost: number;
    extraUses: number;
    extraCost: number;
    totalCost: number;
    totalUses: number;
    freeLimit: number;
  };
  payments: {
    id: string;
    amount: number;
    status: string;
    type: string;
    description: string;
    createdAt: string;
    paidAt: string | null;
  }[];
  user: { name: string; email: string };
}

const statusMap: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  active: { label: 'Ativo', color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle },
  inactive: { label: 'Inativo', color: 'text-red-700 bg-red-50 border-red-200', icon: XCircle },
  cancelled: { label: 'Cancelado', color: 'text-gray-700 bg-gray-50 border-gray-200', icon: XCircle },
  past_due: { label: 'Vencido', color: 'text-orange-700 bg-orange-50 border-orange-200', icon: Clock },
};

export default function BillingClient({ subscription, billing, payments, user }: BillingClientProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const subStatus = statusMap[subscription.status] ?? statusMap.inactive;

  async function activatePlan() {
    setLoading(true);
    try {
      const res = await fetch('/api/billing/activate', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Erro ao ativar plano');
        return;
      }
      toast.success('Plano ativado com sucesso!');
      router.refresh();
    } catch {
      toast.error('Erro de conexão');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Plano e Uso</h1>
        <p className="text-sm text-gray-500 mt-1">
          Gerencie seu plano e acompanhe seus usos
        </p>
      </div>

      {/* Plan card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Plano Básico</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              100 usos inclusos por mês
            </p>
          </div>
          <span className={`badge border ${subStatus.color} flex items-center gap-1.5`}>
            <subStatus.icon className="w-3 h-3" />
            {subStatus.label}
          </span>
        </div>

        {subscription.currentPeriodEnd && (
          <p className="text-xs text-gray-400 mt-3">
            Válido até: {formatDate(subscription.currentPeriodEnd)}
          </p>
        )}

        {subscription.status !== 'active' && (
          <button
            onClick={activatePlan}
            disabled={loading}
            className="btn-primary mt-4 text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Ativando...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Ativar plano
              </>
            )}
          </button>
        )}
      </div>

      {/* Usage breakdown */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Uso do mês atual</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Usos: {billing.totalUses} / {billing.freeLimit} inclusos
            </span>
            <span className="text-gray-400 text-xs">incluídos no plano</span>
          </div>

          {billing.extraUses > 0 && (
            <div className="flex justify-between text-sm bg-orange-50 rounded-lg p-2.5">
              <span className="text-orange-700 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                {billing.extraUses} usos além do limite
              </span>
            </div>
          )}

          <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
            <div
              className="bg-brand-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, (billing.totalUses / billing.freeLimit) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-400">
            {Math.max(0, billing.freeLimit - billing.totalUses)} usos restantes este mês
          </p>
        </div>
      </div>
    </div>
  );
}
