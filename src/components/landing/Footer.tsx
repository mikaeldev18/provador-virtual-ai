import Link from 'next/link';
import { Sparkles, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Provador<span className="text-brand-400">Virtual</span>AI
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Provador virtual com IA para lojas de moda online. Mais conversão, menos devolução.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#como-funciona" className="hover:text-white transition">Como funciona</a></li>
              <li><a href="#funcionalidades" className="hover:text-white transition">Funcionalidades</a></li>
              <li><a href="#preco" className="hover:text-white transition">Preço</a></li>
              <li><Link href="/auth/signup" className="hover:text-white transition">Cadastrar loja</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/docs" className="hover:text-white transition">Documentação</Link></li>
              <li><Link href="/docs/embed" className="hover:text-white transition">Guia de integração</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/status" className="hover:text-white transition">Status do serviço</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:suporte@provadorvirtual.ai" className="flex items-center gap-2 hover:text-white transition">
                  <Mail className="w-3.5 h-3.5" />
                  suporte@provadorvirtual.ai
                </a>
              </li>
              <li>
                <a href="https://wa.me/5511999999999" className="flex items-center gap-2 hover:text-white transition">
                  <MessageCircle className="w-3.5 h-3.5" />
                  WhatsApp
                </a>
              </li>
              <li><Link href="/termos" className="hover:text-white transition">Termos de uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-white transition">Privacidade</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <span>© 2025 ProvadorVirtualAI. Todos os direitos reservados.</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Todos os sistemas operando
            </span>
            <span>Pagamentos via Abacate Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
