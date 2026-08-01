import React from 'react';

const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-soft disabled:bg-slate-300',
  accent: 'bg-accent-500 hover:bg-accent-600 text-white shadow-soft disabled:bg-slate-300',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 disabled:text-slate-400',
  danger: 'bg-white hover:bg-red-50 text-danger border border-red-200 disabled:text-slate-400',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 disabled:text-slate-400',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-smooth active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
}
