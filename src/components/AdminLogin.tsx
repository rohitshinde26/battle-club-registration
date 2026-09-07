import React, { useState } from 'react';
import { Lock, Mail, Key, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';
import { adminSignIn } from '../firebase';

interface AdminLoginProps { 
  onLoginSuccess: () => void;
  onBackToUserSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToUserSite }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await adminSignIn(email, password);
      // onLoginSuccess is a no-op safety call here; real state change comes from
      // the onAuthStateChanged listener in App.tsx once Firebase confirms the session.
      onLoginSuccess();
    } catch (err: any) {
      setError('Invalid admin credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-[#0f172a]/95 border border-amber-500/30 rounded-3xl shadow-2xl relative overflow-hidden" id="admin-login-modal">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="text-center space-y-3 mb-6">
        <div className="flex justify-center">
          <Logo size="lg" showText={false} />
        </div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-tech font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Restricted Access</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
            ADMIN PORTAL LOGIN
          </h2>
          <p className="text-xs text-slate-400">
            Sign in with authorized administrator credentials to manage tournament bookings
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Email</span>
          </label>
          <input
            type="email"
            required
            id="admin-email-input"
            placeholder="literoom0101@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Password</span>
          </label>
          <input
            type="password"
            required
            id="admin-password-input"
            placeholder="••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          id="btn-admin-submit-login"
          className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-bold text-sm tracking-wider uppercase shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>Authenticate & Enter</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onBackToUserSite}
          className="text-slate-400 hover:text-white transition-colors"
        >
          &larr; Back to Public Registration
        </button>
        <span className="text-[11px] text-slate-400 font-tech">Secure Session</span>
      </div>
    </div>
  );
};
