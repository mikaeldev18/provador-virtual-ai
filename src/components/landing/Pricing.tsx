import Link from 'next/link';
import { Check, ArrowRight, Zap } from 'lucide-react';

const includes = [
  '100 usos de provador virtual por mês',
  'Dashboard de analytics completo',
  'Código embed pronto para usar',
  'Rastreamento de conversões',
  'Integração com qualquer plataforma',
  'Suporte por WhatsApp e email',
  'Usos extras: R$0,10 cada',
  'Pagamento via PIX, cartão ou boleto',
  'Cancele quando quiser',
];

export default function Pricing() {
  return (
    <section id="preco" className="py-20 md:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span className="inline-block text-brand-600 font-semibold text-sm uppercase tracking-wide mb-3">
            Preço
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Simples e transparente
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Um plano único. Sem surpresas. Pague apenas o plano base + usos extras que usar.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {/* Main pricing card */}
          <div className="relative card border-2 border-brand-500 shadow-xl shadow-brand-100">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                <Zap className="w-3 h-3" />
                Plano Básico
              </span>
            </div>

            <div className="text-center py-4">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-sm font-medium text-gray-500">R$</span>
                <span className="text-6xl font-black text-gray-900">19</span>
                <span className="text-3xl font-black text-gray-900">,90</span>
                <span className="text-sm text-gray-500">/mês</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Cobrado mensalmente. Cancele a qualquer momento.
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6 mt-2">
              <ul className="space-y-3">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/auth/signup" className="btn-primary w-full mt-8 py-4 text-base">
              Começar agora
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-3">
              7 dias de teste gratuito. Sem cartão obrigatório para começar.
            </p>
          </div>

          {/* ROI calculator */}
          <div className="mt-8 bg-gradient-to-br from-brand-50 to-pink-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="font-bold text-gray-900 mb-3">Calcule seu ROI</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>100 usos/mês × 3% conversão = <strong>3 vendas</strong></span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Ticket médio R$150 × 3 vendas</span>
                <strong className="text-green-600">+R$450</strong>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Custo total do plano</span>
                <strong className="text-red-500">-R$19,90</strong>
              </div>
              <div className="border-t border-brand-200 pt-2 mt-2 flex justify-between font-bold text-base">
                <span className="text-gray-900">ROI estimado</span>
                <span className="text-green-600">+2.260%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
