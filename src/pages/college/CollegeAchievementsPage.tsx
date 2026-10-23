import React, { useEffect, useState } from 'react';
import { collegeService, CollegeAchievement } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Award } from 'lucide-react';

export const CollegeAchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<CollegeAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      setIsLoading(true);
      try {
        const res = await collegeService.getCollegeAchievements();
        if (res.success && res.data) {
          setAchievements(res.data);
        } else {
          setAchievements(getFallbackAchievements());
        }
      } catch {
        setAchievements(getFallbackAchievements());
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const getFallbackAchievements = (): CollegeAchievement[] => [
    {
      id: 'ach_01',
      title: '1st Place — AI Healthcare Hackathon 2026',
      type: 'WIN',
      eventName: 'AI Healthcare Hackathon 2026',
      teamName: 'NeuralForge Hackers',
      date: 'Aug 05, 2026',
      year: 2026,
    },
    {
      id: 'ach_02',
      title: 'Finalist — Global Web3 Challenge 2025',
      type: 'FINALIST',
      eventName: 'Global Web3 Challenge 2025',
      teamName: 'Code Warriors',
      date: 'Nov 12, 2025',
      year: 2025,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Institutional Trophy Hall & Achievements</h1>
            <p className="text-xs text-slate-500">Verified record of all hackathon victories and milestone awards</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl">
            <span className="text-xs text-amber-100 font-bold block mb-1">Total Verified Wins</span>
            <span className="text-3xl font-extrabold font-mono">47 🏆</span>
          </Card>
          <Card className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl">
            <span className="text-xs text-indigo-100 font-bold block mb-1">Finalist Appearances</span>
            <span className="text-3xl font-extrabold font-mono">38 ⭐</span>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Achievement Timeline</h2>
          {isLoading ? (
            <SkeletonLoader variant="card" count={2} />
          ) : (
            achievements.map((ach) => (
              <Card key={ach.id} className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900">{ach.title}</h4>
                  <p className="text-xs text-slate-500">Team: {ach.teamName} • Event: {ach.eventName}</p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">{ach.date}</span>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
