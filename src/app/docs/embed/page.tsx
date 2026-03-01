'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, Copy, Check, ChevronDown, ChevronRight,
  AlertCircle, Info, Zap, Code2, Globe, ShoppingBag,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────────── */
function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  return { copied, copy };
}

function CodeBlock({ code, lang = 'html', title }: { code: string; lang?: string; title?: string }) {
  const { copied, copy } = useCopy(code);
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 my-4">
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          {title && <span className="text-xs text-gray-400 font-mono">{title}</span>}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition px-2 py-1 rounded"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      <pre className="bg-gray-950 p-4 overflow-x-auto text-sm text-gray-300 leading-relaxed font-mono whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function Callout({ type, children }: { type: 'info' | 'warning' | 'tip'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-blue-50 border-blue-200', icon: Info, text: 'text-blue-800', iconColor: 'text-blue-500' },
    warning: { bg: 'bg-yellow-50 border-yellow-200', icon: AlertCircle, text: 'text-yellow-800', iconColor: 'text-yellow-500' },
    tip: { bg: 'bg-green-50 border-green-200', icon: Zap, text: 'text-green-800', iconColor: 'text-green-600' },
  }[type];
  const Icon = styles.icon;
  return (
    <div className={`flex gap-3 border rounded-xl p-4 my-4 ${styles.bg}`}>
      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${styles.iconColor}`} />
      <p className={`text-sm ${styles.text}`}>{children}</p>
    </div>
  );
}

function Section({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      {children}
    </section>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-gray-900 mt-10 mb-1 flex items-center gap-2">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-base font-semibold text-gray-800 mt-6 mb-2">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-gray-600 leading-relaxed">{children}</p>;
}

/* ─── nav items ────────────────────────────────────────── */
const nav = [
  { id: 'como-funciona', label: 'Como funciona' },
  { id: 'html', label: 'HTML puro' },
  { id: 'shopify', label: 'Shopify' },
  { id: 'woocommerce', label: 'WooCommerce' },
  { id: 'vtex', label: 'VTEX' },
  { id: 'nuvemshop', label: 'Nuvemshop' },
  { id: 'tray', label: 'Tray / Tray Corp' },
  { id: 'loja-integrada', label: 'Loja Integrada' },
  { id: 'api', label: 'API direta' },
  { id: 'perguntas', label: 'Dúvidas frequentes' },
];

/* ─── codes ────────────────────────────────────────────── */
const APP_URL = 'https://provadorvirtual.ai';
const STORE_ID = 'SEU_STORE_ID';

const codes = {
  html: `<!-- Cole dentro da página de produto, antes do </body> -->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  shopifyLiquid: `{% comment %}
  Cole no arquivo: Online Store → Themes → Edit code
  Arquivo: sections/product-template.liquid  (ou main-product.liquid)
  Posição: logo após o botão "Adicionar ao carrinho"
{% endcomment %}

{% if template contains 'product' %}
  <div id="provador-virtual" data-store="${STORE_ID}"></div>
  <script src="${APP_URL}/widget.js" defer></script>
{% endif %}`,

  shopifyThemeLiquid: `{% comment %}
  Alternativa: cole no theme.liquid antes do </body>
  O widget só renderiza em páginas de produto automaticamente
{% endcomment %}
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  wooFunctions: `<?php
/**
 * Cole no arquivo: wp-content/themes/SEU-TEMA/functions.php
 * (ou crie um plugin simples com esse código)
 */
add_action('woocommerce_after_add_to_cart_button', function() {
    echo '<div id="provador-virtual" data-store="${STORE_ID}"></div>';
    echo '<script src="${APP_URL}/widget.js" defer></script>';
});`,

  wooPlugin: `<?php
/**
 * Plugin Name: ProvadorVirtualAI
 * Description: Widget de provador virtual para WooCommerce
 * Version: 1.0
 */
add_action('woocommerce_after_add_to_cart_button', function() {
    echo '<div id="provador-virtual" data-store="${STORE_ID}"></div>';
    echo '<script src="${APP_URL}/widget.js" defer></script>';
});`,

  vtexHTML: `<!-- VTEX – edite via Site Editor ou CMS Portal -->
<!-- Adicione um bloco HTML na página de produto -->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  vtexIO: `// VTEX IO – crie um bloco customizado em:
// store/blocks/product.jsonc
// Adicione um bloco "html" com o código abaixo

// Em store/blocks/custom-tryon.json:
{
  "flex-layout.row#tryon": {
    "children": ["rich-text#tryon"]
  },
  "rich-text#tryon": {
    "props": {
      "text": "<div id='provador-virtual' data-store='${STORE_ID}'></div>"
    }
  }
}

// No arquivo product.jsonc, adicione "flex-layout.row#tryon"
// na seção de produto onde quer exibir o botão`,

  vtexScript: `<!-- VTEX – adicione no checkout.css ou via Script Manager -->
<!-- Em Admin → CMS → JavaScript/CSS → Scripts -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('/p')) {
      var div = document.createElement('div');
      div.id = 'provador-virtual';
      div.dataset.store = '${STORE_ID}';
      var target = document.querySelector('.buy-button') || document.querySelector('[data-testid="buy-button"]');
      if (target) target.parentNode.insertBefore(div, target.nextSibling);
      var script = document.createElement('script');
      script.src = '${APP_URL}/widget.js';
      script.defer = true;
      document.head.appendChild(script);
    }
  });
</script>`,

  nuvemshop: `<!-- Nuvemshop – vá em:
  Painel → Personalização → Editar tema → Editar HTML/CSS
  Arquivo: product.html (ou templates/product.html)
  Cole logo após o botão de compra
-->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  nuvemshopLayout: `<!-- Nuvemshop – Alternativa via Layout Base (layout.html):
  Cole antes do </body> no arquivo de layout principal
-->
{% if template == "product" %}
  <div id="provador-virtual" data-store="${STORE_ID}"></div>
  <script src="${APP_URL}/widget.js" defer></script>
{% endif %}`,

  tray: `<!-- Tray / Tray Corp – vá em:
  Painel → Layout → Editar tema → Arquivos do tema
  Arquivo: produto.html  (ou product.html)
  Cole após o botão "Comprar"
-->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  trayCorpScript: `<!-- Tray Corp – via Gerenciador de Scripts:
  Painel → Marketing → Scripts personalizados
  Tipo: Corpo (Body) | Página: Produto
-->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  lojaIntegrada: `<!-- Loja Integrada – vá em:
  Painel → Layout → Editar tema → Páginas → Produto
  Cole após o bloco do botão de compra
-->
<div id="provador-virtual" data-store="${STORE_ID}"></div>
<script src="${APP_URL}/widget.js" defer></script>`,

  lojaIntegradaGlobal: `<!-- Loja Integrada – via layout.html (global):
  Painel → Layout → Editar tema → Layout Base
  Cole antes do </body>
-->
{% if page_type == "product" %}
  <div id="provador-virtual" data-store="${STORE_ID}"></div>
  <script src="${APP_URL}/widget.js" defer></script>
{% endif %}`,

  apiPost: `// POST ${APP_URL}/api/tryon
// Content-Type: application/json

{
  "storeId": "${STORE_ID}",
  "userPhotoUrl": "https://...url-da-foto-do-cliente.jpg",
  "garmentUrl": "https://...url-da-imagem-da-peça.jpg",
  "productUrl": "https://minhaloja.com.br/produto/camiseta-azul",
  "productName": "Camiseta Azul Slim Fit",
  "sessionId": "sess_abc123"
}`,

  apiResponse: `// Resposta de sucesso (200)
{
  "success": true,
  "imageUrl": "https://...imagem-gerada-pela-ia.jpg",
  "isExtra": false,
  "message": "Uso incluído no plano."
}

// Resposta quando ultrapassa o limite (ainda funciona)
{
  "success": true,
  "imageUrl": "https://...imagem-gerada-pela-ia.jpg",
  "isExtra": true,
  "message": "Uso extra registrado."
}`,

  apiConversion: `// PATCH ${APP_URL}/api/tryon
// Registre uma conversão quando o cliente clicar em comprar

{
  "storeId": "${STORE_ID}",
  "sessionId": "sess_abc123",
  "revenue": 129.90
}`,

  apiError: `// Erros possíveis:

// 400 – campos obrigatórios faltando
{ "error": "storeId, userPhotoUrl e garmentUrl são obrigatórios" }

// 403 – plano inativo
{ "error": "Plano inativo. Ative sua assinatura no dashboard." }

// 404 – store ID inválido
{ "error": "Loja não encontrada" }

// 429 – muitas requisições (máx. 10/min por loja)
{ "error": "Muitas requisições. Aguarde." }`,

  widgetCustom: `<!-- Atributos opcionais do widget -->
<div
  id="provador-virtual"
  data-store="${STORE_ID}"
  data-product-url="https://minhaloja.com.br/produto/camiseta"
  data-product-name="Camiseta Azul"
  data-garment-url="https://cdn.minhaloja.com.br/img/camiseta-frente.jpg"
  data-category="upper_body"
>
</div>
<script src="${APP_URL}/widget.js" defer></script>

<!-- Categorias disponíveis: upper_body | lower_body | dresses -->`,
};

/* ─── FAQ ──────────────────────────────────────────────── */
const faqs = [
  {
    q: 'O widget funciona em qualquer plataforma?',
    a: 'Sim. Qualquer plataforma que permita adicionar HTML personalizado na página de produto suporta o widget. Se a plataforma tiver restrições de segurança (CSP), entre em contato.',
  },
  {
    q: 'As fotos dos clientes ficam armazenadas?',
    a: 'Não. As fotos são enviadas diretamente para o modelo de IA e descartadas após o processamento. Não armazenamos imagens dos seus clientes.',
  },
  {
    q: 'Quanto tempo demora para gerar a imagem?',
    a: 'Em média de 10 a 30 segundos, dependendo da fila do modelo de IA. O widget exibe um indicador de carregamento durante o processamento.',
  },
  {
    q: 'O que é o data-store?',
    a: 'É o identificador único da sua loja no sistema. Ele é público (aparece no código HTML), mas não dá acesso ao painel nem a dados sensíveis. Nunca compartilhe sua API Key privada.',
  },
  {
    q: 'Posso usar em mais de uma loja?',
    a: 'Cada conta tem um Store ID. Para múltiplas lojas, crie uma conta separada para cada uma.',
  },
  {
    q: 'O widget é responsivo / funciona no celular?',
    a: 'Sim. O widget foi desenvolvido com design mobile-first e funciona em todos os tamanhos de tela.',
  },
  {
    q: 'Como funciona o tracking de conversão?',
    a: 'Quando o cliente clica em comprar após usar o provador, o widget registra automaticamente a conversão. Você vê o impacto real em Receita e ROI no dashboard.',
  },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <span className="text-sm font-semibold text-gray-800">{q}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 pt-3 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── page ─────────────────────────────────────────────── */
export default function DocsEmbedPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <div className="border-b border-gray-200 sticky top-0 bg-white z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">
              ProvadorVirtual<span className="text-pink-600">AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Documentação de Integração</span>
            <Link href="/dashboard" className="text-xs bg-pink-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-pink-700 transition">
              Ir ao Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 flex gap-10">
        {/* Sidebar nav */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-24 space-y-0.5">
            <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-3 px-3">Conteúdo</p>
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-sm text-gray-600 hover:text-pink-600 px-3 py-1.5 rounded-lg hover:bg-pink-50 transition"
              >
                {item.label}
              </a>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 max-w-3xl">
          {/* Hero */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-pink-50 text-pink-700 text-xs font-medium px-3 py-1 rounded-full border border-pink-100 mb-4">
              <Code2 className="w-3.5 h-3.5" />
              Guia de integração
            </div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Como instalar o Provador Virtual na sua loja
            </h1>
            <p className="mt-3 text-gray-500">
              Em menos de 5 minutos seu provador está funcionando. Escolha sua plataforma abaixo e siga o passo a passo.
            </p>
          </div>

          {/* ── COMO FUNCIONA ── */}
          <Section id="como-funciona">
            <H2><Globe className="w-5 h-5 text-pink-600" />Como funciona</H2>
            <P>
              O widget é um script JavaScript que você cola uma vez na página de produto da sua loja. Quando o cliente acessa a página, um botão "Experimentar virtualmente" aparece. O cliente tira uma foto ou faz upload de uma foto sua, e a IA gera em segundos uma imagem realista com a peça vestida.
            </P>

            <div className="grid grid-cols-3 gap-3 my-5">
              {[
                { n: '1', title: 'Cole o código', desc: 'Um único bloco HTML na página de produto' },
                { n: '2', title: 'Cliente usa', desc: 'Envia foto e escolhe a peça para provar' },
                { n: '3', title: 'IA processa', desc: 'Resultado em ~15 segundos, sem instalar nada' },
              ].map((s) => (
                <div key={s.n} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-bold flex items-center justify-center mb-3">{s.n}</div>
                  <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
                </div>
              ))}
            </div>

            <Callout type="info">
              Substitua <code className="bg-blue-100 px-1 rounded text-xs font-mono">SEU_STORE_ID</code> pelo seu Store ID real, disponível no dashboard em <strong>Código Embed</strong>.
            </Callout>
          </Section>

          {/* ── HTML PURO ── */}
          <Section id="html">
            <H2><ShoppingBag className="w-5 h-5 text-pink-600" />HTML puro / qualquer plataforma</H2>
            <P>
              Se sua loja usa HTML customizado ou qualquer plataforma não listada, cole este código. Funciona em qualquer ambiente que aceite HTML.
            </P>
            <CodeBlock code={codes.html} title="produto.html" />

            <H3>Onde colar?</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none">
              {[
                'Abra o arquivo HTML da sua página de produto',
                'Localize o botão de "Comprar" ou "Adicionar ao carrinho"',
                'Cole o código logo abaixo desse botão',
                'Salve e publique',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>

            <H3>Atributos opcionais</H3>
            <P>Você pode passar informações do produto diretamente no HTML para melhorar a experiência:</P>
            <CodeBlock code={codes.widgetCustom} title="Exemplo com atributos opcionais" />
          </Section>

          {/* ── SHOPIFY ── */}
          <Section id="shopify">
            <H2>Shopify</H2>
            <P>
              Existem duas formas de instalar no Shopify: editando o template de produto (recomendado) ou o layout global.
            </P>

            <H3>Opção 1 – Template de produto (recomendado)</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'No painel Shopify, vá em Online Store → Themes',
                'Clique em "..." → Edit code',
                'Abra o arquivo sections/main-product.liquid (ou product-template.liquid)',
                'Localize o bloco do botão de compra (busque por "add_to_cart" ou "buy")',
                'Cole o código abaixo desse bloco',
                'Clique em Save',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.shopifyLiquid} title="sections/main-product.liquid" lang="liquid" />

            <H3>Opção 2 – theme.liquid (global)</H3>
            <P>Se preferir editar apenas um arquivo, cole no theme.liquid antes do fechamento do <code className="bg-gray-100 px-1 rounded text-xs font-mono">&lt;/body&gt;</code>.</P>
            <CodeBlock code={codes.shopifyThemeLiquid} title="layout/theme.liquid" lang="liquid" />

            <Callout type="tip">
              Após salvar, acesse uma página de produto da sua loja para confirmar que o botão "Experimentar virtualmente" apareceu.
            </Callout>
          </Section>

          {/* ── WOOCOMMERCE ── */}
          <Section id="woocommerce">
            <H2>WooCommerce (WordPress)</H2>
            <P>
              No WooCommerce, a forma mais simples é via <strong>functions.php</strong> do seu tema filho, ou criando um mini plugin.
            </P>

            <H3>Opção 1 – functions.php do tema filho (recomendado)</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'No painel WordPress, vá em Appearance → Theme File Editor',
                'Selecione seu tema filho (Child Theme)',
                'Abra o arquivo functions.php',
                'Cole o código no final do arquivo',
                'Clique em Update File',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.wooFunctions} title="functions.php" lang="php" />

            <Callout type="warning">
              Sempre edite o <strong>tema filho</strong>, nunca o tema pai. Atualizações do tema pai sobrescrevem o functions.php original.
            </Callout>

            <H3>Opção 2 – Mini plugin (mais seguro)</H3>
            <P>Crie um arquivo PHP dentro de <code className="bg-gray-100 px-1 rounded text-xs font-mono">wp-content/plugins/provador-virtual/provador-virtual.php</code> com o conteúdo abaixo e ative no painel de plugins:</P>
            <CodeBlock code={codes.wooPlugin} title="wp-content/plugins/provador-virtual/provador-virtual.php" lang="php" />
          </Section>

          {/* ── VTEX ── */}
          <Section id="vtex">
            <H2>VTEX</H2>
            <P>
              A VTEX tem dois ambientes: o legado (CMS Portal / Site Editor) e o moderno (VTEX IO / Storefront). Escolha o seu:
            </P>

            <H3>VTEX legado – Site Editor / CMS Portal</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'Acesse o Admin VTEX → CMS → Site Editor',
                'Selecione a página de produto',
                'Adicione um novo elemento HTML ou bloco de código customizado',
                'Cole o código HTML abaixo',
                'Publique as alterações',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.vtexHTML} title="Site Editor – Bloco HTML" />

            <H3>VTEX IO / Storefront</H3>
            <P>No VTEX IO, use o componente <code className="bg-gray-100 px-1 rounded text-xs font-mono">rich-text</code> ou um bloco customizado:</P>
            <CodeBlock code={codes.vtexIO} title="store/blocks/product.jsonc" lang="json" />

            <H3>VTEX – via Script Manager (alternativa universal)</H3>
            <P>Se não quiser mexer no tema, injete via Script Manager:</P>
            <CodeBlock code={codes.vtexScript} title="Admin → CMS → JavaScript – Scripts" />
          </Section>

          {/* ── NUVEMSHOP ── */}
          <Section id="nuvemshop">
            <H2>Nuvemshop</H2>
            <P>
              Na Nuvemshop, edite diretamente o template HTML do tema.
            </P>

            <H3>Via editor de tema</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'No painel Nuvemshop, vá em Personalização → Editar tema',
                'Clique em Editar HTML/CSS',
                'Abra o arquivo product.html (ou templates/product.html)',
                'Localize o botão de compra (busque por "buy" ou "add-to-cart")',
                'Cole o código abaixo desse botão',
                'Clique em Salvar',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.nuvemshop} title="templates/product.html" />

            <H3>Via layout.html (global)</H3>
            <P>Alternativa: cole no arquivo de layout base condicionando à página de produto.</P>
            <CodeBlock code={codes.nuvemshopLayout} title="layout/layout.html" lang="liquid" />
          </Section>

          {/* ── TRAY ── */}
          <Section id="tray">
            <H2>Tray / Tray Corp</H2>

            <H3>Tray – Editor de tema</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'No painel Tray, vá em Layout → Editar tema → Arquivos do tema',
                'Abra o arquivo produto.html',
                'Localize o botão de compra',
                'Cole o código logo abaixo',
                'Salve e visualize na loja',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.tray} title="produto.html" />

            <H3>Tray Corp – Script Manager</H3>
            <P>Na Tray Corp, use o gerenciador de scripts para injetar sem editar o tema:</P>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'Vá em Marketing → Scripts personalizados',
                'Clique em Adicionar script',
                'Selecione: Posição = Body | Página = Produto',
                'Cole o código abaixo',
                'Salve',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.trayCorpScript} title="Script Manager – Produto" />
          </Section>

          {/* ── LOJA INTEGRADA ── */}
          <Section id="loja-integrada">
            <H2>Loja Integrada</H2>

            <H3>Via editor de tema</H3>
            <ol className="space-y-2 text-sm text-gray-600 list-none mb-4">
              {[
                'No painel Loja Integrada, vá em Layout → Editar tema → Páginas',
                'Selecione a página Produto',
                'Localize o bloco do botão de compra no HTML',
                'Cole o código após o botão',
                'Salve e publique',
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-pink-100 text-pink-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
            <CodeBlock code={codes.lojaIntegrada} title="Páginas → Produto" />

            <H3>Via layout.html (global)</H3>
            <CodeBlock code={codes.lojaIntegradaGlobal} title="Layout Base → layout.html" lang="liquid" />
          </Section>

          {/* ── API DIRETA ── */}
          <Section id="api">
            <H2><Zap className="w-5 h-5 text-pink-600" />API direta (para desenvolvedores)</H2>
            <P>
              Se quiser integrar a IA de try-on em um app customizado ou fazer chamadas server-side, use a API REST diretamente.
            </P>

            <H3>POST /api/tryon – Gerar imagem</H3>
            <P>Envia a foto do cliente e a imagem da peça. Retorna a URL da imagem gerada pela IA.</P>
            <CodeBlock code={codes.apiPost} title="Requisição" lang="json" />
            <CodeBlock code={codes.apiResponse} title="Resposta" lang="json" />

            <div className="overflow-x-auto my-4">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50 border border-gray-200">
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-r border-gray-200">Campo</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-r border-gray-200">Tipo</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700 border-r border-gray-200">Obrigatório</th>
                    <th className="text-left px-3 py-2 font-semibold text-gray-700">Descrição</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['storeId', 'string', 'Sim', 'Seu Store ID (visível no dashboard)'],
                    ['userPhotoUrl', 'string (URL)', 'Sim', 'URL pública da foto do cliente (HTTPS)'],
                    ['garmentUrl', 'string (URL)', 'Sim', 'URL pública da imagem da peça de roupa'],
                    ['productUrl', 'string (URL)', 'Não', 'URL do produto para rastrear no analytics'],
                    ['productName', 'string', 'Não', 'Nome do produto para exibição no dashboard'],
                    ['sessionId', 'string', 'Não', 'ID de sessão para rastrear conversões'],
                    ['category', 'string', 'Não', 'upper_body | lower_body | dresses (padrão: upper_body)'],
                  ].map(([f, t, r, d]) => (
                    <tr key={f} className="border border-gray-100">
                      <td className="px-3 py-2 font-mono text-pink-700">{f}</td>
                      <td className="px-3 py-2 text-gray-600">{t}</td>
                      <td className="px-3 py-2">{r === 'Sim' ? <span className="text-red-600 font-medium">Sim</span> : <span className="text-gray-400">Não</span>}</td>
                      <td className="px-3 py-2 text-gray-600">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <H3>PATCH /api/tryon – Registrar conversão</H3>
            <P>Chame quando o cliente clicar em comprar após usar o provador. Isso registra a conversão no dashboard.</P>
            <CodeBlock code={codes.apiConversion} title="Registrar conversão" lang="json" />

            <H3>Erros possíveis</H3>
            <CodeBlock code={codes.apiError} title="Códigos de erro" lang="json" />

            <Callout type="warning">
              A API aceita apenas URLs públicas (HTTPS acessíveis pela internet). URLs localhost ou internas não funcionam. Tamanho máximo recomendado de imagem: 5MB.
            </Callout>
          </Section>

          {/* ── FAQ ── */}
          <Section id="perguntas">
            <H2>Dúvidas frequentes</H2>
            <div className="space-y-2 mt-4">
              {faqs.map((f) => <FAQ key={f.q} q={f.q} a={f.a} />)}
            </div>
          </Section>

          {/* CTA */}
          <div className="mt-10 bg-gradient-to-r from-pink-600 to-pink-500 rounded-2xl p-6 text-white text-center">
            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-90" />
            <h3 className="font-bold text-lg">Pronto para instalar?</h3>
            <p className="text-sm text-pink-100 mt-1 mb-4">
              Pegue seu Store ID no dashboard e cole o código na sua loja.
            </p>
            <Link
              href="/dashboard/embed"
              className="inline-flex items-center gap-2 bg-white text-pink-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-pink-50 transition"
            >
              <Code2 className="w-4 h-4" />
              Ver meu código no dashboard
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8 pb-10">
            Precisa de ajuda? Entre em contato pelo dashboard ou acesse{' '}
            <Link href="/" className="text-pink-600 hover:underline">provadorvirtual.ai</Link>
          </p>
        </main>
      </div>
    </div>
  );
}
