import React, { useEffect, useState } from 'react';
import { collegeService, CollegeStudent } from '@/services/api/collegeService';
import { mentorService, MentorshipRequest } from '@/services/api/mentorService';
import { teamService, Team } from '@/services/api/teamService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card, Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TextInput, Select, Textarea } from '@/components/ui/Inputs';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import {
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
  Send,
  Search,
  BarChart3,
  Sparkles,
  Briefcase,
  Trophy,
  Download,
} from 'lucide-react';

export const StaffDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STUDENTS' | 'REQUESTS' | 'MENTEES_ANALYTICS'>('STUDENTS');

  // College Students Roster
  const [students, setStudents] = useState<CollegeStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');

  // Mentorship Requests State
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Mentee-Only Analytics State
  const [menteeAnalytics, setMenteeAnalytics] = useState<any | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);

  // Live College Profile & Real Rank State
  const [collegeProfile, setCollegeProfile] = useState<any | null>(null);

  // Invite Team Modal State
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const fetchCollegeProfile = async () => {
    try {
      const res = await collegeService.getCollegeProfile();
      if (res.success && res.data) {
        setCollegeProfile(res.data);
      }
    } catch {
      setCollegeProfile(null);
    }
  };

  const fetchStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const res = await collegeService.getCollegeStudents();
      if (res.success && res.data) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const fetchRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const res = await mentorService.getMentorshipRequests();
      if (res.success && res.data) {
        setRequests(res.data);
      } else {
        setRequests([]);
      }
    } catch {
      setRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const fetchMenteeAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const res = await mentorService.getStaffMenteeAnalytics();
      if (res.success && res.data) {
        setMenteeAnalytics(res.data);
      } else {
        setMenteeAnalytics(null);
      }
    } catch {
      setMenteeAnalytics(null);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await teamService.getTeams();
      if (res.success && res.data) {
        setTeams(res.data);
      }
    } catch {
      setTeams([]);
    }
  };

  useEffect(() => {
    fetchCollegeProfile();
    fetchStudents();
    fetchRequests();
    fetchMenteeAnalytics();
    fetchTeams();
  }, []);

  const handleRespondRequest = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      if (action === 'ACCEPT') {
        await mentorService.acceptMentorshipRequest(requestId);
      } else {
        await mentorService.rejectMentorshipRequest(requestId);
      }
      fetchRequests();
      fetchMenteeAnalytics();
    } catch {
      fetchRequests();
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;
    setIsSendingInvite(true);
    try {
      const res = await mentorService.inviteTeamAsMentor(selectedTeamId, inviteMessage);
      if (res.success) {
        setIsInviteModalOpen(false);
        setSelectedTeamId('');
        setInviteMessage('');
        fetchMenteeAnalytics();
        alert('Mentorship invitation sent successfully to the team lead!');
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to send mentorship invitation');
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleDownloadMenteeHistory = () => {
    if (!menteeAnalytics || !menteeAnalytics.mentees || menteeAnalytics.mentees.length === 0) {
      alert('No mentee participation data available to download.');
      return;
    }

    const headers = ['Student Name', 'Email', 'Department', 'Team Name', 'Event Title', 'Participations', 'Wins', 'Score (Pts)'];
    const rows = menteeAnalytics.mentees.map((st: any) => [
      `"${st.name || ''}"`,
      `"${st.email || ''}"`,
      `"${st.department || ''}"`,
      `"${st.teamName || ''}"`,
      `"${st.eventTitle || ''}"`,
      st.participationsCount || 0,
      st.winsCount || 0,
      st.score || 0,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `mentee_students_participation_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(studentSearch.toLowerCase())) ||
      (s.department && s.department.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-5xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-cyan-600" />
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Faculty & Staff Command Center</h1>
              <p className="text-xs text-slate-500">
                {collegeProfile?.collegeName || 'Institutional'} • Student mentorship, team invitation engine, and mentee analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400" /> Global Rank: <span className="text-amber-400 font-black">{collegeProfile?.collegeRank ? `${collegeProfile.collegeRank}` : 'Unranked'}</span> <span className="text-[10px] text-slate-400 font-normal">(out of {collegeProfile?.totalCollegesCount || 1})</span>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handleDownloadMenteeHistory}
              className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
              leftIcon={<Download className="w-4 h-4 text-cyan-600" />}
            >
              Download Mentee History
            </Button>

            <Button
              size="sm"
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Offer Mentorship to Team
            </Button>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-slate-200 gap-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('STUDENTS')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'STUDENTS'
                ? 'border-cyan-600 text-cyan-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> College Students Directory ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('REQUESTS')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'REQUESTS'
                ? 'border-cyan-600 text-cyan-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Mentorship Requests ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('MENTEES_ANALYTICS')}
            className={`pb-3 transition border-b-2 flex items-center gap-2 ${
              activeTab === 'MENTEES_ANALYTICS'
                ? 'border-cyan-600 text-cyan-700 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> My Mentee Analytics
          </button>
        </div>

        {/* TAB 1: COLLEGE STUDENTS DIRECTORY */}
        {activeTab === 'STUDENTS' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <TextInput
                  value={studentSearch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStudentSearch(e.target.value)}
                  placeholder="Search students by name, email, or department..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5 text-center">Score</th>
                    <th className="p-3.5 text-center">Participations</th>
                    <th className="p-3.5 text-center">Wins 🏆</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {isLoadingStudents ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center">
                        <SkeletonLoader variant="table" count={3} />
                      </td>
                    </tr>
                  ) : filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No students found belonging to your institution.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((st) => (
                      <tr key={st.studentId || st.email} className="hover:bg-slate-50/80 transition">
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={st.name} size="sm" />
                            <div>
                              <span className="font-bold text-slate-900 block">{st.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{st.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 text-slate-700 font-medium">{st.department || 'General'}</td>
                        <td className="p-3.5 text-center font-bold text-brand-600 font-mono">{st.score || 0} pts</td>
                        <td className="p-3.5 text-center font-bold text-slate-800">{st.participationsCount || 0}</td>
                        <td className="p-3.5 text-center font-extrabold text-amber-600">{st.wins || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MENTORSHIP REQUESTS */}
        {activeTab === 'REQUESTS' && (
          <div className="space-y-4">
            {isLoadingRequests ? (
              <SkeletonLoader variant="card" count={2} />
            ) : requests.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Pending Requests</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You currently have no incoming mentorship requests from student teams.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map((req) => (
                  <Card key={req.id} className="p-5 bg-white border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{req.teamName}</span>
                        <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                          {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Event: <span className="font-semibold text-brand-600">{req.eventTitle}</span> • Team Lead: <span className="font-semibold text-slate-900">{req.teamLeadName || req.menteeName}</span>
                      </p>
                      {req.message && (
                        <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg mt-2">
                          "{req.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleRespondRequest(req.id, 'ACCEPT')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        leftIcon={<CheckCircle2 className="w-4 h-4" />}
                      >
                        Accept Request
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespondRequest(req.id, 'REJECT')}
                        className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
                        leftIcon={<XCircle className="w-4 h-4" />}
                      >
                        Decline
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY MENTEE ANALYTICS */}
        {activeTab === 'MENTEES_ANALYTICS' && (
          <div className="space-y-6">
            {isLoadingAnalytics ? (
              <SkeletonLoader variant="card" count={3} />
            ) : !menteeAnalytics || menteeAnalytics.totalMentees === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center">
                <Sparkles className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Active Mentees Recorded</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                  Accept incoming mentorship requests or offer mentorship to student teams to start tracking mentee analytics.
                </p>
                <Button size="sm" onClick={() => setIsInviteModalOpen(true)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Offer Mentorship to Team
                </Button>
              </div>
            ) : (
              <>
                {/* Mentee Overview Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                    <span className="text-xs text-slate-400 font-bold block mb-1">My Total Mentees</span>
                    <span className="text-3xl font-extrabold text-cyan-600 font-mono">{menteeAnalytics.totalMentees}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Students under guidance</span>
                  </Card>

                  <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                    <span className="text-xs text-slate-400 font-bold block mb-1">Mentored Teams</span>
                    <span className="text-3xl font-extrabold text-indigo-600 font-mono">{menteeAnalytics.activeMenteeTeams}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Active hackathon teams</span>
                  </Card>

                  <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                    <span className="text-xs text-slate-400 font-bold block mb-1">Mentee Victories 🏆</span>
                    <span className="text-3xl font-extrabold text-amber-600 font-mono">{menteeAnalytics.totalMenteeWins}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Hackathon awards won</span>
                  </Card>

                  <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                    <span className="text-xs text-slate-400 font-bold block mb-1">Mentee Entries</span>
                    <span className="text-3xl font-extrabold text-emerald-600 font-mono">{menteeAnalytics.totalMenteeParticipations}</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Event participations</span>
                  </Card>
                </div>

                {/* Top Skills of Mentees */}
                {menteeAnalytics.topMenteeSkills && menteeAnalytics.topMenteeSkills.length > 0 && (
                  <Card className="p-6 space-y-3 bg-white border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top Skills Across My Mentees</h3>
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

                {/* Mentee Student Roster */}
                <Card className="p-6 space-y-4 bg-white border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-600" /> Active Mentee Student Profiles
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDownloadMenteeHistory}
                      className="bg-white border-cyan-200 text-cyan-700 hover:bg-cyan-50 font-bold"
                      leftIcon={<Download className="w-4 h-4 text-cyan-600" />}
                    >
                      Download Mentee History
                    </Button>
                  </div>

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

                        <div className="flex items-center gap-4 text-right">
                          <div>
                            <span className="font-bold text-slate-900 font-mono text-sm block">{st.score} pts</span>
                            <span className="text-[10px] text-amber-600 font-bold">{st.winsCount} Wins 🏆</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}
      </main>

      {/* Offer Mentorship to Team Modal */}
      {isInviteModalOpen && (
        <Modal isOpen={isInviteModalOpen} onClose={() => setIsInviteModalOpen(false)} title="Offer Mentorship to Team">
          <form onSubmit={handleSendInvite} className="space-y-4 text-left p-1">
            <Select
              label="Select Target Student Team *"
              value={selectedTeamId}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTeamId(e.target.value)}
              options={[
                { value: '', label: '-- Choose Team --' },
                ...teams.map((t) => ({ value: t.id, label: `${t.name} (${t.eventName})` })),
              ]}
              required
            />

            <Textarea
              label="Mentorship Message / Offer Note"
              value={inviteMessage}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInviteMessage(e.target.value)}
              placeholder="Explain how you can guide the team in technical architecture, AI models, or pitch deck preparation..."
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSendingInvite} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                Send Invitation Offer
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
