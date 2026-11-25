import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Mail, Lock, KeyRound, Eye, EyeOff,
  ArrowLeft, Check, AlertCircle, Loader2, Clock, CheckCircle2
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
  const [showInviteKey, setShowInviteKey] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: 'Not Entered', color: 'bg-slate-200' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score <= 4) return { score: 3, label: 'Strong', color: 'bg-[#C59B27]', width: 'w-3/4' };
    return { score: 4, label: 'Very Strong', color: 'bg-emerald-600', width: 'w-full' };
  }, [password]);

  // Real-time password match verification
  const isMatch = useMemo(() => {
    if (!confirmPassword) return null;
    return password === confirmPassword;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
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

      if (res?.pendingApproval) {
        setRegisteredEmail(email.trim());
        setIsPendingApproval(true);
      } else if (res?.success && res.token) {
        if (onSignupSuccess) {
          onSignupSuccess(res.admin, res.token);
        } else {
          navigate('/admin');
        }
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

      {/* Main Card */}
      <main className="w-full max-w-lg mx-auto my-auto py-8">
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
              {isPendingApproval ? 'Request Submitted' : 'Create Admin Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
              {isPendingApproval
                ? 'Your registration has been received and is awaiting administrator verification.'
                : 'Register an administrative profile to access the GrabMyKey management console.'}
            </p>
          </div>

          {/* Pending Approval Success State */}
          {isPendingApproval ? (
            <div className="space-y-6 text-center py-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
                <Clock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-base font-semibold text-slate-900">
                  Awaiting Administrator Approval
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                  Your registration request for <strong className="text-slate-800">{registeredEmail}</strong> has been submitted. An existing administrator must approve your account before you can log in.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">What happens next?</div>
                <div>1. An existing administrator will review your account request.</div>
                <div>2. Once approved, you can sign in directly with your email and password.</div>
              </div>

              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center justify-center w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Banner */}
              {errorMessage && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Administrative Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="admin@grabmykey.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Password
                    </label>
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
                        className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-sans tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full bg-slate-50/80 border rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none transition-all font-sans tracking-wider ${
                          isMatch === false
                            ? 'border-red-400 focus:ring-2 focus:ring-red-200'
                            : isMatch === true
                            ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                            : 'border-slate-300 focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Indicator & Match Badge */}
                {password && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Password Strength:</span>
                      <span className="font-semibold text-slate-700">{passwordStrength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`} />
                    </div>
                    
                    {confirmPassword && (
                      <div className="flex items-center space-x-1.5 pt-1 text-xs">
                        {isMatch ? (
                          <span className="text-emerald-700 flex items-center space-x-1 font-medium">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Passwords match</span>
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center space-x-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Passwords do not match</span>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Invite Key */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700">
                      Admin Invite Key
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showInviteKey ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={inviteKey}
                      onChange={(e) => setInviteKey(e.target.value)}
                      className="w-full bg-slate-50/80 border border-slate-300 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#C59B27] focus:ring-2 focus:ring-[#C59B27]/20 transition-all font-mono tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowInviteKey(!showInviteKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                      title={showInviteKey ? 'Hide key' : 'Show key'}
                    >
                      {showInviteKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-500 block leading-tight">
                    Required to authorize new administrative accounts. Contact an administrator if you need an invite key.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || (confirmPassword && !isMatch)}
                  className="w-full bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 cursor-pointer mt-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#C59B27]" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <span>Request Admin Access</span>
                  )}
                </button>
              </form>

              {/* Navigation to Login */}
              <div className="mt-7 pt-5 border-t border-slate-200 text-center">
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to="/admin/login"
                    className="font-semibold text-[#B8860B] hover:text-[#9A7007] underline underline-offset-4 transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="text-center py-4 text-xs text-slate-500">
        © 2026 GrabMyKey. Authorized administrative personnel only.
      </footer>
    </div>
  );
}
