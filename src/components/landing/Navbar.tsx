'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-600">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">
              Provador<span className="text-brand-600">Virtual</span>AI
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona" className="text-sm text-gray-600 hover:text-gray-900 transition">Como funciona</a>
            <a href="#funcionalidades" className="text-sm text-gray-600 hover:text-gray-900 transition">Funcionalidades</a>
            <a href="#preco" className="text-sm text-gray-600 hover:text-gray-900 transition">Preço</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Entrar
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm py-2 px-5">
              Começar grátis
            </Link>
          </div>

          {/* Mobile menu */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <a href="#como-funciona" onClick={() => setOpen(false)} className="block text-sm text-gray-600 py-2">Como funciona</a>
          <a href="#funcionalidades" onClick={() => setOpen(false)} className="block text-sm text-gray-600 py-2">Funcionalidades</a>
          <a href="#preco" onClick={() => setOpen(false)} className="block text-sm text-gray-600 py-2">Preço</a>
          <div className="flex gap-3 pt-2">
            <Link href="/auth/login" className="btn-outline flex-1 text-center">Entrar</Link>
            <Link href="/auth/signup" className="btn-primary flex-1 text-center">Começar grátis</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
