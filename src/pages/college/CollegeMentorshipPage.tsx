import React, { useEffect, useState } from 'react';
import { collegeService, CollegeMentorshipMetrics } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card } from '@/components/ui/Cards';
import { GraduationCap } from 'lucide-react';

export const CollegeMentorshipPage: React.FC = () => {
  const [metrics, setMetrics] = useState<CollegeMentorshipMetrics | null>(null);

  useEffect(() => {
    const fetchMentorship = async () => {
      try {
        const res = await collegeService.getMentorshipAnalytics();
        if (res.success && res.data) {
          setMetrics(res.data);
        } else {
          setMetrics({
            activeMentors: 0,
            studentsMentored: 0,
            activeMentorships: 0,
            completedMentorships: 0,
            byDepartment: [],
          });
        }
      } catch {
        setMetrics({
          activeMentors: 0,
          studentsMentored: 0,
          activeMentorships: 0,
          completedMentorships: 0,
          byDepartment: [],
        });
      }
    };

    fetchMentorship();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Institutional Mentorship Program</h1>
            <p className="text-xs text-slate-500">Track professional mentors connected with your students across departments</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Active Professional Mentors</span>
            <span className="text-xl font-extrabold text-brand-600 font-mono">{metrics?.activeMentors}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Students Mentored</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">{metrics?.studentsMentored}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Active Sessions</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono">{metrics?.activeMentorships}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Completed Mentorships</span>
            <span className="text-xl font-extrabold text-indigo-600 font-mono">{metrics?.completedMentorships}</span>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card className="p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mentorship by Department</h3>
          <div className="space-y-2">
            {metrics?.byDepartment.map((d) => (
              <div key={d.department} className="p-3 bg-slate-50 rounded-xl flex justify-between text-xs">
                <span className="font-bold text-slate-800">{d.department}</span>
                <span className="font-extrabold text-brand-600">{d.studentsCount} Students Mentored</span>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};
