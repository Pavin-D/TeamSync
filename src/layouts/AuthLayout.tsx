import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-accent-600 text-white shadow-card mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">TeamSync</h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">Smart Team Formation System</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-modal rounded-2xl border border-slate-200/80 sm:px-10 text-left">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
