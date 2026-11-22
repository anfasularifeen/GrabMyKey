import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { adminLogin } from '../api';

export default function AdminLogin({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your administrative email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your administrator password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminLogin(email.trim(), password);
      if (res?.success && res.token) {
        if (onLoginSuccess) {
          onLoginSuccess(res.admin, res.token);
        } else {
          navigate('/manage-345');
        }
      } else {
        setErrorMessage(res?.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Authentication service unavailable. Please check your credentials.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(197,155,39,0.15),rgba(255,255,255,0))] text-slate-100 flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header Navigation */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between py-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>

        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Encrypted Session
          </span>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#0D1829]/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle gold luxury ambient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B27] to-transparent opacity-80" />

          {/* Brand & Crest Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#13233D] to-[#0A1424] border border-[#C59B27]/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/40">
              <ShieldCheck className="w-7 h-7 text-[#C59B27]" />
            </div>
            
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white">
              GRABMYKEY
            </h1>
            
            <div className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 rounded-full bg-[#C59B27]/10 border border-[#C59B27]/30 text-[#C59B27] text-[10px] font-bold tracking-widest uppercase font-mono">
              <span>ADMIN PORTAL • EXECUTIVE ACCESS</span>
            </div>
            
            <p className="text-xs text-slate-400 mt-3 max-w-xs mx-auto leading-relaxed">
              Sign in with your verified administrative credentials to access the central portfolio command suite.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-800/80 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Administrative Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="admin@grabmykey.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-sans tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-700 bg-[#08101E] text-[#C59B27] focus:ring-0 cursor-pointer"
                />
                <span>Remember session on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#B8860B] via-[#C59B27] to-[#D4AF37] hover:brightness-110 active:brightness-95 disabled:opacity-60 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-black/40 flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Authenticate & Access Console</span>
              )}
            </button>
          </form>

          {/* Navigation to Signup */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center space-y-3">
            <p className="text-xs text-slate-400">
              Need administrative clearance?{' '}
              <Link
                to="/admin/signup"
                className="font-bold text-[#C59B27] hover:text-[#e0b945] underline underline-offset-4 transition-colors"
              >
                Register an Admin Profile →
              </Link>
            </p>

            <p className="text-[10px] text-slate-500 font-mono">
              Mangaluru Luxury Real Estate Portfolio • Strict RBAC Protection
            </p>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-[11px] text-slate-500 font-mono">
        © 2026 GrabMyKey. Authorized administrative personnel only.
      </footer>
    </div>
  );
}

