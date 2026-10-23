import React, { useEffect, useState } from 'react';
import { collegeService, CollegeTeamRecord } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card, Badge } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Users2 } from 'lucide-react';

export const CollegeTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<CollegeTeamRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const res = await collegeService.getCollegeTeams();
        if (res.success && res.data) {
          const teamList: CollegeTeamRecord[] = (res.data as any).teams || [];
          setTeams(teamList);
        } else {
          setTeams([]);
        }
      } catch {
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Users2 className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Institutional Teams Roster</h1>
            <p className="text-xs text-slate-500">View cross-department and cross-college teams created by students</p>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <SkeletonLoader variant="card" count={2} />
          ) : teams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
              <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 mb-1">No Team Records</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active or completed student teams registered for this institution yet.
              </p>
            </div>
          ) : (
            teams.map((t) => (
              <Card key={t.teamId} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{t.teamName}</h4>
                    <Badge variant="primary">{(t.departmentMix || 'ACTIVE').replace(/_/g, ' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">Event: <strong className="text-slate-800">{t.eventName || t.eventTitle || 'Hackathon Event'}</strong> • Members: {t.membersCount || 1}</p>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-600 font-extrabold">{t.result || 'Registered'}</span>
                  <span className="text-slate-400">• {t.status || 'Active'}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
