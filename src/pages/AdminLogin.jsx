import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
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
          navigate('/admin');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between p-4 sm:p-6 font-sans">
      
      {/* Top Header Navigation */}
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-4">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Website</span>
        </Link>
      </header>

      {/* Main Authentication Card */}
      <main className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 relative overflow-hidden">
          
          {/* Subtle gold accent top bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C59B27]/40 via-[#C59B27] to-[#C59B27]/40" />

          {/* Official Brand Logo & Header */}
          <div className="text-center mb-7 pt-2">
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center p-2 mx-auto mb-3">
              <img
                src="/logo.png"
                onError={(e) => { e.currentTarget.src = "/logo-icon.svg"; }}
                alt="GrabMyKey"
                className="w-full h-full object-contain"
              />
            </div>

            <div
              className="text-xl font-extrabold tracking-tight font-serif leading-none flex items-center justify-center gap-1 text-slate-900"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              <span>GRAB</span>
              <span className="text-[#C59B27]">MY</span>
              <span>KEY</span>
            </div>
            <span className="text-[9px] font-bold text-[#C59B27] uppercase tracking-widest font-sans leading-tight mt-1 block">
              YOUR TRUSTED REAL ESTATE PARTNER
            </span>

            <h1 className="text-xl font-bold text-slate-900 mt-5">
              Admin Sign In
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Sign in to your administrative account to manage properties, leads, and console settings.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="admin@grabmykey.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 bg-white text-[#C59B27] focus:ring-[#C59B27]/30 cursor-pointer"
                />
                <span>Keep me signed in</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 cursor-pointer mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C59B27]" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Navigation to Signup */}
          <div className="mt-7 pt-5 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              Need administrator access?{' '}
              <Link
                to="/admin/signup"
                className="font-semibold text-[#B8860B] hover:text-[#9A7007] underline underline-offset-4 transition-colors"
              >
                Create Admin Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-xs text-slate-500">
        © 2026 GrabMyKey. Authorized administrative personnel only.
      </footer>
    </div>
  );
}
