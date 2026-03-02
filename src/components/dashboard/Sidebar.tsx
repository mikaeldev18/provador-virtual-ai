'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  Sparkles, LayoutDashboard, Code2, CreditCard, BarChart3,
  LogOut, ChevronRight, HelpCircle, Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/embed', label: 'Implementação', icon: Code2 },
  { href: '/dashboard/billing', label: 'Fatura e Plano', icon: CreditCard },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

interface SidebarProps {
  storeName?: string;
  storeId?: string;
  subscriptionStatus?: string;
}

export default function Sidebar({ storeName, storeId, subscriptionStatus }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-base">
            Provador<span className="text-brand-600">Virtual</span>AI
          </span>
        </Link>

        {/* Store info */}
        {storeName && (
          <div className="mt-3 p-2.5 rounded-lg bg-gray-50 border border-gray-100">
            <div className="text-xs font-semibold text-gray-900 truncate">{storeName}</div>
            <div className="text-[10px] text-gray-400 font-mono mt-0.5">{storeId}</div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <div
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  subscriptionStatus === 'active' ? 'bg-green-500' : 'bg-red-400'
                )}
              />
              <span className="text-[10px] text-gray-500">
                {subscriptionStatus === 'active' ? 'Plano ativo' : 'Plano inativo'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-brand-50 text-brand-700 border border-brand-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-brand-500" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link
          href="/docs"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <HelpCircle className="w-4 h-4" />
          Ajuda e suporte
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
