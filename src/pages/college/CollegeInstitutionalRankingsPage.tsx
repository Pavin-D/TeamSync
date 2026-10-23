import React, { useEffect, useState } from 'react';
import { collegeService, CollegeProfile } from '@/services/api/collegeService';
import { rankingService, CollegeRanking } from '@/services/api/rankingService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card, Avatar } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Trophy, Award, Building2 } from 'lucide-react';

export const CollegeInstitutionalRankingsPage: React.FC = () => {
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [globalCollegeRankings, setGlobalCollegeRankings] = useState<CollegeRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRankings = async () => {
      setIsLoading(true);
      try {
        const [profileRes, globalCollegesRes] = await Promise.all([
          collegeService.getCollegeProfile(),
          rankingService.getCollegeRankings(),
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
        }

        if (globalCollegesRes.success && globalCollegesRes.data) {
          setGlobalCollegeRankings(globalCollegesRes.data);
        }
      } catch {
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const topStudents = profile?.collegeStudentRankings || [];
  const collegeRank = profile?.collegeRank;
  const totalColleges = profile?.totalCollegesCount || globalCollegeRankings.length || 1;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-cyan-600" />
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              {profile?.collegeName ? `${profile.collegeName} Live Rankings` : 'Institutional Live Rankings'}
            </h1>
            <p className="text-xs text-slate-500">Real-time student and global institutional leaderboards fetched directly from the database</p>
          </div>
        </div>

        {/* Global Ranks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 bg-slate-900 text-white rounded-2xl">
            <span className="text-xs text-slate-300 font-bold block mb-1">Global College Rank</span>
            {isLoading ? (
              <span className="text-2xl font-bold text-slate-400 font-mono">Loading...</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {collegeRank ? `${collegeRank}` : 'Unranked'}
                </span>
                <span className="text-xs text-slate-400 font-medium block mt-2">
                  out of {totalColleges} participating colleges
                </span>
              </>
            )}
          </Card>

          <Card className="p-5 bg-cyan-700 text-white rounded-2xl">
            <span className="text-xs text-cyan-100 font-bold block mb-1">Country Rank</span>
            {isLoading ? (
              <span className="text-2xl font-bold text-cyan-200 font-mono">Loading...</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {profile?.countryRank ? `${profile.countryRank}` : collegeRank ? `${collegeRank}` : 'Unranked'}
                </span>
                <span className="text-xs text-cyan-100 font-medium block mt-2">National Ranking</span>
              </>
            )}
          </Card>

          <Card className="p-5 bg-indigo-700 text-white rounded-2xl">
            <span className="text-xs text-indigo-200 font-bold block mb-1">Regional Rank</span>
            {isLoading ? (
              <span className="text-2xl font-bold text-indigo-200 font-mono">Loading...</span>
            ) : (
              <>
                <span className="text-3xl font-extrabold text-white font-mono">
                  {profile?.regionalRank ? `${profile.regionalRank}` : collegeRank ? `${collegeRank}` : 'Unranked'}
                </span>
                <span className="text-xs text-indigo-100 font-medium block mt-2">State / Region</span>
              </>
            )}
          </Card>
        </div>

        {/* Global College Leaderboard */}
        {globalCollegeRankings.length > 0 && (
          <Card className="p-6 space-y-4 bg-white border border-slate-200 shadow-subtle">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-600" /> Global Institutional Leaderboard (Database Real-Time)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Top performing institutions ranked by total student hackathon wins and points</p>
              </div>
              <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                {globalCollegeRankings.length} Colleges
              </span>
            </div>

            <div className="space-y-2">
              {globalCollegeRankings.map((col, idx) => (
                <div key={col.collegeId || idx} className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shadow-xs ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {col.rank || idx + 1}
                    </span>
                    <div>
                      <span className="font-bold text-slate-900 block">{col.collegeName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{col.totalStudents || 0} enrolled students</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-cyan-600 font-mono text-sm block">{col.totalScore || col.score || 0} pts</span>
                    <span className="text-[10px] text-amber-600 font-bold">{col.totalWins || col.wins || 0} Wins 🏆</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Intra-College Student Ranking Roster */}
        <Card className="p-6 space-y-4 bg-white border border-slate-200 shadow-subtle">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" /> Top Ranked Students in {profile?.collegeName || 'Institution'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Real-time student leaderboard belonging to this college</p>
            </div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
              {topStudents.length} Students Ranked
            </span>
          </div>

          {isLoading ? (
            <SkeletonLoader variant="table" count={3} />
          ) : topStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-50 rounded-2xl">
              No student ranking metrics recorded for this institution yet.
            </div>
          ) : (
            <div className="space-y-2">
              {topStudents.map((st, idx) => (
                <div key={st.studentId || idx} className="p-3.5 bg-slate-50/80 hover:bg-slate-100/80 transition rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-extrabold text-xs shadow-xs ${
                      idx === 0 ? 'bg-amber-400 text-slate-950' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {st.collegeRank || idx + 1}
                    </span>
                    <Avatar name={st.studentName} size="sm" />
                    <div>
                      <span className="font-bold text-slate-900 block">{st.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{st.department || 'General'}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-extrabold text-cyan-600 font-mono text-sm block">{st.score || 0} pts</span>
                    <span className="text-[10px] text-amber-600 font-bold">{st.wins || 0} Wins 🏆</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};
