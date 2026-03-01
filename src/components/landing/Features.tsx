import {
  Sparkles, BarChart3, Code2, Shield, Zap, Globe, RefreshCw, Headphones,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'IA de última geração',
    description:
      'Modelo CatVTON state-of-the-art para sobreposição realista de roupas. Resultado profissional em segundos.',
    color: 'text-brand-600 bg-brand-50',
  },
  {
    icon: Code2,
    title: 'Integração em 2 linhas',
    description:
      'Copie o código embed gerado no cadastro e cole no HTML da sua loja. Zero configuração complexa.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: BarChart3,
    title: 'Dashboard de analytics',
    description:
      'Usos, conversões, receita gerada, custo por uso e ROI em tempo real. Export CSV para análise.',
    color: 'text-purple-600 bg-purple-50',
  },
  {
    icon: Shield,
    title: 'Seguro e privado',
    description:
      'Fotos dos clientes são processadas e descartadas. API key por loja. Rate limiting e autenticação.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Zap,
    title: 'Resposta em segundos',
    description:
      'Processamento ultrarrápido. O cliente vê a imagem gerada em menos de 10 segundos.',
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    icon: Globe,
    title: 'Funciona em qualquer loja',
    description:
      'Shopify, WooCommerce, Nuvemshop, VTEX, Tray, ou HTML puro. Se roda JavaScript, funciona.',
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    icon: RefreshCw,
    title: 'Pay-per-use justo',
    description:
      '100 usos grátis no plano básico. Acima disso, apenas R$0,10 por uso extra. Pague só o que usar.',
    color: 'text-orange-600 bg-orange-50',
  },
  {
    icon: Headphones,
    title: 'Suporte em português',
    description:
      'Suporte humano via WhatsApp e email. Tutoriais em vídeo e documentação completa em PT-BR.',
    color: 'text-pink-600 bg-pink-50',
  },
];

export default function Features() {
  return (
    <section id="funcionalidades" className="py-20 md:py-28 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tudo que sua loja precisa
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Uma plataforma completa para adicionar provador virtual à sua loja sem complicação.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="card hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default"
            >
              <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
