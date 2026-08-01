import React, { createContext, useCallback, useContext, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

const ICONS = {
  success: FiCheckCircle,
  error: FiXCircle,
  warning: FiAlertTriangle,
  info: FiInfo,
};

const STYLES = {
  success: 'bg-white border-l-4 border-accent-500 text-slate-800',
  error: 'bg-white border-l-4 border-danger text-slate-800',
  warning: 'bg-white border-l-4 border-warning text-slate-800',
  info: 'bg-white border-l-4 border-primary-500 text-slate-800',
};

const ICON_COLORS = {
  success: 'text-accent-500',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-primary-500',
};

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }, [dismiss]);

  const toast = {
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    warning: (msg) => showToast(msg, 'warning'),
    info: (msg) => showToast(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto animate-slideUp flex items-start gap-3 rounded-xl px-4 py-3 shadow-elevated ${STYLES[t.type]}`}
            >
              <Icon size={18} className={`mt-0.5 flex-shrink-0 ${ICON_COLORS[t.type]}`} />
              <p className="text-sm font-medium leading-snug flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-slate-400 hover:text-slate-600 transition-smooth flex-shrink-0"
              >
                <FiX size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
