import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, iconBg, iconColor }) {
  return (
    <div className="group bg-white rounded-2xl p-5 shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-smooth border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2 tracking-tight">{value}</p>
          {trend && <p className="text-xs text-slate-400 mt-2">{trend}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} group-hover:scale-105 transition-smooth`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
    </div>
  );
}
