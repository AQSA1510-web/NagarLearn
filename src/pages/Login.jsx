import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserCheck,
  GraduationCap,
  ArrowRight,
  Mountain,
  Flame,
  Users,
  Video,
  Eye,
  EyeOff,
  Loader2,
  Zap,
} from 'lucide-react';

/*
  Theme
  - Brand:   #02c39a
  - Surface: #ffffff
  - Text:    #063b30 (deep shade of the brand green, for readability)
*/

const FEATURES = [
  { icon: Video, title: 'Live classes', text: 'Learn on Zoom and Google Meet from home' },
  { icon: Users, title: 'University mentors', text: 'Students from KIU, NUST, UET and LUMS' },
  { icon: Flame, title: 'Streaks, XP and badges', text: 'Stay motivated as you learn every day' },
];

const inputClass =
  'w-full px-4 py-3 rounded-2xl bg-white border border-[#02c39a]/25 text-sm font-medium text-[#063b30] placeholder:text-[#063b30]/35 focus:outline-none focus:border-[#02c39a] focus:ring-4 focus:ring-[#02c39a]/10 transition-all';

export const Login = ({ onComplete }) => {
  const { loginUser, registerUser, loginDemoUser, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await registerUser(name.trim(), email.trim(), password, role);
      } else {
        await loginUser(email.trim(), password);
      }
      onComplete();
    } catch {
      // Error is shown as a toast by AuthContext
    }
  };

  const handleDemoClick = (demoRole) => {
    loginDemoUser(demoRole);
    onComplete();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 sm:py-10 px-0 sm:px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-5 rounded-3xl bg-white border border-[#02c39a]/15 overflow-hidden shadow-[0_30px_80px_-30px_rgba(6,59,48,0.35)]">

        {/* Brand Panel */}
        <aside className="md:col-span-2 relative overflow-hidden bg-[#02c39a] text-white p-6 sm:p-8 flex flex-col justify-between gap-8">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <svg
            className="absolute bottom-0 left-0 w-full h-28 pointer-events-none"
            viewBox="0 0 1200 200"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 200 L0 150 L160 95 L280 140 L460 45 L560 100 L700 15 L830 110 L960 60 L1080 125 L1200 85 L1200 200 Z"
              fill="#ffffff"
              fillOpacity="0.10"
            />
          </svg>

          <div className="relative">
            <div className="flex items-center gap-3 md:block">
              <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl bg-white text-[#02c39a] flex items-center justify-center md:mb-6">
                <Mountain className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.25} />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Welcome to NagarLearn
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              University students from across Pakistan teaching the youth of Nagar Valley, live and
              free.
            </p>
          </div>

          {/* Features (hidden on phones to keep the form above the fold) */}
          <ul className="relative hidden md:block space-y-3">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 border border-white/20"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-[11px] text-white/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="relative hidden md:block text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
            Nagar Valley, Gilgit-Baltistan
          </p>
        </aside>

        {/* Form Panel */}
        <section className="md:col-span-3 p-6 sm:p-10">

          {/* Demo Access */}
          <div className="p-4 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/20 mb-7">
            <p className="text-xs font-semibold text-[#063b30] mb-3 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#02c39a]" />
              Quick demo access, no password needed
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoClick('student')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white text-[#02c39a] font-semibold text-xs border border-[#02c39a]/30 hover:border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('teacher')}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white text-[#02c39a] font-semibold text-xs border border-[#02c39a]/30 hover:border-[#02c39a] hover:bg-[#02c39a]/5 transition-colors"
              >
                <UserCheck className="w-4 h-4" />
                <span>Mentor</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" className="grid grid-cols-2 p-1 rounded-2xl bg-[#02c39a]/5 border border-[#02c39a]/15 mb-6">
            {[
              { value: false, label: 'Sign In' },
              { value: true, label: 'Create Account' },
            ].map((tab) => {
              const active = isRegister === tab.value;
              return (
                <button
                  key={tab.label}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setIsRegister(tab.value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active ? 'bg-[#02c39a] text-white shadow-sm' : 'text-[#063b30]/60 hover:text-[#02c39a]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label htmlFor="login-name" className="block text-xs font-semibold text-[#063b30]/80 mb-1.5">
                    Full name
                  </label>
                  <input
                    id="login-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Ali Khan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#063b30]/80 mb-1.5">I am joining as</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'student', label: 'Student', icon: GraduationCap, hint: 'I want to learn' },
                      { value: 'teacher', label: 'Mentor', icon: UserCheck, hint: 'I want to teach' },
                    ].map(({ value, label, icon: Icon, hint }) => {
                      const active = role === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setRole(value)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            active
                              ? 'border-[#02c39a] bg-[#02c39a]/5 ring-4 ring-[#02c39a]/10'
                              : 'border-[#02c39a]/20 hover:border-[#02c39a]/50'
                          }`}
                        >
                          <span className={`flex items-center gap-2 text-sm font-semibold ${active ? 'text-[#02c39a]' : 'text-[#063b30]/70'}`}>
                            <Icon className="w-4 h-4" />
                            {label}
                          </span>
                          <span className="block text-[11px] text-[#063b30]/45 mt-0.5">{hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-[#063b30]/80 mb-1.5">
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-[#063b30]/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  placeholder={isRegister ? 'At least 6 characters' : 'Your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#063b30]/40 hover:text-[#02c39a] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-2xl bg-[#02c39a] text-white font-semibold text-sm hover:bg-[#02c39a]/90 shadow-[0_8px_20px_-8px_rgba(2,195,154,0.8)] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isRegister ? 'Creating account' : 'Signing in'}
                </>
              ) : (
                <>
                  {isRegister ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-[#063b30]/55 pt-1">
              {isRegister ? 'Already have an account?' : 'New to NagarLearn?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegister((r) => !r)}
                className="font-semibold text-[#02c39a] hover:underline"
              >
                {isRegister ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};