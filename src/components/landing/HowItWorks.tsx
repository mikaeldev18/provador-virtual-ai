import { Code2, Upload, Wand2, ShoppingCart, BarChart3, ArrowRight } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: Code2,
    title: 'Cole o código na sua loja',
    description:
      'Após o cadastro, copie 2 linhas de código HTML e cole na página do produto da sua loja. Funciona em Shopify, WooCommerce, Nuvemshop e qualquer HTML.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    step: '02',
    icon: Upload,
    title: 'Cliente tira/envia uma foto',
    description:
      'Um botão elegante aparece na sua página de produto. O cliente clica e faz upload de uma foto do corpo dele (frontal simples).',
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
  },
  {
    step: '03',
    icon: Wand2,
    title: 'IA gera resultado realista',
    description:
      'Nossa IA analisa o corpo e sobrepõe a roupa de forma realista em segundos. Resultado profissional sem app para baixar.',
    color: 'bg-brand-50 text-brand-600',
    border: 'border-brand-100',
  },
  {
    step: '04',
    icon: ShoppingCart,
    title: 'Cliente compra com confiança',
    description:
      'A imagem gerada é exibida com um botão "Comprar agora". Conversão aumenta pois o cliente sabe como a peça fica no corpo dele.',
    color: 'bg-green-50 text-green-600',
    border: 'border-green-100',
  },
  {
    step: '05',
    icon: BarChart3,
    title: 'Você acompanha os resultados',
    description:
      'No dashboard veja usos, conversões, receita gerada, ROI e fatura. Dados em tempo real para otimizar sua estratégia.',
    color: 'bg-orange-50 text-orange-600',
    border: 'border-orange-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Como funciona
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Pronto em 5 minutos
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Sem instalação complexa. Sem precisar de programador. Copie e cole o código e seu
            provador virtual está ativo.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute left-0 right-0 top-14 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="grid md:grid-cols-5 gap-6 lg:gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className={`card border ${s.border} hover:shadow-md transition-shadow h-full`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center`}>
                        <s.icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-gray-100">{s.step}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{s.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white border border-gray-200 rounded-full items-center justify-center">
                    <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Embed code preview */}
        <div className="mt-14 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-2 text-xs text-gray-400">produto.html – Seu site</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <p className="text-gray-500">{'<!-- Cole isso na sua página de produto -->'}</p>
              <p className="text-blue-400 mt-1">
                {'<div id='}
                <span className="text-green-400">"provador-virtual"</span>
                {' data-store='}
                <span className="text-green-400">"ABC123"</span>
                {'></div>'}
              </p>
              <p className="text-blue-400 mt-0.5">
                {'<script src='}
                <span className="text-green-400">"https://provadorvirtual.ai/widget.js"</span>
                {'>'}
                {'</script>'}
              </p>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            2 linhas de código. Funciona em qualquer plataforma.
          </p>
        </div>
      </div>
    </section>
  );
}
