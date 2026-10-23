import React, { useEffect, useState } from 'react';
import { mentorService } from '@/services/api/mentorService';
import { collegeService, CollegeProfile } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { CollegeParticipationChart } from '@/components/college/CollegeParticipationChart';
import { CollegeWinningChart } from '@/components/college/CollegeWinningChart';
import { Card, Avatar } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { BarChart3, Briefcase, Sparkles } from 'lucide-react';

export const CollegeAnalyticsPage: React.FC = () => {
  const [menteeAnalytics, setMenteeAnalytics] = useState<any | null>(null);
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [menteeRes, profileRes] = await Promise.all([
          mentorService.getStaffMenteeAnalytics(),
          collegeService.getCollegeProfile(),
        ]);

        if (menteeRes.success && menteeRes.data) {
          setMenteeAnalytics(menteeRes.data);
        } else {
          setMenteeAnalytics(null);
        }

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }
      } catch {
        setMenteeAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalMentees = menteeAnalytics?.totalMentees || 0;
  const activeTeams = menteeAnalytics?.activeMenteeTeams || 0;
  const totalWins = menteeAnalytics?.totalMenteeWins || 0;
  const totalParticipations = menteeAnalytics?.totalMenteeParticipations || 0;

  const participationTrend = [
    { year: 2026, students: totalMentees, events: totalParticipations, teams: activeTeams },
  ];

  const winningTrend = [
    { year: 2026, wins: totalWins, finalists: Math.round(totalWins * 1.5) },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-5xl">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-600" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {profile?.collegeName ? `${profile.collegeName} Mentee Analytics` : 'Mentee Real-Time Analytics Hub'}
            </h1>
            <p className="text-xs text-slate-500">Real-time event participation analytics and hackathon metrics for your assigned mentee students only</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : !menteeAnalytics || totalMentees === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Active Mentee Analytics Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Mentee analytics will automatically update in real-time as you accept mentorship requests or offer mentorship to student teams.
            </p>
          </div>
        ) : (
          <>
            {/* Mentee Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <span className="text-xs text-slate-400 font-bold block mb-1">Mentee Students</span>
                <span className="text-3xl font-extrabold text-cyan-600 font-mono">{totalMentees}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Students under guidance</span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <span className="text-xs text-slate-400 font-bold block mb-1">Mentored Teams</span>
                <span className="text-3xl font-extrabold text-indigo-600 font-mono">{activeTeams}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Active hackathon teams</span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <span className="text-xs text-slate-400 font-bold block mb-1">Total Participations</span>
                <span className="text-3xl font-extrabold text-emerald-600 font-mono">{totalParticipations}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Event entries by mentees</span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <span className="text-xs text-slate-400 font-bold block mb-1">Mentee Victories 🏆</span>
                <span className="text-3xl font-extrabold text-amber-600 font-mono">{totalWins}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Hackathon awards won</span>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CollegeParticipationChart data={participationTrend} />
              <CollegeWinningChart data={winningTrend} />
            </div>

            {/* Top Mentee Skills Breakdown */}
            {menteeAnalytics.topMenteeSkills && menteeAnalytics.topMenteeSkills.length > 0 && (
              <Card className="p-6 space-y-3 bg-white border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top Technical Skills of My Mentees</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {menteeAnalytics.topMenteeSkills.map((sk: any, idx: number) => (
                    <div key={idx} className="p-3 bg-cyan-50/60 rounded-xl border border-cyan-100 text-center">
                      <span className="font-bold text-slate-900 block truncate">{sk.skill}</span>
                      <span className="text-cyan-700 font-extrabold font-mono text-sm block mt-1">
                        {sk.count} mentees
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Mentee Real-Time Participation Roster */}
            <Card className="p-6 space-y-4 bg-white border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600" /> Mentee Student Real-Time Performance
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {menteeAnalytics.mentees.map((st: any) => (
                  <div key={st.studentId} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={st.name} size="sm" />
                      <div>
                        <span className="font-bold text-slate-900 block text-sm">{st.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {st.department} • Team: <span className="font-bold text-brand-600">{st.teamName}</span> ({st.eventTitle})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 text-right">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Participations</span>
                        <span className="font-bold text-slate-900 font-mono text-sm">{st.participationsCount || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Wins</span>
                        <span className="font-extrabold text-amber-600 font-mono text-sm">{st.winsCount || 0} 🏆</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Score</span>
                        <span className="font-bold text-brand-600 font-mono text-sm">{st.score || 0} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};
