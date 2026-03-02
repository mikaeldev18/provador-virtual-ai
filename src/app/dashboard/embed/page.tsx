'use client';
import { useSession } from 'next-auth/react';
import { useState, useMemo } from 'react';
import {
  Copy, Check, Code2, ExternalLink, Info,
  MousePointerClick, Image as ImageIcon, Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copiado!');
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={copy} className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5">
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
      {label || (copied ? 'Copiado!' : 'Copiar')}
    </button>
  );
}

const PRESET_COLORS = [
  { label: 'Pink (padrão)', value: '#db2777' },
  { label: 'Roxo', value: '#7c3aed' },
  { label: 'Azul', value: '#2563eb' },
  { label: 'Azul-petróleo', value: '#0891b2' },
  { label: 'Verde', value: '#16a34a' },
  { label: 'Laranja', value: '#ea580c' },
  { label: 'Preto', value: '#111827' },
];

export default function EmbedPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const storeId = user?.storeId ?? 'SEU_STORE_ID';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://provador-virtual-ai.vercel.app';

  // ── Configurações do widget ──────────────────────────────────────────────────
  const [widgetMode, setWidgetMode]   = useState<'float' | 'banner'>('float');
  const [bannerType, setBannerType]   = useState<'default' | 'custom'>('default');
  const [bannerUrl, setBannerUrl]     = useState('');
  const [primaryColor, setPrimaryColor] = useState('#db2777');
  const [tab, setTab] = useState(0);

  // ── Gera div com atributos dinamicamente ────────────────────────────────────
  const divAttrs = useMemo(() => {
    let attrs = `data-store="${storeId}"`;
    if (widgetMode === 'banner') attrs += ` data-mode="banner"`;
    if (widgetMode === 'banner' && bannerType === 'custom' && bannerUrl.trim()) {
      attrs += ` data-banner="${bannerUrl.trim()}"`;
    }
    if (primaryColor !== '#db2777') attrs += ` data-color="${primaryColor}"`;
    return attrs;
  }, [storeId, widgetMode, bannerType, bannerUrl, primaryColor]);

  // ── Plataformas ──────────────────────────────────────────────────────────────
  const platforms = useMemo(() => [
    {
      name: 'HTML / Qualquer plataforma',
      tip: 'Cole o código na página de produto, antes do </body>.',
      code: `<!-- ProvadorVirtualAI – Cole antes do </body> -->
<div id="provador-virtual" ${divAttrs}></div>
<script src="${appUrl}/widget.js" defer></script>`,
    },
    {
      name: 'Shopify',
      tip: 'Cole no arquivo theme.liquid ou no template de produto.',
      code: `{% comment %} Cole no theme.liquid dentro da seção de produto {% endcomment %}
{% if template contains 'product' %}
  <div id="provador-virtual" ${divAttrs}></div>
  <script src="${appUrl}/widget.js" defer></script>
{% endif %}`,
    },
    {
      name: 'WooCommerce',
      tip: 'Cole no functions.php do seu tema WordPress.',
      code: `<?php
// Cole no functions.php do seu tema
add_action('woocommerce_after_add_to_cart_button', function() {
  echo '<div id="provador-virtual" ${divAttrs}></div>';
  echo '<script src="${appUrl}/widget.js" defer></script>';
});`,
    },
  ], [divAttrs, appUrl]);

  // ── Cor RGB para preview ─────────────────────────────────────────────────────
  const colorRgb = useMemo(() => {
    const r = parseInt(primaryColor.slice(1, 3), 16);
    const g = parseInt(primaryColor.slice(3, 5), 16);
    const b = parseInt(primaryColor.slice(5, 7), 16);
    return `${r},${g},${b}`;
  }, [primaryColor]);

  const darkColor = useMemo(() => {
    const r = Math.round(parseInt(primaryColor.slice(1, 3), 16) * 0.78);
    const g = Math.round(parseInt(primaryColor.slice(3, 5), 16) * 0.78);
    const b = Math.round(parseInt(primaryColor.slice(5, 7), 16) * 0.78);
    return `#${[r, g, b].map(v => Math.max(0, v).toString(16).padStart(2, '0')).join('')}`;
  }, [primaryColor]);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Implementação</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure e gere o código para instalar o provador virtual na sua loja.
        </p>
      </div>

      {/* Store ID */}
      <div className="card bg-brand-50 border-brand-100">
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-4 h-4 text-brand-600" />
          <span className="font-semibold text-brand-900 text-sm">Seu Store ID</span>
        </div>
        <div className="flex items-center gap-3">
          <code className="flex-1 font-mono text-brand-700 bg-white border border-brand-200 rounded-lg px-3 py-2 text-sm">
            {storeId}
          </code>
          <CopyButton text={storeId} label="Copiar ID" />
        </div>
        <p className="text-xs text-brand-600 mt-2">
          Esse ID identifica sua loja. Nunca compartilhe sua API key privada.
        </p>
      </div>

      {/* ── Estilo do widget ─────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MousePointerClick className="w-4 h-4 text-gray-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Estilo de ativação</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Botão flutuante */}
          <button
            onClick={() => setWidgetMode('float')}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              widgetMode === 'float'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {widgetMode === 'float' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            {/* Mini preview: floating badge */}
            <div className="h-14 bg-gray-100 rounded-lg mb-3 relative overflow-hidden">
              <div
                className="absolute bottom-2 right-2 flex items-center gap-1 text-white text-[9px] font-bold px-2 py-1 rounded-full shadow"
                style={{ background: `linear-gradient(135deg,${primaryColor},${darkColor})` }}
              >
                ✨ <span>Experimentar</span>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-900">Botão flutuante</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Aparece fixo no canto da tela</div>
          </button>

          {/* Banner fixo */}
          <button
            onClick={() => setWidgetMode('banner')}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              widgetMode === 'banner'
                ? 'border-brand-500 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {widgetMode === 'banner' && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            {/* Mini preview: inline banner */}
            <div className="h-14 bg-gray-100 rounded-lg mb-3 flex items-center p-2">
              <div
                className="w-full flex items-center gap-2 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg"
                style={{ background: `linear-gradient(135deg,${primaryColor},${darkColor})` }}
              >
                <span>✨</span>
                <div>
                  <div style={{ fontSize: 9 }}>Experimentar Virtualmente</div>
                  <div style={{ fontSize: 8, opacity: 0.85 }}>Veja como fica · IA</div>
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-900">Banner / imagem fixa</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Embutido na página do produto</div>
          </button>
        </div>
      </div>

      {/* ── Configurar banner ────────────────────────────────────────────────── */}
      {widgetMode === 'banner' && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-gray-700" />
            <h3 className="font-semibold text-gray-900 text-sm">Imagem do banner</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Banner padrão */}
            <button
              onClick={() => setBannerType('default')}
              className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                bannerType === 'default'
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {bannerType === 'default' && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              {/* Preview banner padrão */}
              <div
                className="w-full flex items-center gap-2 text-white p-2 rounded-lg mb-2"
                style={{ background: `linear-gradient(135deg,${primaryColor},${darkColor})` }}
              >
                <span style={{ fontSize: 14 }}>✨</span>
                <div>
                  <div className="text-[10px] font-bold">Experimentar Virtualmente</div>
                  <div className="text-[9px] opacity-80">Veja como fica antes de comprar · IA</div>
                </div>
              </div>
              <div className="text-xs font-semibold text-gray-900">Banner padrão</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Banner com nossa identidade visual</div>
            </button>

            {/* Imagem personalizada */}
            <button
              onClick={() => setBannerType('custom')}
              className={`relative p-3 rounded-xl border-2 text-left transition-all ${
                bannerType === 'custom'
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {bannerType === 'custom' && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
              <div className="h-[42px] bg-gray-100 rounded-lg mb-2 flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-[11px] text-gray-400">sua imagem</span>
              </div>
              <div className="text-xs font-semibold text-gray-900">Imagem personalizada</div>
              <div className="text-[11px] text-gray-500 mt-0.5">Use sua própria imagem/banner</div>
            </button>
          </div>

          {bannerType === 'custom' && (
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1.5">
                URL da imagem
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://sua-loja.com/imagens/banner-provador.jpg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
              <p className="text-[11px] text-gray-400 mt-1.5">
                A imagem deve ser uma URL pública acessível. Ao clicar nela, o pop-up do provador virtual será aberto.
              </p>
              {bannerUrl.trim() && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1.5">Pré-visualização:</p>
                  <img
                    src={bannerUrl.trim()}
                    alt="Preview"
                    className="max-w-full rounded-lg border border-gray-200 max-h-40 object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Personalizar cores ───────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-gray-700" />
          <h3 className="font-semibold text-gray-900 text-sm">Cor do pop-up</h3>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => setPrimaryColor(c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                primaryColor === c.value ? 'border-gray-900 scale-110' : 'border-white shadow'
              }`}
              style={{ background: c.value }}
            />
          ))}
        </div>

        {/* Custom picker + preview */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
            />
            <div>
              <p className="text-xs font-medium text-gray-700">Cor personalizada</p>
              <p className="text-[11px] text-gray-400 font-mono">{primaryColor.toUpperCase()}</p>
            </div>
          </div>

          {/* Mini button preview */}
          <div
            className="flex items-center gap-1.5 text-white text-[11px] font-bold px-3 py-2 rounded-full shadow select-none"
            style={{
              background: `linear-gradient(135deg,${primaryColor},${darkColor})`,
              boxShadow: `0 4px 12px rgba(${colorRgb},0.35)`,
            }}
          >
            ✨ <span>Experimentar</span>
          </div>
        </div>

        <p className="text-[11px] text-gray-400 mt-3">
          Escolha uma cor que combine com a identidade visual da sua loja. A cor é aplicada no botão, pop-up e todos os elementos do widget.
        </p>
      </div>

      {/* ── Código de integração ─────────────────────────────────────────────── */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Código de integração</h3>

        <div className="flex gap-2 mb-4 flex-wrap">
          {platforms.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setTab(i)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                tab === i
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="bg-gray-50 border border-brand-100 rounded-xl p-3 mb-3 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">{platforms[tab].tip}</p>
        </div>

        <div className="relative rounded-xl bg-gray-900 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-400">{platforms[tab].name}</span>
            <CopyButton text={platforms[tab].code} />
          </div>
          <pre className="p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {platforms[tab].code}
          </pre>
        </div>
      </div>

      {/* ── Passo a passo ────────────────────────────────────────────────────── */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Passo a passo</h3>
        <ol className="space-y-3">
          {[
            'Configure o estilo, imagem e cor acima conforme a sua loja',
            'Copie o código gerado para a plataforma da sua loja',
            'Cole na página de produto (antes do </body> ou onde preferir)',
            'Salve e publique as alterações',
            'Acesse sua loja e veja o provador aparecer',
            'Clique no botão para testar o fluxo completo',
            'Volte ao dashboard para ver os analytics em tempo real',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <a
            href="/docs/embed"
            target="_blank"
            className="btn-outline text-xs flex items-center gap-2 w-fit"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Documentação completa de integração
          </a>
        </div>
      </div>
    </div>
  );
}
