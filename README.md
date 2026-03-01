# ProvadorVirtualAI 👗✨

Plataforma SaaS de provador virtual com Inteligência Artificial para lojas de moda online. Lojistas se cadastram, recebem um código embed de 2 linhas e seus clientes podem experimentar roupas virtualmente em segundos.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS |
| Banco de dados | Prisma + SQLite (dev) / PostgreSQL (prod) |
| Autenticação | NextAuth.js v4 |
| Pagamentos | Abacate Pay |
| IA Try-On | Replicate (CatVTON) |
| Gráficos | Recharts |

---

## Setup em 5 minutos

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas chaves
```

Variáveis obrigatórias:
- `NEXTAUTH_SECRET` – gere com `openssl rand -base64 32`
- `ABACATEPAY_API_KEY` – obtenha em [abacatepay.com](https://abacatepay.com)
- `REPLICATE_API_TOKEN` – obtenha em [replicate.com](https://replicate.com)

### 3. Inicializar banco de dados

```bash
npm run db:push
npm run db:generate
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3000

---

## Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx                    # Landing Page
│   ├── auth/
│   │   ├── login/page.tsx          # Login
│   │   └── signup/page.tsx         # Cadastro + Checkout Abacate Pay
│   ├── dashboard/
│   │   ├── page.tsx                # Visão geral + métricas
│   │   ├── analytics/page.tsx      # Analytics detalhados + gráficos
│   │   ├── embed/page.tsx          # Código embed por plataforma
│   │   ├── billing/page.tsx        # Fatura + histórico pagamentos
│   │   └── settings/page.tsx       # Configurações da loja
│   └── api/
│       ├── auth/[...nextauth]/     # NextAuth
│       ├── auth/register/          # Cadastro de lojistas
│       ├── tryon/                  # IA virtual try-on (POST) + conversão (PATCH)
│       ├── billing/checkout/       # Checkout Abacate Pay (assinatura)
│       ├── billing/pay-extras/     # Link pagamento usos extras
│       ├── billing/export-csv/     # Export CSV de usos/pagamentos
│       └── webhook/abacatepay/     # Webhook Abacate Pay
├── components/
│   ├── landing/                    # Hero, Features, HowItWorks, Pricing, Footer, Navbar
│   ├── dashboard/                  # Sidebar, DashboardCharts
│   └── providers/                  # AuthSessionProvider
├── lib/
│   ├── prisma.ts                   # Prisma client
│   ├── auth.ts                     # NextAuth config
│   ├── abacatepay.ts               # Abacate Pay API client
│   ├── replicate.ts                # Replicate AI client
│   └── utils.ts                    # Helpers
└── prisma/
    └── schema.prisma               # Schema do banco
public/
└── widget.js                       # Widget embeddable (JavaScript puro)
```

---

## Widget Embed

Após o cadastro, o lojista recebe um código de 2 linhas:

```html
<div id="provador-virtual" data-store="SEU_STORE_ID"></div>
<script src="https://provadorvirtual.ai/widget.js" defer></script>
```

**O widget:**
- Detecta automaticamente a imagem do produto na página
- Cria um botão flutuante "Experimentar Virtual IA"
- Abre modal com upload/câmera de foto do usuário
- Envia para a API → Replicate processa try-on
- Exibe resultado lado a lado (antes/depois)
- Botão "Comprar agora" linkado ao carrinho
- Rastreia usos e conversões automaticamente

**Atributos opcionais na imagem do produto:**
```html
<img data-pvai-garment src="..." />  <!-- imagem da roupa -->
```

---

## Abacate Pay – Integração

### Assinatura mensal (R$19,90)
Criada automaticamente no cadastro. Webhook ativa a conta após pagamento.

### Pay-per-use (usos extras)
No dashboard, botão "Pagar R$X em extras" gera link Abacate Pay.

### Configurar webhook
No painel Abacate Pay, configure:
- URL: `https://seudominio.com/api/webhook/abacatepay`
- Eventos: `billing.paid`, `billing.expired`, `billing.cancelled`, `subscription.renewed`

---

## Replicate AI

Modelo utilizado: **CatVTON** (`levihsu/cat-vton`)
- State-of-the-art virtual try-on
- Input: foto do usuário + imagem da peça
- Output: imagem realista

Custo estimado: ~$0.02/chamada ≈ R$0,10 (câmbio 5.0)

---

## Deploy

### Vercel (recomendado)
```bash
npm i -g vercel
vercel
```

### Banco em produção
Substitua SQLite por PostgreSQL (Railway, Supabase, Neon):
```
DATABASE_URL="postgresql://user:pass@host:5432/provadorvirtual"
```

---

## Modelo de Preços

| Item | Valor |
|------|-------|
| Plano Básico | R$19,90/mês |
| Usos inclusos | 100/mês |
| Uso extra | R$0,10 cada |
| Custo real IA/uso | ~R$0,05-0,10 |
| Margem estimada | ~50-100% |

---

## Suporte

- Email: suporte@provadorvirtual.ai
- WhatsApp: (11) 99999-9999
- Docs: https://provadorvirtual.ai/docs
