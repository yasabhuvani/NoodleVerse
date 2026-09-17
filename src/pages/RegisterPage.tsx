import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await register(name, email, password);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl block mb-2">🥢</span>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Join NoodleVerse to discover authentic ramen and craft your custom bowls.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm font-bold text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                id="register-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="email"
                id="register-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Password (min 6 chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="password"
                id="register-password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-sm font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            id="register-submit-btn"
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-sm text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              loading
                ? 'bg-stone-400 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 active:scale-95 shadow-orange-600/25'
            }`}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-stone-500">
          Already registered?{' '}
          <Link to={`/login?redirect=${redirect}`} className="font-bold text-orange-600 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
