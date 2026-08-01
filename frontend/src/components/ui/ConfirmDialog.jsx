import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from './Button';

export default function ConfirmDialog({ open, title = 'Are you sure?', message, onConfirm, onCancel, danger = true }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-elevated animate-scaleIn p-6">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4 ${danger ? 'bg-red-50' : 'bg-primary-50'}`}>
          <FiAlertTriangle size={20} className={danger ? 'text-danger' : 'text-primary-600'} />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1.5">{title}</h3>
        {message && <p className="text-sm text-slate-500 mb-6">{message}</p>}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={danger ? 'danger' : 'primary'} size="sm" onClick={onConfirm}
            className={danger ? '!bg-danger !text-white !border-danger hover:!bg-red-600' : ''}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}
