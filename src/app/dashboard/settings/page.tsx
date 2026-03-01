'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Copy, Check, RefreshCw, Shield, Store, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2">
        <input
          readOnly
          value={value}
          className="input-field flex-1 font-mono text-xs bg-gray-50"
        />
        <button onClick={copy} className="btn-outline px-3">
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  const [storeName, setStoreName] = useState(user?.storeName ?? '');
  const [storeUrl, setStoreUrl] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    // Placeholder – implementar endpoint PATCH /api/user/settings
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Configurações salvas!');
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500 mt-1">Gerencie sua conta e integrações</p>
      </div>

      {/* Store info */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Store className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Dados da loja</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="label">Nome da loja</label>
            <input
              type="text"
              className="input-field"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
          </div>
          <div>
            <label className="label">URL da loja</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                className="input-field pl-9"
                placeholder="https://minhaloja.com.br"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
              />
            </div>
          </div>
          <button onClick={save} disabled={saving} className="btn-primary text-sm">
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</>
            ) : 'Salvar alterações'}
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-brand-600" />
          <h3 className="font-semibold text-gray-900 text-sm">Credenciais de API</h3>
        </div>
        <div className="space-y-4">
          <CopyField value={user?.storeId ?? '–'} label="Store ID (público)" />
          <CopyField value={user?.apiKey ?? '–'} label="API Key (privada – não compartilhe)" />
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-xs text-yellow-700">
          <strong>⚠️ Atenção:</strong> Nunca compartilhe sua API Key. Use apenas no backend.
          O Store ID é público e seguro para usar no widget embed.
        </div>
        <button className="btn-outline text-xs mt-4 flex items-center gap-2" onClick={() => toast('Contate o suporte para revogar sua API Key')}>
          <RefreshCw className="w-3.5 h-3.5" />
          Revogar e gerar nova API Key
        </button>
      </div>

      {/* Account */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Conta</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Email</span>
            <span className="text-sm font-medium text-gray-900">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600">Nome</span>
            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
          </div>
        </div>
        <button className="btn-outline text-xs mt-4 text-red-600 border-red-200 hover:bg-red-50">
          Cancelar assinatura
        </button>
      </div>
    </div>
  );
}
