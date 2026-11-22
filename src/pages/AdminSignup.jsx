import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck, User, Mail, Lock, KeyRound, Eye, EyeOff,
  ArrowLeft, Check, AlertCircle, Loader2
} from 'lucide-react';
import { adminSignup } from '../api';

export default function AdminSignup({ onSignupSuccess }) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteKey, setInviteKey] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Not Entered', color: 'bg-slate-700' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 4) return { score: 3, label: 'Strong', color: 'bg-[#C59B27]', width: 'w-3/4' };
    return { score: 4, label: 'Executive Grade', color: 'bg-emerald-500', width: 'w-full' };
  }, [password]);

  // Real-time password match verification
  const isMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full administrative name.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Please provide a valid administrative email.');
      return;
    }
    if (password.length < 8) {
      setErrorMessage('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify both fields.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await adminSignup({
        name: name.trim(),
        email: email.trim(),
        password,
        inviteKey: inviteKey.trim()
      });

      if (res?.success && res.token) {
        setSuccessMessage('Administrator profile established successfully. Redirecting...');
        setTimeout(() => {
          if (onSignupSuccess) {
            onSignupSuccess(res.admin, res.token);
          } else {
            navigate('/manage-345');
          }
        }, 1200);
      } else {
        setErrorMessage(res?.message || 'Registration failed. Please check your credentials.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration service encountered an error.';
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
          <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse"></span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
            Invite-Gated Registration
          </span>
        </div>
      </header>

      {/* Main Signup Form Card */}
      <main className="w-full max-w-lg mx-auto my-auto py-8">
        <div className="bg-[#0D1829]/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Subtle gold luxury ambient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B27] to-transparent opacity-80" />

          {/* Brand & Crest Header */}
          <div className="text-center mb-7">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#13233D] to-[#0A1424] border border-[#C59B27]/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-black/40">
              <ShieldCheck className="w-7 h-7 text-[#C59B27]" />
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.15em] text-white">
              GRABMYKEY
            </h1>

            <div className="inline-flex items-center space-x-1.5 mt-2 px-3 py-1 rounded-full bg-[#C59B27]/10 border border-[#C59B27]/30 text-[#C59B27] text-[10px] font-bold tracking-widest uppercase font-mono">
              <span>ADMIN PORTAL • EXECUTIVE REGISTRATION</span>
            </div>

            <p className="text-xs text-slate-400 mt-3 max-w-sm mx-auto leading-relaxed">
              Create an authorized administrative profile to manage Mangaluru real estate inventory, legal checklists, and inbound acquisitions.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center space-x-2.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Full Administrative Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Executive Administrator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-sans"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Official Administrative Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@grabmykey.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-sans"
                />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              
              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Master Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full bg-[#08101E] border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-sans ${
                      isMatch === false
                        ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                        : isMatch === true
                        ? 'border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        : 'border-slate-700/80 focus:border-[#C59B27]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength Indicator & Match Badge */}
            {password && (
              <div className="p-3 bg-[#08101E] rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Password Strength:</span>
                  <span className="font-semibold text-white font-mono">{passwordStrength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                </div>
                
                {confirmPassword && (
                  <div className="flex items-center space-x-1.5 pt-1 text-[11px]">
                    {isMatch ? (
                      <span className="text-emerald-400 flex items-center space-x-1 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        <span>Passwords match securely</span>
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center space-x-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Passwords do not match</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Admin Invite / Secret Key */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300">
                  Administrative Invite / Secret Key
                </label>
                <span className="text-[10px] text-[#C59B27] font-mono">
                  Default: GMK-ADMIN-2026
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter authorized key (e.g., GMK-ADMIN-2026)"
                  value={inviteKey}
                  onChange={(e) => setInviteKey(e.target.value)}
                  className="w-full bg-[#08101E] border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27]/40 transition-all font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 block leading-tight">
                Required to authorize new administrative profiles. Contact superadmin if you need an access key.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || (confirmPassword && !isMatch)}
              className="w-full bg-gradient-to-r from-[#B8860B] via-[#C59B27] to-[#D4AF37] hover:brightness-110 active:brightness-95 disabled:opacity-50 text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-black/40 flex items-center justify-center space-x-2 cursor-pointer mt-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Profile...</span>
                </>
              ) : (
                <span>Initialize Administrator Profile</span>
              )}
            </button>
          </form>

          {/* Navigation to Login */}
          <div className="mt-7 pt-5 border-t border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Already hold an executive profile?{' '}
              <Link
                to="/admin/login"
                className="font-bold text-[#C59B27] hover:text-[#e0b945] underline underline-offset-4 transition-colors"
              >
                Sign in to Admin Portal →
              </Link>
            </p>

            <p className="text-[10px] text-slate-500 font-mono">
              Strict RBAC Protocol • GrabMyKey Mangaluru Operations Suite
            </p>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-[11px] text-slate-500 font-mono">
        © 2026 GrabMyKey. Authorized administrative registration portal.
      </footer>
    </div>
  );
}
