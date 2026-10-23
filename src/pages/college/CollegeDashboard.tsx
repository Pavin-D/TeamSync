import React, { useEffect, useState } from 'react';
import { collegeService, CollegeProfile, DepartmentSummary } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { CollegeStatCard } from '@/components/college/CollegeStatCard';
import { ParticipationRateCard } from '@/components/college/ParticipationRateCard';
import { CollegeParticipationChart } from '@/components/college/CollegeParticipationChart';
import { CollegeWinningChart } from '@/components/college/CollegeWinningChart';
import { ExportReportModal } from '@/components/college/ExportReportModal';
import { PostHackathonModal } from '@/components/college/PostHackathonModal';
import { Card, Badge, Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ErrorState, SkeletonLoader } from '@/components/ui/Feedback';
import {
  Users,
  Trophy,
  Download,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
  Globe,
  Building2,
  GraduationCap,
  History,
  Award,
  UserCheck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CollegeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CollegeProfile | null>(null);
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [profileRes, deptsRes] = await Promise.all([
        collegeService.getCollegeDashboard(),
        collegeService.getDepartments(),
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      } else {
        setProfile(null);
      }

      if (deptsRes.success && deptsRes.data) {
        setDepartments(deptsRes.data);
      } else {
        setDepartments([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalStud = profile?.totalStudents || 0;
  const totalStaff = profile?.totalStaff ?? (profile?.staffMembers?.length || 0);
  const partStud = profile?.participatingStudents || profile?.activeParticipants || 0;
  const partRate = profile?.participationRate || (totalStud > 0 ? Math.round((partStud / totalStud) * 100) : 0);
  const totalWins = profile?.totalWins || 0;
  const totalEvents = profile?.totalEvents || 0;
  const totalFinalists = profile?.totalFinalists || 0;
  const totalTeams = profile?.totalTeams || 0;

  const participationTrendData = [
    { year: 2026, students: partStud, events: totalEvents, teams: totalTeams },
  ];

  const winningTrendData = [
    { year: 2026, wins: totalWins, finalists: totalFinalists },
  ];

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load College Dashboard"
        message="Unable to connect to the institutional management service."
        onRetry={fetchDashboardData}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 text-left pb-16 overflow-y-auto">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {profile?.collegeName || 'Institution Dashboard'}
              </h1>
              {profile?.isVerified !== false && (
                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Institution
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">{profile?.location || 'Registered Campus'} • Official Institutional Dashboard</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400" /> Global Rank: <span className="text-amber-400 font-black">{profile?.collegeRank ? `${profile.collegeRank}` : 'Unranked'}</span> <span className="text-[10px] text-slate-400 font-normal">(out of {profile?.totalCollegesCount || 0})</span>
            </div>

            <Button
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
              leftIcon={<PlusCircle className="w-4 h-4" />}
            >
              Post Hackathon
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsExportModalOpen(true)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Post Hackathon Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block font-mono">
              Institutional Event Manager
            </span>
            <h2 className="text-xl font-extrabold text-white">Host Intra-College & Global Hackathons</h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Post hackathons scoped exclusively to <strong>{profile?.collegeName || 'your college'} students</strong> or host global hackathons open to participants worldwide.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs shadow-md"
              leftIcon={<Building2 className="w-4 h-4 text-slate-950" />}
            >
              Post Intra-College Event
            </Button>
            <Button
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md"
              leftIcon={<Globe className="w-4 h-4 text-white" />}
            >
              Post Global Event
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CollegeStatCard
            label={`Students (${profile?.collegeName ? 'Same College' : 'Enrolled'})`}
            value={totalStud}
            icon={GraduationCap}
            isLoading={isLoading}
          />
          <CollegeStatCard
            label={`Faculty & Staff (${profile?.collegeName ? 'Same College' : 'Staff'})`}
            value={totalStaff}
            icon={Users}
            isLoading={isLoading}
          />
          <CollegeStatCard
            label="College Global Rank"
            value={profile?.collegeRank ? `#${profile.collegeRank}` : 'Unranked'}
            icon={Trophy}
            isLoading={isLoading}
          />
          <CollegeStatCard
            label="Student Hackathon Wins 🏆"
            value={totalWins}
            icon={Award}
            isLoading={isLoading}
          />
        </div>

        {/* Participation Rate Card */}
        <ParticipationRateCard
          totalStudents={totalStud}
          participatingStudents={partStud}
          participationRate={partRate}
        />

        {/* STAFF ACTING AS MENTORS FOR TEAMS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-600" /> Staff Mentorship Roster
              </h2>
              <p className="text-xs text-slate-500">Faculty & staff members acting as industry/project mentors for student hackathon teams</p>
            </div>
            <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              {profile?.staffMentorRoster?.length || 0} Active Staff Mentors
            </span>
          </div>

          <Card className="p-5 bg-white border-slate-200 overflow-x-auto">
            {isLoading ? (
              <SkeletonLoader variant="table" count={3} />
            ) : !profile?.staffMentorRoster || profile.staffMentorRoster.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                No staff members currently assigned to mentorship teams.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3">Staff Mentor</th>
                    <th className="pb-3">Mentored Student Team</th>
                    <th className="pb-3">Event / Competition</th>
                    <th className="pb-3">Team Lead</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {profile.staffMentorRoster.map((m) => (
                    <tr key={m.mentorshipId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Avatar name={m.staffName} size="sm" />
                          <div>
                            <p className="font-bold text-slate-900">{m.staffName}</p>
                            <p className="text-[10px] text-slate-500">{m.staffTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-brand-600">{m.teamName}</td>
                      <td className="py-3 text-slate-700 font-medium">{m.eventTitle}</td>
                      <td className="py-3 text-slate-600">{m.teamLeadName}</td>
                      <td className="py-3 text-right">
                        <Badge variant={m.status === 'ACCEPTED' || m.status === 'ACTIVE' ? 'success' : 'primary'}>
                          {m.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* STUDENT RANKING ACROSS ALL STUDENTS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Student Rankings Across All Students Worldwide
              </h2>
              <p className="text-xs text-slate-500">Leaderboard of students from {profile?.collegeName || 'your college'} ranked globally</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/rankings')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Global Leaderboard
            </Button>
          </div>

          <Card className="p-5 bg-white border-slate-200 overflow-x-auto">
            {isLoading ? (
              <SkeletonLoader variant="table" count={3} />
            ) : !profile?.collegeStudentRankings || profile.collegeStudentRankings.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                No student rankings recorded yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3">Global Rank</th>
                    <th className="pb-3">College Rank</th>
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Wins 🏆</th>
                    <th className="pb-3 text-right">Overall Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {profile.collegeStudentRankings.map((st) => (
                    <tr key={st.studentId} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-mono font-black text-amber-600">#{st.globalRank}</td>
                      <td className="py-3 font-mono font-bold text-slate-700">#{st.collegeRank}</td>
                      <td className="py-3 font-bold text-slate-900">{st.studentName}</td>
                      <td className="py-3 text-slate-500">{st.department}</td>
                      <td className="py-3 font-extrabold text-amber-600">{st.wins} Wins</td>
                      <td className="py-3 text-right font-mono font-black text-slate-900">{st.score} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* STUDENT PARTICIPATION HISTORY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" /> Student Participation History
              </h2>
              <p className="text-xs text-slate-500">Recent hackathon participation records for students of {profile?.collegeName || 'this college'}</p>
            </div>
          </div>

          <Card className="p-5 bg-white border-slate-200 overflow-x-auto">
            {isLoading ? (
              <SkeletonLoader variant="table" count={3} />
            ) : !profile?.studentParticipationHistory || profile.studentParticipationHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 italic">
                No recent student participation records found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Hackathon Event</th>
                    <th className="pb-3">Team Name</th>
                    <th className="pb-3">Result / Placement</th>
                    <th className="pb-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {profile.studentParticipationHistory.map((historyItem) => (
                    <tr key={historyItem.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 font-bold text-slate-900">{historyItem.studentName}</td>
                      <td className="py-3 font-semibold text-slate-800">{historyItem.eventTitle}</td>
                      <td className="py-3 text-brand-600 font-medium">{historyItem.teamName}</td>
                      <td className="py-3">
                        <Badge variant={historyItem.result.includes('WIN') ? 'success' : 'primary'}>
                          {historyItem.result}
                        </Badge>
                      </td>
                      <td className="py-3 text-right text-slate-400 text-[11px] font-mono">{historyItem.date.split('T')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CollegeParticipationChart data={participationTrendData} />
          <CollegeWinningChart data={winningTrendData} />
        </div>

        {/* Department Roster Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Department Performance Overview</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/college/departments')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View All Departments
            </Button>
          </div>

          {departments.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500 font-medium">
              No department participation metrics recorded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map((d, idx) => (
                <div key={d.departmentId || idx} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{d.departmentName}</h4>
                    <span className="text-xs font-mono font-extrabold text-brand-600">Rank #{d.rank || idx + 1}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Enrolled: <strong>{d.totalStudents}</strong></span>
                    <span>Participating: <strong>{d.participatingStudents || d.participantsCount || 0}</strong></span>
                    <span className="text-amber-600 font-bold">Wins: {d.wins || d.totalWins || 0} 🏆</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <ExportReportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Post Hackathon Modal */}
      {isPostModalOpen && (
        <PostHackathonModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          collegeName={profile?.collegeName}
          collegeId={profile?.collegeId}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
