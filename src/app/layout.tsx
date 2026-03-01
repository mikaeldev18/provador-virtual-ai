import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import AuthSessionProvider from '@/components/providers/AuthSessionProvider';

export const metadata: Metadata = {
  title: 'ProvadorVirtualAI – Provador Virtual IA para Lojas de Moda',
  description:
    'Adicione um provador virtual com Inteligência Artificial à sua loja de roupas. Clientes experimentam peças virtualmente, aumentando conversão e reduzindo devoluções.',
  keywords: 'provador virtual, IA, moda, e-commerce, try-on, inteligência artificial',
  openGraph: {
    title: 'ProvadorVirtualAI',
    description: 'Provador virtual IA para lojas de moda online',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthSessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#db2777', secondary: '#fff' } },
            }}
          />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
