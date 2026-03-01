'use client';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Copy, Check, Code2, ExternalLink, Info } from 'lucide-react';
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

export default function EmbedPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const storeId = user?.storeId ?? 'SEU_STORE_ID';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://provadorvirtual.ai';

  const embedCode = `<!-- ProvadorVirtualAI – Cole antes do </body> -->
<div id="provador-virtual" data-store="${storeId}"></div>
<script src="${appUrl}/widget.js" defer></script>`;

  const shopifyCode = `{% comment %} Cole no theme.liquid ou no produto template {% endcomment %}
{% if template contains 'product' %}
  <div id="provador-virtual" data-store="${storeId}"></div>
  <script src="${appUrl}/widget.js" defer></script>
{% endif %}`;

  const wooCode = `<?php
// Cole no functions.php do seu tema
add_action('woocommerce_after_add_to_cart_button', function() {
  echo '<div id="provador-virtual" data-store="${storeId}"></div>';
  echo '<script src="${appUrl}/widget.js" defer></script>';
});`;

  const platforms = [
    {
      name: 'HTML / Qualquer plataforma',
      code: embedCode,
      tip: 'Cole o código dentro da página de produto, antes do </body>.',
    },
    {
      name: 'Shopify',
      code: shopifyCode,
      tip: 'Cole no arquivo theme.liquid, dentro da seção de produto.',
    },
    {
      name: 'WooCommerce',
      code: wooCode,
      tip: 'Cole no functions.php do seu tema WordPress.',
    },
  ];

  const [tab, setTab] = useState(0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Código Embed</h1>
        <p className="text-sm text-gray-500 mt-1">
          Cole esse código na página de produto da sua loja para ativar o provador virtual.
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

      {/* Platform tabs */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Código por plataforma</h3>

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

      {/* Instructions */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 text-sm mb-4">Passo a passo</h3>
        <ol className="space-y-3">
          {[
            'Copie o código acima para a sua plataforma',
            'Cole na página de produto da sua loja (antes do </body>)',
            'Salve e publique as alterações',
            'Acesse sua loja e veja o botão do provador aparecer',
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
