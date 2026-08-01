import React from 'react';

export default function Spinner({ size = 28, label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div
        className="spinner border-slate-200 border-t-primary-600"
        style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      />
      {label && <p className="text-sm text-slate-400">{label}</p>}
    </div>
  );
}
