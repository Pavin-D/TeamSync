import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { eventService, Event } from '@/services/api/eventService';
import { teamService, Team } from '@/services/api/teamService';
import { mentorService, MentorProfile, MentorshipRequest } from '@/services/api/mentorService';
import { searchService } from '@/services/api/searchService';
import { rankingService, ParticipationRecord } from '@/services/api/rankingService';
import { JoinRequestModal } from '@/components/teams/JoinRequestModal';
import { Card, StatCard, Badge, SkillBadge, Avatar } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Feedback';
import {
  Building2,
  Globe,
  Users,
  Calendar,
  Trophy,
  Briefcase,
  UserCheck,
  CheckCircle,
  ExternalLink,
  GraduationCap,
  Crown,
  History,
  Award,
  FileCheck,
  Inbox,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export const ProfessionalDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [companyProfessionals, setCompanyProfessionals] = useState<MentorProfile[]>([]);
  const [globalEvents, setGlobalEvents] = useState<Event[]>([]);
  const [globalTeams, setGlobalTeams] = useState<Team[]>([]);
  const [globalStudents, setGlobalStudents] = useState<any[]>([]);
  const [globalProfessionals, setGlobalProfessionals] = useState<MentorProfile[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [participationHistory, setParticipationHistory] = useState<ParticipationRecord[]>([]);
  const [mentorshipRequests, setMentorshipRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Join Request Modal State
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [selectedTeamName, setSelectedTeamName] = useState<string>('');

  const userCompany = (user as any)?.professionalProfile?.company || (user as any)?.company || 'Tech Organization';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [eventsRes, teamsRes, mentorsRes, studentsRes, myTeamsRes, partRes, mentorReqRes] = await Promise.all([
          eventService.getEvents(),
          teamService.getTeams({ scope: 'GLOBAL' }),
          mentorService.getMentors(),
          searchService.searchPeople({ role: 'STUDENT' }),
          teamService.getUserTeams(),
          rankingService.getParticipationHistory(),
          mentorService.getMentorshipRequests(),
        ]);

        if (eventsRes.success && eventsRes.data) {
          setGlobalEvents(eventsRes.data);
        }

        if (teamsRes.success && teamsRes.data) {
          setGlobalTeams(teamsRes.data);
        }

        if (studentsRes.success && studentsRes.data) {
          setGlobalStudents(studentsRes.data);
        }

        if (myTeamsRes.success && myTeamsRes.data) {
          setMyTeams(myTeamsRes.data);
        }

        if (partRes.success && partRes.data) {
          setParticipationHistory(partRes.data);
        }

        if (mentorReqRes.success && mentorReqRes.data) {
          setMentorshipRequests(mentorReqRes.data);
        }

        if (mentorsRes.success && mentorsRes.data) {
          const allPros = mentorsRes.data;
          setGlobalProfessionals(allPros);

          const sameCompanyAvailable = allPros.filter(
            (m: MentorProfile) =>
              m.status !== 'NOT_AVAILABLE' &&
              m.availableForMentorship !== false &&
              m.company &&
              userCompany &&
              m.company.toLowerCase() === userCompany.toLowerCase()
          );

          const availablePros = sameCompanyAvailable.length > 0
            ? sameCompanyAvailable
            : allPros.filter((m: MentorProfile) => m.status !== 'NOT_AVAILABLE' && m.availableForMentorship !== false);

          setCompanyProfessionals(availablePros);
        }
      } catch (err) {
        console.error('Failed to load professional dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userCompany]);

  const handleOpenJoinRequest = (teamId: string, teamName: string) => {
    setSelectedTeamId(teamId);
    setSelectedTeamName(teamName);
  };

  const handleSendJoinRequest = async (message: string, skills: string[]) => {
    if (!selectedTeamId) return;
    await teamService.requestToJoinTeam(selectedTeamId, message, skills);
    setGlobalTeams((prev) =>
      prev.map((t) => (t.id === selectedTeamId ? { ...t, userRequestStatus: 'PENDING' } : t))
    );
  };

  return (
    <div className="space-y-6 text-left pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white px-3 py-0.5 rounded-full">
                Work Professional Portal
              </span>
              <span className="text-[11px] font-bold bg-cyan-400 text-slate-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Building2 className="w-3 h-3" /> {userCompany}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">
              Welcome, {user?.name || 'Professional'}
            </h1>
            <p className="text-xs text-cyan-100 mt-1 max-w-xl">
              View available employees from {userCompany}, explore global hackathons, global teams, student candidates, and industry colleagues.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => navigate('/mentors')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md"
            >
              Browse Industry Professionals
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Header Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setSearchParams({ tab: 'overview' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4 text-violet-500" /> Overview
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'my-teams' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'my-teams'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" /> My Teams ({myTeams.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'company' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'company'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-cyan-500" /> My Company ({companyProfessionals.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'global' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'global'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-500" /> Global Hackathons ({globalEvents.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'teams' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'teams'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-indigo-500" /> Recruiting Teams ({globalTeams.length})
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'requests' })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'requests'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Inbox className="w-4 h-4 text-purple-500" /> Mentorship Requests ({mentorshipRequests.length})
        </button>
      </div>

      {/* OVERVIEW TAB */}
      {(activeTab === 'overview' || !activeTab) && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Available Employees" value={companyProfessionals.length.toString()} icon={<Building2 className="w-5 h-5 text-cyan-600" />} />
            <StatCard title="Global Hackathons" value={globalEvents.length.toString()} icon={<Globe className="w-5 h-5 text-emerald-600" />} />
            <StatCard title="Open Global Teams" value={globalTeams.length.toString()} icon={<Users className="w-5 h-5 text-indigo-600" />} />
            <StatCard title="Global Students" value={globalStudents.length.toString()} icon={<GraduationCap className="w-5 h-5 text-purple-600" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Company Preview */}
            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-cyan-600" /> Available Company Employees ({userCompany})
                  </h3>
                  <p className="text-xs text-slate-500">Employee details of available professionals</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSearchParams({ tab: 'company' })}>
                  View All
                </Button>
              </div>

              {isLoading ? (
                <SkeletonLoader variant="card" count={2} />
              ) : companyProfessionals.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No available employees currently found.</p>
              ) : (
                <div className="space-y-3">
                  {companyProfessionals.slice(0, 3).map((pro) => (
                    <div key={pro.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={pro.name} src={pro.avatarUrl} size="md" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            {pro.name} <CheckCircle className="w-3 h-3 text-emerald-600" />
                          </h4>
                          <p className="text-[11px] text-cyan-700 font-medium">{pro.jobTitle || 'Software Specialist'} • {pro.company || userCompany}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/candidates/${pro.id}`)}>
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Global Hackathons Preview */}
            <Card className="p-5 bg-white border-slate-200">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-emerald-600" /> Global Hackathons
                  </h3>
                  <p className="text-xs text-slate-500">Live competitive hackathons from database</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setSearchParams({ tab: 'global' })}>
                  View All
                </Button>
              </div>

              {isLoading ? (
                <SkeletonLoader variant="card" count={2} />
              ) : globalEvents.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No global hackathons active currently.</p>
              ) : (
                <div className="space-y-3">
                  {globalEvents.slice(0, 3).map((ev) => (
                    <div key={ev.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                        <p className="text-[11px] text-slate-500">{ev.organizer?.name || 'Global Event'} • {ev.mode || 'ONLINE'}</p>
                      </div>
                      <Button size="sm" onClick={() => navigate(`/events/${ev.id}`)}>
                        View Event
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* MY COMPANY TAB — EMPLOYEE DETAILS ONLY (NO INVITE OPTIONS, ONLY AVAILABLE EMPLOYEES) */}
      {activeTab === 'company' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 bg-cyan-50 border border-cyan-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-600 text-white rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Available Employees at {userCompany}</h3>
                <p className="text-xs text-slate-600">Employee roster showing verified available professionals with full profile details</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> {companyProfessionals.length} Available Employees
            </span>
          </div>

          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : companyProfessionals.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-slate-300">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Available Employees Found</h4>
              <p className="text-xs text-slate-500 mt-1">There are currently no available employees listed for {userCompany}.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companyProfessionals.map((pro) => (
                <Card key={pro.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                  <div>
                    {/* Employee Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={pro.name} src={pro.avatarUrl} size="lg" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                            {pro.name} <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </h4>
                          <p className="text-xs font-semibold text-cyan-700">{pro.jobTitle || 'Senior Software Engineer'}</p>
                          <p className="text-[11px] text-slate-500">{pro.company || userCompany}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="text-[10px]">
                        Available
                      </Badge>
                    </div>

                    {/* Employee Details Sub-bar */}
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-3">
                      <div className="flex items-center justify-between">
                        <span>Experience:</span>
                        <strong className="text-slate-900">{pro.yearsOfExperience ? `${pro.yearsOfExperience} Years` : '5+ Years'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Industry:</span>
                        <strong className="text-slate-900">{pro.industry || 'Software Engineering'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Active Mentees Capacity:</span>
                        <strong className="text-emerald-700">{pro.currentActiveMenteesCount || 0} / {pro.maxActiveMentees || 3}</strong>
                      </div>
                    </div>

                    {/* Primary Skills */}
                    {pro.primarySkills && pro.primarySkills.length > 0 && (
                      <div className="mb-4">
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Key Expertise:</span>
                        <div className="flex flex-wrap gap-1">
                          {pro.primarySkills.slice(0, 4).map((s) => (
                            <SkillBadge key={s} skill={s} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ONLY VIEW PROFILE CTA — NO INVITE OPTIONS */}
                  <div className="pt-3 border-t border-slate-100">
                    <Button
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/candidates/${pro.id}`)}
                      rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                    >
                      View Employee Profile
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MY TEAMS TAB — TEAMS YOU ARE IN & PAST PARTICIPATION HISTORY */}
      {activeTab === 'my-teams' && (
        <div className="space-y-8">
          {/* Section 1: Active Teams Roster */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                  <Crown className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">My Active Teams</h3>
                  <p className="text-xs text-slate-600">Teams you are currently participating in as a member or team lead</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                {myTeams.length} Active Teams
              </span>
            </div>

            {isLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : myTeams.length === 0 ? (
              <Card className="p-8 text-center bg-white border-dashed border-slate-300">
                <Crown className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No Active Team Memberships</h4>
                <p className="text-xs text-slate-500 mt-1">You are not currently in any hackathon teams. Browse recruiting teams to join one!</p>
                <div className="mt-4">
                  <Button size="sm" onClick={() => setSearchParams({ tab: 'teams' })}>
                    Browse Open Teams
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTeams.map((t) => (
                  <Card key={t.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                          {t.name}
                          {(t as any).role === 'LEAD' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-600" /> Team Lead
                            </span>
                          )}
                        </h4>
                        <Badge variant="success" className="text-[10px]">
                          {t.status || 'ACTIVE'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{t.description || 'Active hackathon team workspace.'}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span>Event: <strong className="text-slate-900">{t.eventName || t.eventTitle || 'Global Hackathon'}</strong></span>
                        <span>Members: <strong className="text-slate-900">{t.currentMembersCount || t.members?.length || 1} / {t.maxMembers || 4}</strong></span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={() => navigate(`/teams/${t.id}`)}>
                        View Team Workspace
                      </Button>
                      {(t as any).role === 'LEAD' && (
                        <SecondaryButton size="sm" onClick={() => navigate(`/teams/${t.id}/requests`)}>
                          Manage Requests
                        </SecondaryButton>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Past Participation & Competition History */}
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 bg-violet-50 border border-violet-200 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-violet-600 text-white rounded-xl">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Past Participation & Competition History</h3>
                  <p className="text-xs text-slate-600">Track your past hackathon results, awards won, and verified participation records</p>
                </div>
              </div>
              <span className="text-xs font-bold text-violet-800 bg-violet-100 px-3 py-1 rounded-full border border-violet-200 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-violet-600" /> {participationHistory.length} Past Records
              </span>
            </div>

            {isLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : participationHistory.length === 0 ? (
              <Card className="p-8 text-center bg-white border-dashed border-slate-300">
                <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-900">No Past Participation Records</h4>
                <p className="text-xs text-slate-500 mt-1">Your past hackathon participations and competition achievements will be recorded here.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {participationHistory.map((record) => (
                  <Card key={record.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-base">{record.eventTitle || record.eventName || 'Hackathon Competition'}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">Team: <strong className="text-slate-900">{record.teamName}</strong> • Role: <strong className="text-brand-600">{record.role || 'Member'}</strong></p>
                        </div>
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          record.result === 'WINNER'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : record.result === 'RUNNER_UP'
                            ? 'bg-sky-100 text-sky-800 border-sky-300'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}>
                          {record.result || 'PARTICIPATED'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-3">
                        {record.problemStatement && (
                          <p className="line-clamp-2"><strong>Problem:</strong> {record.problemStatement}</p>
                        )}
                        <p><strong>Verified Record:</strong> {record.isVerified !== false ? 'Verified ✓' : 'Self-Reported'}</p>
                        <p><strong>Date:</strong> {record.date || record.eventDate || record.participatedAt || '2025'}</p>
                      </div>
                    </div>

                    {record.certificateUrl && (
                      <div className="pt-3 border-t border-slate-100">
                        <a
                          href={record.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs rounded-xl border border-violet-200 transition"
                        >
                          <FileCheck className="w-4 h-4 text-violet-600" /> View Verification Certificate
                        </a>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MENTORSHIP REQUESTS TAB */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 bg-purple-50 border border-purple-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-600 text-white rounded-xl">
                <Inbox className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Incoming Mentorship Requests</h3>
                <p className="text-xs text-slate-600">Review student applicant requests for hackathon project mentorship and guidance</p>
              </div>
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
              {mentorshipRequests.length} Requests
            </span>
          </div>

          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : mentorshipRequests.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-slate-300">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Pending Mentorship Requests</h4>
              <p className="text-xs text-slate-500 mt-1">Student team mentorship applications will appear here in real-time.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mentorshipRequests.map((req) => (
                <Card key={req.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{req.teamName || req.menteeName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Event: <strong className="text-slate-900">{req.eventTitle || 'Global Hackathon'}</strong> • Applicant: <strong className="text-brand-600">{req.teamLeadName || 'Student'}</strong></p>
                      </div>
                      <Badge variant="primary" className="text-[10px]">
                        {req.status || 'PENDING'}
                      </Badge>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600 mb-4 italic">
                      "{req.message || 'Student team requested mentorship for hackathon project.'}"
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={async () => {
                        await mentorService.acceptMentorshipRequest(req.id);
                        setMentorshipRequests((prev) => prev.filter((r) => r.id !== req.id));
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    >
                      Accept Mentorship
                    </Button>
                    <SecondaryButton
                      size="sm"
                      onClick={async () => {
                        await mentorService.rejectMentorshipRequest(req.id);
                        setMentorshipRequests((prev) => prev.filter((r) => r.id !== req.id));
                      }}
                      className="text-slate-700 hover:bg-slate-100 font-bold text-xs"
                      leftIcon={<XCircle className="w-4 h-4 text-slate-400" />}
                    >
                      Decline Request
                    </SecondaryButton>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GLOBAL HACKATHONS TAB — FULL DISCOVERY HUB SIMILAR TO STUDENT DASHBOARD */}
      {activeTab === 'global' && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 rounded-2xl p-6 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Global Discovery Hub</span>
              <h2 className="text-xl font-extrabold text-white mt-1">Global Hackathons, Teams, Students & Professionals</h2>
              <p className="text-xs text-slate-200 mt-1">
                Explore live database hackathons, recruiting teams, student developers, and industry work professionals.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate('/teams/create')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md shrink-0"
            >
              Form Global Team
            </Button>
          </div>

          {/* Section 1: Active Global Hackathons & Events */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" /> Active Global Hackathons ({globalEvents.length})
            </h3>
            {isLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : globalEvents.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No active global hackathons found.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {globalEvents.map((event) => (
                  <Card key={event.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{event.title}</h4>
                        <Badge variant="success" className="text-[10px]">
                          {event.scope || 'GLOBAL'}
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'Active'}
                        </span>
                        <span className="flex items-center gap-1 font-semibold text-emerald-700">
                          <Trophy className="w-3.5 h-3.5 text-amber-500" /> {event.prizes && event.prizes[0] ? event.prizes[0].reward : '$10,000 Prizes'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={() => navigate(`/events/${event.id}/create-team`)}>
                        Create Team
                      </Button>
                      <SecondaryButton size="sm" onClick={() => navigate(`/events/${event.id}/find-team`)}>
                        Join / Browse Teams
                      </SecondaryButton>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Global Teams */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Global Teams ({globalTeams.length})
            </h3>
            {isLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : globalTeams.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No active global teams formed yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {globalTeams.map((t) => (
                  <Card key={t.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          {t.status || 'RECRUITING'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{t.description || 'Global hackathon team recruiting members.'}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span>Members: <strong className="text-slate-900">{t.currentMembersCount || 1} / {t.maxMembers || 4}</strong></span>
                        <span>Scope: <strong className="text-slate-900">{t.scope || 'GLOBAL'}</strong></span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button size="sm" onClick={() => navigate(`/teams/${t.id}`)}>
                        View Team Details
                      </Button>
                      {t.userRequestStatus === 'PENDING' ? (
                        <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-center block">
                          Request Pending
                        </span>
                      ) : (
                        <SecondaryButton size="sm" onClick={() => handleOpenJoinRequest(t.id, t.name)}>
                          Request to Join
                        </SecondaryButton>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Global Students */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-brand-600" /> Global Students ({globalStudents.length})
            </h3>
            {isLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : globalStudents.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No global students found.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalStudents.map((person) => (
                  <Card key={person.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={person.name} src={person.avatarUrl} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{person.name}</h4>
                          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {person.collegeName || 'Student Candidate'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        {person.departmentName || 'Computer Science'} • {person.yearOfStudy ? `Year ${person.yearOfStudy}` : 'Student'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/candidates/${person.id}`)}>
                        View Candidate Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Work Professionals */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-600" /> Work Professionals ({globalProfessionals.length})
            </h3>
            {isLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : globalProfessionals.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No work professionals registered yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {globalProfessionals.map((pro) => (
                  <Card key={pro.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={pro.name} src={pro.avatarUrl} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{pro.name}</h4>
                          <span className="text-[11px] font-semibold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {pro.company || pro.jobTitle || 'Industry Professional'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{pro.jobTitle || 'Software Engineer'}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/candidates/${pro.id}`)}>
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECRUITING TEAMS TAB */}
      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 bg-indigo-50 border border-indigo-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Global Recruiting Teams</h3>
                <p className="text-xs text-slate-600">Hackathon teams looking for work professional members or advisors</p>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full border border-indigo-200">
              {globalTeams.length} Teams Open
            </span>
          </div>

          {isLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : globalTeams.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-slate-300">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Global Teams Recruiting</h4>
              <p className="text-xs text-slate-500 mt-1">Check back soon for new open teams.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {globalTeams.map((team) => (
                <Card key={team.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{team.name}</h4>
                      <Badge variant="success" className="text-[10px]">
                        {team.status || 'RECRUITING'}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{team.description || 'Open hackathon team looking for teammates.'}</p>

                    <div className="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>Event: <strong>{team.eventName || 'Global Hackathon'}</strong></span>
                      <span>Members: <strong>{team.currentMembersCount || 1} / {team.maxMembers || 4}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => navigate(`/teams/${team.id}`)}>
                      View Team Details
                    </Button>
                    {team.userRequestStatus === 'PENDING' ? (
                      <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-center block">
                        Request Pending
                      </span>
                    ) : (
                      <SecondaryButton size="sm" onClick={() => handleOpenJoinRequest(team.id, team.name)}>
                        Request to Join
                      </SecondaryButton>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Join Request Modal */}
      {selectedTeamId && (
        <JoinRequestModal
          isOpen={!!selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
          teamName={selectedTeamName}
          onSubmit={handleSendJoinRequest}
        />
      )}
    </div>
  );
};
