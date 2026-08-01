import React from 'react';

export default function Select({ label, error, className = '', containerClassName = '', children, ...props }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <select
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-800
          transition-smooth appearance-none
          ${error ? 'border-danger focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus-ring'}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
