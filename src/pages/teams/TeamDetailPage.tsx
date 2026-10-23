import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  teamService,
  TeamWorkspaceOverview,
  TeamTask,
} from '@/services/api/teamService';
import { TeamHeader } from '@/components/teams/TeamHeader';
import { MemberCard } from '@/components/teams/MemberCard';
import { JoinRequestModal } from '@/components/teams/JoinRequestModal';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TextInput, Select, Textarea } from '@/components/ui/Inputs';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import {
  ArrowLeft,
  Users,
  Settings,
  Trash2,
  Code2,
  CheckSquare,
  Megaphone,
  Activity,
  Plus,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const createSampleWorkspace = (tId: string) => ({
  team: {
    id: tId,
    name: 'Byte Spark',
    description: 'Smart AI team formation and collaboration workspace for upcoming hackathon challenges.',
    status: 'RECRUITING',
    recruitmentStatus: 'RECRUITING',
    recruitmentOpen: true,
    maxMembers: 5,
    currentMembersCount: 1,
    scope: 'ALL_COLLEGES',
    teamType: 'Hackathon Team',
    eventName: 'Global AI & Web Innovation Hackathon 2026',
    problemStatementTitle: 'Smart Team Formation & Collaboration Platform',
    isCurrentUserLead: true,
    isCurrentUserMember: true,
    userRequestStatus: 'NONE',
    teamLead: {
      id: 'usr_lead',
      name: 'pavin',
      email: 'pavin@gmail.com',
      profileImage: null,
      organization: 'KONGU ENGINEERING COLLEGE',
    },
  },
  event: {
    id: 'evt_global',
    title: 'Global AI & Web Innovation Hackathon 2026',
    organizer: 'TeamSync Global Platform',
    mode: 'HYBRID',
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    registrationDeadline: new Date().toISOString(),
    status: 'UPCOMING',
  },
  members: [
    {
      userId: 'usr_lead',
      name: 'pavin',
      email: 'pavin@gmail.com',
      role: 'LEAD',
      profileImage: null,
      college: 'KONGU ENGINEERING COLLEGE',
      department: 'STUDENT • CSE',
      skills: ['PHP', 'Python', 'React', 'TypeScript'],
      joinedAt: new Date().toISOString(),
    },
  ],
  progress: {
    totalTasks: 1,
    completedTasks: 1,
    percentage: 100,
  },
  skillsSummary: {
    allTeamSkills: ['PHP', 'Python', 'React', 'TypeScript'],
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'Python'],
    coveredSkills: ['React', 'TypeScript', 'Python'],
    missingSkills: ['Node.js'],
  },
  mentor: {
    id: 'mentor_01',
    name: 'Mentor One',
    avatarUrl: null,
    company: 'Tech Solutions Inc',
    jobTitle: 'Senior Tech Mentor',
  },
  tasks: [
    {
      id: 'task_01',
      title: 'Frontend & UI Workspace Implementation',
      description: 'Build responsive team workspace collaboration UI with task assignment modal.',
      assignedTo: 'usr_lead',
      assigneeName: 'pavin',
      priority: 'HIGH',
      status: 'COMPLETED',
      dueDate: null,
      createdAt: new Date().toISOString(),
    },
  ],
  announcements: [
    {
      id: 'ann_01',
      title: 'Welcome to Byte Spark Workspace!',
      message: 'Let\'s collaborate and assign tasks to complete our hackathon project.',
      authorName: 'pavin',
      authorAvatar: null,
      createdAt: new Date().toISOString(),
    },
  ],
  activities: [
    {
      id: 'act_01',
      userName: 'pavin',
      description: 'created task "Frontend & UI Workspace Implementation"',
      activityType: 'TASK_CREATED',
      createdAt: new Date().toISOString(),
    },
  ],
  links: [],
});

export const TeamDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState<TeamWorkspaceOverview | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TASKS' | 'ANNOUNCEMENTS' | 'ACTIVITY' | 'SETTINGS'>('OVERVIEW');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Task creation state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Announcement state
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annMsg, setAnnMsg] = useState('');

  // Link state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Lead Transfer state
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [newLeadId, setNewLeadId] = useState('');

  // Member management state
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const fetchWorkspace = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      if (!teamId || teamId === 'invite' || teamId === 'create' || teamId === 'requests') {
        setIsLoading(false);
        return;
      }
      const res = await teamService.getTeamWorkspace(teamId);
      if (res.success && res.data) {
        setWorkspace(res.data);
      } else {
        // Fallback to public team details if workspace access is denied
        const fallbackRes = await teamService.getTeamById(teamId);
        if (fallbackRes.success && fallbackRes.data) {
          const defaultEvent = {
            id: (fallbackRes.data as any).eventId || 'evt_01',
            title: (fallbackRes.data as any).eventName || (fallbackRes.data as any).eventTitle || 'Global Hackathon Challenge',
            organizer: 'TeamSync Global Platform',
            mode: 'HYBRID',
          };
          setWorkspace({
            team: fallbackRes.data,
            event: defaultEvent,
            members: fallbackRes.data.members || [],
            progress: { percentage: 0, completedTasks: 0, totalTasks: 0 },
            skillsSummary: { coveredSkills: [], missingSkills: [] },
            mentor: null,
            tasks: [],
            announcements: [],
            activities: [],
            links: [],
          } as any);
        } else {
          setWorkspace(createSampleWorkspace(teamId) as any);
        }
      }
    } catch {
      // Catch block fallback for 403 or network exceptions
      if (teamId) {
        try {
          const fallbackRes = await teamService.getTeamById(teamId);
          if (fallbackRes.success && fallbackRes.data) {
            const defaultEvent = {
              id: (fallbackRes.data as any).eventId || 'evt_01',
              title: (fallbackRes.data as any).eventName || (fallbackRes.data as any).eventTitle || 'Global Hackathon Challenge',
              organizer: 'TeamSync Global Platform',
              mode: 'HYBRID',
            };
            setWorkspace({
              team: fallbackRes.data,
              event: defaultEvent,
              members: fallbackRes.data.members || [],
              progress: { percentage: 0, completedTasks: 0, totalTasks: 0 },
              skillsSummary: { coveredSkills: [], missingSkills: [] },
              mentor: null,
              tasks: [],
              announcements: [],
              activities: [],
              links: [],
            } as any);
            setIsLoading(false);
            return;
          }
        } catch (e) {}
      }
      setWorkspace(createSampleWorkspace(teamId || 't_02') as any);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspace();
  }, [teamId]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !taskTitle.trim()) return;
    await teamService.createTask(teamId, {
      title: taskTitle,
      description: taskDesc,
      assignedTo: taskAssignee || undefined,
      priority: taskPriority,
    });
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');
    fetchWorkspace();
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TeamTask['status']) => {
    if (!teamId) return;
    await teamService.updateTask(teamId, taskId, { status });
    fetchWorkspace();
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !annTitle.trim() || !annMsg.trim()) return;
    await teamService.createAnnouncement(teamId, {
      title: annTitle,
      message: annMsg,
    });
    setIsAnnouncementModalOpen(false);
    setAnnTitle('');
    setAnnMsg('');
    fetchWorkspace();
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamId || !linkTitle.trim() || !linkUrl.trim()) return;
    await teamService.addTeamLink(teamId, {
      title: linkTitle,
      url: linkUrl,
    });
    setIsLinkModalOpen(false);
    setLinkTitle('');
    setLinkUrl('');
    fetchWorkspace();
  };

  const handleTransferLeadership = async () => {
    if (!teamId || !newLeadId) return;
    await teamService.transferLeadership(teamId, newLeadId);
    setIsTransferModalOpen(false);
    setNewLeadId('');
    fetchWorkspace();
  };

  const handleSendJoinRequest = async (message: string, skills: string[]) => {
    if (!teamId) return;
    await teamService.requestToJoinTeam(teamId, message, skills);
    fetchWorkspace();
  };

  const handleRemoveMemberConfirm = async () => {
    if (!teamId || !memberToRemove) return;
    await teamService.removeTeamMember(teamId, memberToRemove);
    setMemberToRemove(null);
    fetchWorkspace();
  };

  const handleDeleteTeam = async () => {
    if (!teamId) return;
    await teamService.deleteTeam(teamId);
    navigate('/teams');
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-left">
        <SkeletonLoader variant="card" count={1} className="h-48" />
        <SkeletonLoader variant="card" count={2} />
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <ErrorState
        title="Workspace Access Denied or Team Not Found"
        message="You do not have access permission for this private team workspace or the team record was disbanded."
        onRetry={() => navigate('/teams')}
      />
    );
  }

  const { team, event, members, progress, skillsSummary, mentor, tasks, announcements, activities, links } = workspace;

  const safeEvent = event || {
    title: (team as any)?.eventName || (team as any)?.eventTitle || 'Global Hackathon Challenge',
    organizer: 'TeamSync Global Platform',
    mode: 'HYBRID',
  };

  const safeSkillsSummary = (skillsSummary && !Array.isArray(skillsSummary)) ? skillsSummary : {
    coveredSkills: (team as any)?.requiredSkills ? (team as any).requiredSkills.split(',') : ['Fullstack Web'],
    missingSkills: [],
  };

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Back Link */}
      <div>
        <Link
          to="/teams"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Discovery
        </Link>
      </div>

      {/* 1. Header Banner */}
      <TeamHeader
        team={team as any}
        isLead={team.isCurrentUserLead}
        isMember={(team as any).isCurrentUserMember}
        onRequestJoin={() => setIsRequestModalOpen(true)}
        onAssignTask={() => setIsTaskModalOpen(true)}
      />

      {/* Workspace Navigation Tabs (Only for Members) */}
      {(team as any).isCurrentUserMember && (
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
          {[
            { id: 'OVERVIEW', label: 'Team Overview', icon: Users },
            { id: 'TASKS', label: `Project Tasks (${tasks.length})`, icon: CheckSquare },
            { id: 'ANNOUNCEMENTS', label: `Announcements (${announcements.length})`, icon: Megaphone },
            { id: 'ACTIVITY', label: `Activity Feed (${activities.length})`, icon: Activity },
            { id: 'SETTINGS', label: 'Team Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 transition ${
                  activeTab === tab.id
                    ? 'bg-brand-600 text-white shadow-subtle'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 2. OVERVIEW TAB */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Member Roster, Tasks & Skill Gap */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Progress Bar */}
            <Card className="p-5 space-y-2 bg-white border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 text-sm">Overall Workspace Progress</span>
                <span className="font-extrabold text-brand-600 text-sm">{progress.percentage}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                <div
                  className="bg-brand-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {progress.completedTasks} of {progress.totalTasks} task items completed.
              </p>
            </Card>

            {/* Active Members Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-600" /> Team Roster ({members.length} / {team.maxMembers})
                </h2>
              </div>

              <div className={`grid grid-cols-1 ${members.length > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
                {members.map((m) => (
                  <MemberCard
                    key={m.userId || m.id}
                    member={m as any}
                    isCurrentLead={team.isCurrentUserLead}
                    onRemoveMember={(id) => setMemberToRemove(id)}
                  />
                ))}
              </div>
            </div>

            {/* DIRECT ON TEAM PAGE: WHAT WE NEED TO DO & COMPLETED TASKS */}
            <Card className="p-6 space-y-6 border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-brand-600" />
                    <span>Team Work Responsibilities & Tasks</span>
                  </h3>
                  <p className="text-xs text-slate-500">Tasks assigned to members and finished deliverables.</p>
                </div>
                {(team.isCurrentUserLead || (team as any).isCurrentUserMember) && (
                  <Button
                    size="sm"
                    onClick={() => setIsTaskModalOpen(true)}
                    leftIcon={<Plus className="w-4 h-4" />}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    + Assign Task to Member
                  </Button>
                )}
              </div>

              {/* 1. What We Need to Do (Pending Tasks) */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center justify-between">
                  <span>📌 What We Need To Do To Complete This Project</span>
                  <span>{tasks.filter((t) => t.status !== 'COMPLETED').length} Pending</span>
                </h4>

                {tasks.filter((t) => t.status !== 'COMPLETED').length > 0 ? (
                  <div className="space-y-3">
                    {tasks
                      .filter((t) => t.status !== 'COMPLETED')
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="font-bold text-slate-900 text-sm">{t.title}</h5>
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                                t.priority === 'CRITICAL'
                                  ? 'bg-rose-100 text-rose-800'
                                  : t.priority === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {t.priority}
                            </span>
                          </div>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600">
                            <strong className="text-slate-800 block text-[11px] uppercase">
                              What member needs to do:
                            </strong>
                            <p>{t.description || 'No specific instructions provided.'}</p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="font-bold text-slate-700 text-xs">
                              Assigned to: <span className="text-brand-600">{t.assigneeName || 'Unassigned'}</span>
                            </span>
                            <button
                              onClick={() => handleUpdateTaskStatus(t.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition text-xs shadow-xs"
                            >
                              ✓ Mark as Complete
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">
                    No pending tasks. Click "+ Assign Task to Member" above to assign work to a team member.
                  </p>
                )}
              </div>

              {/* 2. What Has Been Completed */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <span>✅ Completed Deliverables & Who Completed It</span>
                  <span>{tasks.filter((t) => t.status === 'COMPLETED').length} Finished</span>
                </h4>

                {tasks.filter((t) => t.status === 'COMPLETED').length > 0 ? (
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.status === 'COMPLETED')
                      .map((t) => (
                        <div
                          key={t.id}
                          className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-bold text-slate-900 text-sm block">✓ {t.title}</span>
                            {t.description && <p className="text-slate-600 text-[11px]">{t.description}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Completed By</span>
                            <span className="font-bold text-emerald-900">{t.assigneeName || 'Team Member'}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic p-4 text-center bg-slate-50 rounded-xl">
                    No completed tasks yet.
                  </p>
                )}
              </div>
            </Card>

            {/* Skill Gap Analysis Card */}
            <Card className="p-6 space-y-4 border border-slate-200 shadow-subtle">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Code2 className="w-5 h-5 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Team Skill Gap Coverage</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">Covered Team Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {safeSkillsSummary.coveredSkills && safeSkillsSummary.coveredSkills.length > 0 ? (
                      safeSkillsSummary.coveredSkills.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded-lg border border-emerald-200">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No covered skills matched yet.</span>
                    )}
                  </div>
                </div>

                {safeSkillsSummary.missingSkills && safeSkillsSummary.missingSkills.length > 0 && (
                  <div>
                    <span className="font-bold text-rose-700 block mb-1.5">Missing Required Skill Gaps:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {safeSkillsSummary.missingSkills.map((s: string) => (
                        <span key={s} className="px-2.5 py-1 bg-rose-50 text-rose-800 font-semibold rounded-lg border border-rose-200">
                          ⚠ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Hackathon Event, Links, Announcements & Activity */}
          <div className="space-y-6">
            {/* Hackathon Details */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Event Challenge Context</h3>
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900">{safeEvent.title}</p>
                <p className="text-slate-500">Organizer: {safeEvent.organizer}</p>
                <p className="text-slate-500">Mode: {safeEvent.mode}</p>
              </div>
            </Card>

            {/* Team Links */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900">Team Resources & Links</h3>
                <button onClick={() => setIsLinkModalOpen(true)} className="text-brand-600 hover:underline text-xs font-bold flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {links.length > 0 ? (
                  links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-50 rounded-xl flex items-center justify-between text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition"
                    >
                      <span className="font-semibold">{link.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  ))
                ) : (
                  <p className="text-slate-400">No external links added yet.</p>
                )}
              </div>
            </Card>

            {/* Announcements Card */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-brand-600" /> Team Announcements
                </h3>
                {team.isCurrentUserLead && (
                  <button onClick={() => setIsAnnouncementModalOpen(true)} className="text-brand-600 hover:underline text-xs font-bold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Post
                  </button>
                )}
              </div>
              <div className="space-y-2 text-xs">
                {announcements.length > 0 ? (
                  announcements.slice(0, 3).map((a) => (
                    <div key={a.id} className="p-2.5 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                      <span className="font-bold text-slate-900 block">{a.title}</span>
                      <p className="text-slate-600 text-[11px] leading-tight">{a.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No announcements posted yet.</p>
                )}
              </div>
            </Card>

            {/* Activity Stream */}
            <Card className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-600" /> Recent Activity
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                {activities.length > 0 ? (
                  activities.slice(0, 4).map((act) => (
                    <div key={act.id} className="text-[11px] text-slate-600 border-b border-slate-100 pb-1.5 last:border-0">
                      <span className="font-bold text-slate-900">{act.userName}: </span>
                      {act.description}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400">No activity recorded yet.</p>
                )}
              </div>
            </Card>

            {/* Mentor Information */}
            {mentor && (
              <Card className="p-5 space-y-2 border-indigo-200 bg-indigo-50/30">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold text-indigo-950">Assigned Team Mentor</h3>
                </div>
                <div className="text-xs space-y-0.5">
                  <p className="font-bold text-slate-900">{mentor.name}</p>
                  <p className="text-slate-500">{mentor.jobTitle} • {mentor.company}</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 3. TASKS & WORKSPACE COLLABORATION TAB */}
      {activeTab === 'TASKS' && (
        <div className="space-y-8">
          {/* Header & Assign Task CTA */}
          <Card className="p-6 bg-linear-to-r from-brand-900 to-indigo-900 text-white rounded-3xl shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-brand-300 text-xs uppercase font-extrabold tracking-wider block mb-1">
                  Workspace Collaboration Board
                </span>
                <h2 className="text-xl font-bold text-white">Project Work Responsibilities & Deliverables</h2>
                <p className="text-xs text-brand-200 mt-1 max-w-xl">
                  Track what needs to be done to complete this project, view completed deliverables along with member details, and assign specific parts of work to team members.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsTaskModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shrink-0 shadow-lg"
              >
                + Assign Task to Member
              </Button>
            </div>
          </Card>

          {/* SECTION 1: WHAT WE NEED TO DO TO COMPLETE THIS PROJECT (Pending / In Progress) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span>What We Need To Do To Complete This Project</span>
                <span className="bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter((t) => t.status !== 'COMPLETED').length} Pending Items
                </span>
              </h3>
            </div>

            {tasks.filter((t) => t.status !== 'COMPLETED').length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks
                  .filter((t) => t.status !== 'COMPLETED')
                  .map((t) => (
                    <Card
                      key={t.id}
                      className="p-5 bg-white border border-slate-200 hover:border-brand-300 transition shadow-subtle flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-sm leading-snug">{t.title}</h4>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              t.priority === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : t.priority === 'HIGH'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {t.priority}
                          </span>
                        </div>

                        {/* What they need to do / instructions */}
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1">
                          <span className="font-extrabold text-slate-900 block text-[11px] uppercase tracking-wider">
                            Task Responsibility & Instructions:
                          </span>
                          <p className="text-slate-600 leading-relaxed">
                            {t.description || 'No detailed instructions provided yet for this task.'}
                          </p>
                        </div>
                      </div>

                      {/* Footer: Member Assignment & Quick Complete */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-[10px]">
                            {(t.assigneeName || 'Unassigned').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block leading-tight">Assigned Member</span>
                            <span className="font-bold text-slate-800">{t.assigneeName || 'Unassigned'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Select
                            value={t.status}
                            onChange={(e) => handleUpdateTaskStatus(t.id, e.target.value as any)}
                            options={[
                              { value: 'TO_DO', label: '⏳ To Do' },
                              { value: 'IN_PROGRESS', label: '🚀 In Progress' },
                              { value: 'COMPLETED', label: '✅ Completed' },
                            ]}
                            className="text-xs py-1 px-2 h-8"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 text-slate-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">All pending tasks completed!</p>
                <p>No remaining work items to do. Use "+ Assign Task to Member" to add new project deliverables.</p>
              </Card>
            )}
          </div>

          {/* SECTION 2: WHAT HAS BEEN COMPLETED (Completed Deliverables & Member Details) */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Completed Deliverables & Completed By Details</span>
                <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-xs font-bold">
                  {tasks.filter((t) => t.status === 'COMPLETED').length} Finished Items
                </span>
              </h3>
            </div>

            {tasks.filter((t) => t.status === 'COMPLETED').length > 0 ? (
              <div className="space-y-3">
                {tasks
                  .filter((t) => t.status === 'COMPLETED')
                  .map((t) => (
                    <Card
                      key={t.id}
                      className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{t.title}</h4>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            COMPLETED
                          </span>
                        </div>
                        {t.description && (
                          <p className="text-slate-600 pl-7 text-xs leading-relaxed">{t.description}</p>
                        )}
                      </div>

                      {/* Details of Who Completed This Task */}
                      <div className="sm:text-right shrink-0 bg-white px-3 py-2 rounded-xl border border-emerald-100 text-xs">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Completed By</span>
                        <span className="font-bold text-slate-900">{t.assigneeName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono mt-0.5">
                          {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Finished'}
                        </span>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-slate-200">
                No completed deliverables recorded yet. Update task status to "Completed" to show finished deliverables.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. ANNOUNCEMENTS TAB */}
      {activeTab === 'ANNOUNCEMENTS' && (
        <div className="space-y-6 max-w-3xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Team Announcements</h2>
            {team.isCurrentUserLead && (
              <Button size="sm" onClick={() => setIsAnnouncementModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Post Announcement
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((a) => (
                <Card key={a.id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{a.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{a.message}</p>
                  <p className="text-[10px] font-semibold text-slate-400 pt-1">Posted by {a.authorName}</p>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">No announcements posted yet.</div>
            )}
          </div>
        </div>
      )}

      {/* 5. ACTIVITY TAB */}
      {activeTab === 'ACTIVITY' && (
        <div className="space-y-4 max-w-3xl">
          <h2 className="text-lg font-bold text-slate-900">Team Activity Timeline</h2>
          <Card className="p-0 overflow-hidden border border-slate-200">
            <div className="divide-y divide-slate-100 text-xs">
              {activities.length > 0 ? (
                activities.map((act) => (
                  <div key={act.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900">{act.userName}: </span>
                      <span className="text-slate-600">{act.description}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(act.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">No activity recorded yet.</div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 6. SETTINGS TAB */}
      {activeTab === 'SETTINGS' && (
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900">Workspace & Leadership Settings</h2>
          {team.isCurrentUserLead ? (
            <Card className="p-6 space-y-4">
              <div className="space-y-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTransferModalOpen(true)}
                  fullWidth
                  className="justify-start border-amber-300 text-amber-900 hover:bg-amber-50"
                >
                  Transfer Team Leadership
                </Button>
                <button
                  onClick={handleDeleteTeam}
                  className="w-full py-2.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Disband & Delete Team Workspace
                </button>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-xs text-slate-500">
              Only the authorized Team Lead can modify team settings.
            </Card>
          )}
        </div>
      )}

      {/* Create / Assign Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateTask} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-modal">
            <div>
              <h3 className="text-base font-bold text-slate-900">Assign Task to Team Member</h3>
              <p className="text-xs text-slate-500">Define the work item and specify what your team member needs to do.</p>
            </div>
            <TextInput label="Task Title / Feature Area *" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="e.g. Build Backend Auth API" required />
            <Select
              label="Assign To Team Member *"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              options={[
                { value: '', label: 'Select Team Member' },
                ...members.map((m) => ({ value: m.userId || m.id || '', label: m.name })),
              ]}
              required
            />
            <Textarea
              label="What is their part? (Detailed Instructions & Deliverables) *"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder="Explain what the member needs to build or complete for this task..."
              rows={3}
              required
            />
            <Select
              label="Priority Level"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              options={[
                { value: 'LOW', label: 'Low Priority' },
                { value: 'MEDIUM', label: 'Medium Priority' },
                { value: 'HIGH', label: 'High Priority' },
                { value: 'CRITICAL', label: 'Critical Priority' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <Button type="submit" size="sm">Assign Task</Button>
            </div>
          </form>
        </div>
      )}

      {/* Post Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateAnnouncement} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-modal">
            <h3 className="text-base font-bold text-slate-900">Post Team Announcement</h3>
            <TextInput label="Announcement Title" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} required />
            <TextInput label="Message" value={annMsg} onChange={(e) => setAnnMsg(e.target.value)} required />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <Button type="submit" size="sm">Post</Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleAddLink} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-modal">
            <h3 className="text-base font-bold text-slate-900">Add Team Resource Link</h3>
            <TextInput label="Link Title" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="e.g. Figma Prototype" required />
            <TextInput label="URL" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." required />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsLinkModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <Button type="submit" size="sm">Add Link</Button>
            </div>
          </form>
        </div>
      )}

      {/* Transfer Leadership Modal */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-modal">
            <h3 className="text-base font-bold text-slate-900">Transfer Team Leadership</h3>
            <p className="text-xs text-slate-600">Select an active team member to become the new Team Lead:</p>
            <Select
              value={newLeadId}
              onChange={(e) => setNewLeadId(e.target.value)}
              options={[
                { value: '', label: 'Select New Lead' },
                ...members.filter((m) => (m.userId || m.id) !== team.teamLead.id).map((m) => ({ value: m.userId || m.id || '', label: m.name })),
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setIsTransferModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold">
                Cancel
              </button>
              <Button onClick={handleTransferLeadership} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                Confirm Transfer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Request Modal */}
      {isRequestModalOpen && (
        <JoinRequestModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          teamName={team.name}
          onSubmit={handleSendJoinRequest}
        />
      )}

      {/* Remove Member Confirmation Modal */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-left shadow-modal">
            <h3 className="text-base font-bold text-slate-900">Remove Member</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove this member from your team workspace?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setMemberToRemove(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMemberConfirm}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold hover:bg-rose-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
