import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, description, trend }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start justify-between">
      <div className="space-y-2">
        <span className="text-sm font-semibold text-slate-500">{title}</span>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
        {description && <p className="text-xs text-slate-400 font-medium">{description}</p>}
      </div>
      <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
        {icon}
      </div>
    </div>
  );
};
