import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Cards';
import { User, ShieldCheck } from 'lucide-react';

export const AdminProfilePage: React.FC = () => {
  const permissions = [
    'VIEW_USERS',
    'MANAGE_USERS',
    'VIEW_INSTITUTIONS',
    'MANAGE_INSTITUTIONS',
    'VIEW_REPORTS',
    'MANAGE_REPORTS',
    'VIEW_EVENTS',
    'MANAGE_EVENTS',
    'VIEW_ANALYTICS',
    'MANAGE_MENTORS',
    'VIEW_AUDIT_LOGS',
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-3xl">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Administrator Profile</h1>
            <p className="text-xs text-slate-500">Super Admin credentials and granted platform permission scope</p>
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Super Administrator</h3>
              <p className="text-xs text-slate-500">admin@platform.org</p>
            </div>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-rose-600" /> Full Access Scope
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Granted Platform Permissions</h4>
            <div className="flex flex-wrap gap-1.5">
              {permissions.map((p) => (
                <span key={p} className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};
