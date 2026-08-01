import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiUser, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const result = await login(username, password);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left panel - gradient + illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600">
        {/* Decorative abstract shapes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-accent-400/20 blur-3xl" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" />
                <path d="M5 11.5v4.5c0 1.5 3 3.5 7 3.5s7-2 7-3.5v-4.5" stroke="white" strokeWidth="1.6" fill="none" />
              </svg>
            </div>
            <span className="font-semibold text-lg tracking-tight">UniSched</span>
          </div>

          <div>
            <svg viewBox="0 0 400 280" className="w-full max-w-sm mb-10 opacity-90">
              <rect x="40" y="160" width="320" height="14" rx="4" fill="white" fillOpacity="0.18" />
              <rect x="70" y="60" width="90" height="100" rx="10" fill="white" fillOpacity="0.14" />
              <rect x="170" y="30" width="90" height="130" rx="10" fill="white" fillOpacity="0.22" />
              <rect x="270" y="80" width="90" height="80" rx="10" fill="white" fillOpacity="0.14" />
              <rect x="190" y="48" width="50" height="6" rx="3" fill="white" fillOpacity="0.45" />
              <rect x="190" y="62" width="34" height="6" rx="3" fill="white" fillOpacity="0.3" />
              <circle cx="215" cy="100" r="20" fill="white" fillOpacity="0.3" />
              <path d="M205 100l7 7 14-14" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <h1 className="text-[2.25rem] leading-tight font-bold tracking-tight mb-3">
              Smart Exam Scheduling,<br />without the spreadsheet chaos.
            </h1>
            <p className="text-white/75 text-base max-w-sm">
              Manage students, faculty, courses and rooms, then generate a
              conflict-free exam timetable in one click.
            </p>
          </div>

          <p className="text-white/50 text-xs">
            © {new Date().getFullYear()} UniSched · University Examination Management
          </p>
        </div>
      </div>

      {/* Right panel - login card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-surface">
        <div className="w-full max-w-sm animate-slideUp">
          <div className="lg:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" />
              </svg>
            </div>
            <span className="font-semibold text-lg text-slate-800">UniSched</span>
          </div>

          <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-800">Welcome back</h2>
              <p className="text-sm text-slate-500 mt-1">Sign in to your admin account to continue.</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 animate-fadeIn">
                <FiAlertCircle className="text-danger flex-shrink-0" size={17} />
                <p className="text-danger text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm
                      focus-ring transition-smooth"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 bg-white border border-slate-200 rounded-lg text-sm
                      focus-ring transition-smooth"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-smooth"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !username || !password}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300
                  text-white font-medium py-2.5 px-4 rounded-lg transition-smooth
                  flex items-center justify-center gap-2 shadow-soft active:scale-[0.99] mt-2 group"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <FiArrowRight size={16} className="group-hover:translate-x-0.5 transition-smooth" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Demo account &nbsp;
                <span className="font-mono text-slate-500">admin</span> / <span className="font-mono text-slate-500">admin123</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
