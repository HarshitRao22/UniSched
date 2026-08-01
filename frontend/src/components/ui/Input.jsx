import React from 'react';

export default function Input({ label, icon: Icon, error, className = '', containerClassName = '', ...props }) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        )}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 bg-white border rounded-lg text-sm
            text-slate-800 placeholder:text-slate-400 transition-smooth
            ${error ? 'border-danger focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus-ring'}
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
