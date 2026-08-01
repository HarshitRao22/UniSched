import React from 'react';

const PALETTE = [
  { bg: 'bg-primary-50', text: 'text-primary-700' },
  { bg: 'bg-accent-50', text: 'text-accent-700' },
  { bg: 'bg-amber-50', text: 'text-amber-700' },
  { bg: 'bg-rose-50', text: 'text-rose-700' },
  { bg: 'bg-sky-50', text: 'text-sky-700' },
  { bg: 'bg-violet-50', text: 'text-violet-700' },
];

// Deterministically maps a label to a color so the same department/branch
// always gets the same badge color across the app.
function colorFor(label = '') {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash * 31 + label.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function Badge({ children, color }) {
  const palette = color || colorFor(String(children));
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${palette.bg} ${palette.text}`}>
      {children}
    </span>
  );
}
