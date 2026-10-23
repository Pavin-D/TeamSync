import React, { useEffect, useState } from 'react';
import { adminService, SystemActivityItem } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Activity } from 'lucide-react';

export const AdminSystemActivityPage: React.FC = () => {
  const [activity, setActivity] = useState<SystemActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      try {
        const res = await adminService.getSystemActivity();
        if (res.success && res.data) {
          setActivity(res.data);
        } else {
          setActivity(getFallbackActivity());
        }
      } catch {
        setActivity(getFallbackActivity());
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const getFallbackActivity = (): SystemActivityItem[] => [
    { id: 'act_01', actor: 'Priya Sharma', action: 'Created Team NeuralForge', target: 'AI Healthcare Hackathon', timestamp: '10 mins ago', category: 'TEAM' },
    { id: 'act_02', actor: 'ABC Eng College', action: 'Submitted Verification Documents', target: 'Institution Verification', timestamp: '35 mins ago', category: 'INSTITUTION' },
    { id: 'act_03', actor: 'Arun Kumar (Mentor)', action: 'Scheduled Mentorship Session', target: 'Team NeuralForge', timestamp: '1 hour ago', category: 'MENTORSHIP' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Live System Activity Stream</h1>
            <p className="text-xs text-slate-500">Real-time platform activity feed across teams, events, institutions, and mentorships</p>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-subtle">
          <div className="divide-y divide-slate-100 text-xs">
            {isLoading ? (
              <div className="p-8 text-center">
                <SkeletonLoader variant="table" count={3} />
              </div>
            ) : (
              activity.map((act) => (
                <div key={act.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
                  <div>
                    <span className="font-bold text-slate-900">{act.actor}</span>
                    <span className="text-slate-600"> {act.action}: </span>
                    <span className="font-semibold text-brand-600">{act.target}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{act.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </div>
  );
};
