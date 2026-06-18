'use client';

import { useActionState } from 'react';
import { loginAction } from '@/actions/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction as any, null);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Área Restrita</h1>
          <p className="text-gray-500 mt-2 text-sm">Painel Administrativo da Vitrine</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha de Acesso
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {state?.error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 flex justify-center"
          >
            {pending ? (
              <span className="animate-pulse">Autenticando...</span>
            ) : (
              'Entrar no Painel'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-pink-600 hover:text-pink-700 font-medium">
            &larr; Voltar para a loja
          </Link>
        </div>
      </div>
    </div>
  );
}
