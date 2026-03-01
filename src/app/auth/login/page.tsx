'use client';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, Eye, EyeOff, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Email ou senha incorretos');
        return;
      }

      toast.success('Login realizado!');
      const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/50 via-white to-pink-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-xl">
              Provador<span className="text-brand-600">Virtual</span>AI
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Entrar na sua conta</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Acesse seu dashboard e gerencie o provador virtual
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="joao@minhaloja.com.br"
              className="input-field"
              value={form.email}
              onChange={set('email')}
              required
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Senha</label>
              <Link href="/auth/forgot-password" className="text-xs text-brand-600 hover:underline">
                Esqueci a senha
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                className="input-field pr-10"
                value={form.password}
                onChange={set('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </span>
            ) : (
              <>
                Entrar no dashboard
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Não tem uma conta?{' '}
          <Link href="/auth/signup" className="text-brand-600 font-semibold hover:underline">
            Cadastrar loja
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
