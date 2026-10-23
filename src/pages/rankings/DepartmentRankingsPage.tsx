import React, { useEffect, useState } from 'react';
import { rankingService, DepartmentRanking } from '@/services/api/rankingService';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Award } from 'lucide-react';

export const DepartmentRankingsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepts = async () => {
      setIsLoading(true);
      try {
        const res = await rankingService.getDepartmentRankings();
        if (res.success && res.data) {
          setDepartments(res.data);
        } else {
          setDepartments(getFallbackDepts());
        }
      } catch {
        setDepartments(getFallbackDepts());
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepts();
  }, []);

  const getFallbackDepts = (): DepartmentRanking[] => [
    {
      rank: 1,
      departmentName: 'Computer Science & Engineering',
      collegeName: 'ABC Engineering College',
      totalStudents: 450,
      eventsParticipated: 84,
      wins: 21,
      finalists: 18,
      score: 4850,
    },
    {
      rank: 2,
      departmentName: 'Information Technology',
      collegeName: 'ABC Engineering College',
      totalStudents: 320,
      eventsParticipated: 67,
      wins: 15,
      finalists: 12,
      score: 3620,
    },
  ];

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Award className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Department Performance Rankings</h1>
          <p className="text-xs text-slate-500">Departmental breakdown of hackathon achievements and events</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : (
          departments.map((d) => (
            <Card key={d.departmentName} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 border border-brand-200 text-brand-700 font-extrabold rounded-2xl flex items-center justify-center text-sm">
                  #{d.rank}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{d.departmentName}</h4>
                  <p className="text-xs text-slate-500">{d.collegeName} • {d.totalStudents} Students enrolled</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Events</span>
                  <span className="font-extrabold text-slate-900">{d.eventsParticipated}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Wins</span>
                  <span className="font-extrabold text-amber-600">{d.wins}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Score</span>
                  <span className="font-extrabold text-brand-600 font-mono">{d.score} pts</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
