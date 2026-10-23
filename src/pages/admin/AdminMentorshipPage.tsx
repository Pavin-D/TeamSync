import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Cards';
import { UserCheck } from 'lucide-react';

export const AdminMentorshipPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mentorship & Employee ID Verification</h1>
            <p className="text-xs text-slate-500">Verify working professional credentials and monitor mentorship programs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Active Verified Mentors</span>
            <span className="text-2xl font-extrabold text-brand-600 font-mono">320</span>
          </Card>
          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Pending ID Verifications</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono">14</span>
          </Card>
          <Card className="p-5 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Completed Sessions</span>
            <span className="text-2xl font-extrabold text-emerald-600 font-mono">1,420</span>
          </Card>
        </div>
      </main>
    </div>
  );
};
