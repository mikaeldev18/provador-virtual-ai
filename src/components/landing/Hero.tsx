import Link from 'next/link';
import { ArrowRight, Play, Sparkles, TrendingUp, Users, Zap } from 'lucide-react';

const stats = [
  { label: 'Taxa de conversão', value: '+40%', icon: TrendingUp },
  { label: 'Devoluções reduzidas', value: '-35%', icon: Zap },
  { label: 'Lojas ativas', value: '500+', icon: Users },
];

export default function Hero() {
  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-br from-white via-brand-50/30 to-pink-50/20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-pink-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-2 text-sm text-brand-700 font-medium">
              <Sparkles className="w-4 h-4" />
              Powered by Inteligência Artificial
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                Provador Virtual
                <span className="bg-gradient-to-r from-brand-600 to-pink-500 bg-clip-text text-transparent block">
                  IA para sua loja
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Seus clientes tiram uma foto e a IA sobrepõe a roupa no corpo deles de forma
                realista. <strong className="text-gray-800">Mais conversões. Menos devoluções.</strong>{' '}
                Em minutos na sua loja.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-4">
                Adicionar à minha loja
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#como-funciona" className="btn-secondary text-base px-6 py-4">
                <Play className="w-4 h-4" />
                Ver demo
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: demo widget mockup */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in">
            <div className="relative w-80 md:w-96">
              {/* Phone mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="h-6 bg-gray-900 rounded-t-3xl flex items-center justify-center">
                  <div className="w-20 h-1 bg-gray-700 rounded-full" />
                </div>

                {/* Product page simulation */}
                <div className="bg-gray-50 p-4 space-y-3">
                  <div className="bg-white rounded-xl overflow-hidden aspect-[3/4] relative">
                    {/* Gradient background simulating a dress */}
                    <div className="absolute inset-0 bg-gradient-to-b from-rose-100 to-pink-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl">👗</div>
                        <div className="text-xs text-pink-600 font-medium mt-2">Vestido Floral</div>
                      </div>
                    </div>

                    {/* Widget badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white rounded-xl shadow-lg border border-brand-100 p-2 flex items-center gap-2 cursor-pointer hover:shadow-xl transition">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-gray-900">Experimentar</div>
                          <div className="text-[9px] text-brand-600">Virtual IA</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal preview */}
                  <div className="bg-white rounded-xl p-3 border border-brand-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-brand-600" />
                      <span className="text-xs font-semibold text-gray-900">Provador Virtual IA</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {/* Before */}
                      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                        🤳
                      </div>
                      {/* After */}
                      <div className="aspect-[3/4] bg-gradient-to-b from-rose-50 to-pink-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="text-3xl">🧍</div>
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-100/30" />
                        <div className="absolute bottom-1 right-1 bg-brand-600 rounded-md px-1.5 py-0.5">
                          <span className="text-[8px] text-white font-bold">IA</span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-2 bg-brand-600 text-white text-xs font-semibold py-2 rounded-lg">
                      Comprar agora →
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-lg border border-gray-100 px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-medium text-gray-700">3 usos agora</span>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-brand-600 text-white rounded-xl shadow-lg px-3 py-2">
                <div className="text-xs font-bold">+40% conversão</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
