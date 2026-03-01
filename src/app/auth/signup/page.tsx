'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Sparkles, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
    storeUrl: '',
  });

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.storeName || !form.storeUrl) {
      toast.error('Preencha todos os campos');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Senha deve ter ao menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Erro ao criar conta');
        return;
      }

      // Auto-login após cadastro e redireciona para o dashboard
      const login = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (login?.ok) {
        toast.success('Conta criada! Bem-vindo ao Provador Virtual AI!');
        router.push('/dashboard');
      } else {
        toast.success('Conta criada com sucesso!');
        router.push('/auth/login');
      }
    } catch {
      toast.error('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/50 via-white to-pink-50/30 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Criar sua conta</h1>
          <p className="mt-2 text-gray-500 text-sm">
            Configure o provador virtual para sua loja em minutos
          </p>
        </div>

        {/* Benefits strip */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-6 flex flex-wrap gap-x-4 gap-y-1 justify-center">
          {['Acesso imediato', '100 usos inclusos', 'Configure em minutos'].map((b) => (
            <span key={b} className="flex items-center gap-1.5 text-xs text-brand-700 font-medium">
              <Check className="w-3.5 h-3.5" /> {b}
            </span>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Seu nome</label>
              <input
                type="text"
                placeholder="João Silva"
                className="input-field"
                value={form.name}
                onChange={set('name')}
                required
              />
            </div>
            <div>
              <label className="label">Nome da loja</label>
              <input
                type="text"
                placeholder="Minha Loja"
                className="input-field"
                value={form.storeName}
                onChange={set('storeName')}
                required
              />
            </div>
          </div>

          <div>
            <label className="label">URL da loja</label>
            <input
              type="url"
              placeholder="https://minhaloja.com.br"
              className="input-field"
              value={form.storeUrl}
              onChange={set('storeUrl')}
              required
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="joao@minhaloja.com.br"
              className="input-field"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div>
            <label className="label">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                className="input-field pr-10"
                value={form.password}
                onChange={set('password')}
                required
                minLength={6}
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
            className="btn-primary w-full py-3.5 text-base mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Criando conta...
              </span>
            ) : (
              <>
                Criar conta e ativar plano
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Ao criar uma conta você concorda com os{' '}
            <Link href="/termos" className="text-brand-600 hover:underline">Termos de uso</Link>{' '}
            e{' '}
            <Link href="/privacidade" className="text-brand-600 hover:underline">Política de privacidade</Link>.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Já tem uma conta?{' '}
          <Link href="/auth/login" className="text-brand-600 font-semibold hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
