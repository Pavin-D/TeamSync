import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { studentService, StudentDashboardData } from '@/services/api/studentService';
import { searchService } from '@/services/api/searchService';
import { teamService } from '@/services/api/teamService';
import { mentorService } from '@/services/api/mentorService';
import { recommendationService, RecommendedTeam } from '@/services/api/recommendationService';
import { MyTeamsPreviewSection } from '@/components/student/MyTeamsPreviewSection';
import { Card, Avatar } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import {
  Sparkles,
  Github,
  ArrowRight,
  UserPlus,
  Users,
  Calendar,
  Inbox,
  MailCheck,
  Building2,
  GraduationCap,
  Globe,
  LayoutDashboard,
  Briefcase,
  Crown,
  Search,
  Filter,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';

  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null);

  // My College Data
  const [collegeStudents, setCollegeStudents] = useState<any[]>([]);
  const [collegeTeams, setCollegeTeams] = useState<any[]>([]);

  // My Department Data
  const [departmentStudents, setDepartmentStudents] = useState<any[]>([]);
  const [departmentTeams, setDepartmentTeams] = useState<any[]>([]);

  // Global Data & My Teams
  const [globalStudents, setGlobalStudents] = useState<any[]>([]);
  const [globalProfessionals, setGlobalProfessionals] = useState<any[]>([]);
  const [recommendedTeams, setRecommendedTeams] = useState<RecommendedTeam[]>([]);
  const [globalTeams, setGlobalTeams] = useState<any[]>([]);
  const [myTeams, setMyTeams] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isTabLoading, setIsTabLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  const applyFilters = (items: any[], type: 'STUDENT' | 'TEAM' | 'MENTOR') => {
    if (!items || items.length === 0) return items;
    
    let filtered = items;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name || '').toLowerCase().includes(query) || 
        (item.title || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.skills && item.skills.some((s: string) => s.toLowerCase().includes(query)))
      );
    }
    
    if (type === 'TEAM' && filterStatus !== 'ALL') {
      filtered = filtered.filter(item => (item.status || 'RECRUITING') === filterStatus);
    }
    
    if (type === 'STUDENT' && filterRole !== 'ALL') {
      filtered = filtered.filter(item => item.role === filterRole || filterRole === 'ALL');
    }

    if (filterDepartment !== 'ALL') {
      filtered = filtered.filter(item => {
        const dept = item.department?.name || item.departmentName || '';
        return dept.toLowerCase().includes(filterDepartment.toLowerCase());
      });
    }
    
    return filtered;
  };

  const renderFilterBar = (showStatusFilter = false, showRoleFilter = false, showDeptFilter = false) => (
    <div className="flex flex-col md:flex-row items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 mb-6 shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search by name, title, description, or skills..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 transition outline-none"
        />
      </div>
      
      <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        {(showStatusFilter || showRoleFilter || showDeptFilter) && (
          <div className="flex items-center gap-2 pl-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            
            {showStatusFilter && (
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border-none rounded-xl text-xs sm:text-sm py-2 px-3 focus:ring-2 focus:ring-brand-500/20 text-slate-700 outline-none min-w-[120px]"
              >
                <option value="ALL">All Statuses</option>
                <option value="RECRUITING">Recruiting</option>
                <option value="FULL">Full</option>
              </select>
            )}

            {showRoleFilter && (
              <select 
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="bg-slate-50 border-none rounded-xl text-xs sm:text-sm py-2 px-3 focus:ring-2 focus:ring-brand-500/20 text-slate-700 outline-none min-w-[120px]"
              >
                <option value="ALL">All Roles</option>
                <option value="STUDENT">Student</option>
                <option value="PROFESSIONAL">Professional</option>
                <option value="MENTOR">Mentor</option>
              </select>
            )}

            {showDeptFilter && (
              <select 
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="bg-slate-50 border-none rounded-xl text-xs sm:text-sm py-2 px-3 focus:ring-2 focus:ring-brand-500/20 text-slate-700 outline-none min-w-[120px]"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">IT</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const fetchDashboard = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [response, myTeamsRes, recTeamsRes] = await Promise.all([
        studentService.getStudentDashboard(),
        teamService.getUserTeams(),
        recommendationService.getRecommendedTeams().catch(() => ({ success: false, data: [] }))
      ]);

      if (response.success && response.data) {
        setDashboardData(response.data);
      } else {
        setDashboardData(getEmptyDashboardData());
      }

      if (myTeamsRes.success && myTeamsRes.data) {
        setMyTeams(myTeamsRes.data);
      }
      if (recTeamsRes.success && recTeamsRes.data) {
        setRecommendedTeams(recTeamsRes.data);
      }
    } catch {
      setDashboardData(getEmptyDashboardData());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTabData = async (tab: string) => {
    setIsTabLoading(true);
    try {
      if (tab === 'college') {
        const collegeId = (user as any)?.studentProfile?.collegeId || (user as any)?.collegeId;
        const collegeName = (user as any)?.studentProfile?.college?.name || 'College';

        const [studentsRes, teamsRes] = await Promise.all([
          searchService.searchPeople({
            role: 'STUDENT',
            collegeId: collegeId || undefined,
            collegeName: collegeId ? undefined : collegeName,
          }),
          teamService.getTeams({
            scope: 'COLLEGE',
            collegeId: collegeId || undefined,
            collegeName: collegeId ? undefined : collegeName,
          }),
        ]);

        if (studentsRes.success && studentsRes.data) setCollegeStudents(studentsRes.data);
        if (teamsRes.success && teamsRes.data) setCollegeTeams(teamsRes.data);

      } else if (tab === 'department') {
        const departmentId = (user as any)?.studentProfile?.departmentId || (user as any)?.departmentId;
        const departmentName = (user as any)?.studentProfile?.department?.name || 'Computer Science';

        const [studentsRes, teamsRes] = await Promise.all([
          searchService.searchPeople({
            role: 'STUDENT',
            departmentId: departmentId || undefined,
            departmentName: departmentId ? undefined : departmentName,
          }),
          teamService.getTeams({
            scope: 'DEPARTMENT',
            departmentId: departmentId || undefined,
            departmentName: departmentId ? undefined : departmentName,
          }),
        ]);

        if (studentsRes.success && studentsRes.data) setDepartmentStudents(studentsRes.data);
        if (teamsRes.success && teamsRes.data) setDepartmentTeams(teamsRes.data);

      } else if (tab === 'global') {
        const [teamsRes, studentsRes, prosRes] = await Promise.all([
          teamService.getTeams({ scope: 'GLOBAL' }),
          searchService.searchPeople({ role: 'STUDENT' }),
          mentorService.getMentors({ limit: 100 }),
        ]);

        if (teamsRes.success && teamsRes.data) setGlobalTeams(teamsRes.data);
        if (studentsRes.success && studentsRes.data) setGlobalStudents(studentsRes.data);
        if (prosRes.success && prosRes.data) setGlobalProfessionals(prosRes.data);

      } else if (tab === 'my-teams') {
        const myTeamsRes = await teamService.getUserTeams();
        if (myTeamsRes.success && myTeamsRes.data) {
          setMyTeams(myTeamsRes.data);
        }
      }
    } catch (err) {
      console.error('Failed to load tab data:', err);
    } finally {
      setIsTabLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab !== 'overview') {
      fetchTabData(activeTab);
    }
  }, [activeTab]);

  const getEmptyDashboardData = (): StudentDashboardData => ({
    welcomeName: user?.name || 'Student',
    activeTeamsCount: 0,
    upcomingEventsCount: 0,
    profileCompletionPercentage: 100,
    skillMatchScore: 100,
    skills: [],
    events: [],
    recommendedTeammates: [],
    nearbyPeople: [],
    mentors: [],
    myTeams: [],
    joinRequests: [],
    invitations: [],
    ranking: {
      collegeRank: 0,
      globalRank: 0,
      hackathonsParticipated: 0,
      hackathonsWon: 0,
    },
    participation: [],
  });

  const setTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 text-left">
        <SkeletonLoader variant="card" count={1} className="h-32" />
        <SkeletonLoader variant="card" count={3} />
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message="Unable to connect to the student dashboard service."
        onRetry={fetchDashboard}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* 1. Header Welcome & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || dashboardData.welcomeName}!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Student Overview
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => navigate('/teams/create')}>Form New Team</Button>
          <SecondaryButton onClick={() => navigate('/events')}>Discover Events</SecondaryButton>
        </div>
      </div>

      {/* 2. Primary Dedicated Navigation Options Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Overview
        </button>

        <button
          onClick={() => setTab('my-teams')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'my-teams'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Crown className="w-4 h-4 text-amber-500" /> My Teams ({myTeams.length})
        </button>

        <button
          onClick={() => setTab('college')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'college'
              ? 'bg-brand-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4 text-brand-500" /> My College Students
        </button>

        <button
          onClick={() => setTab('department')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'department'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-indigo-500" /> My Department (CSE)
        </button>

        <button
          onClick={() => setTab('global')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
            activeTab === 'global'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-500" /> Global Hackathons & Teams
        </button>
      </div>

      {/* 3. DYNAMIC TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-brand-600" />
                <span className="text-xs text-slate-500 font-medium">Active Teams</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{dashboardData.activeTeamsCount}</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-xs text-slate-500 font-medium">Events Registered</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{dashboardData.upcomingEventsCount}</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Inbox className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-slate-500 font-medium">Pending Requests</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{dashboardData.joinRequests.length}</span>
            </Card>

            <Card className="p-4 bg-white border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <MailCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-slate-500 font-medium">Invitations</span>
              </div>
              <span className="text-xl font-bold text-slate-900">{dashboardData.invitations.length}</span>
            </Card>
          </div>

          {/* GitHub Skill Analysis & AI Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dashboardData.githubAnalytics ? (
              <Card className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-white" /> GitHub Analytics
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      Verified
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="p-2 bg-white/10 rounded-lg flex flex-col items-center">
                      <span className="text-xl font-bold">{dashboardData.githubAnalytics.totalCommits || 0}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Commits</span>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg flex flex-col items-center">
                      <span className="text-xl font-bold">{dashboardData.githubAnalytics.totalStars || 0}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Stars</span>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg flex flex-col items-center">
                      <span className="text-xl font-bold">{dashboardData.githubAnalytics.totalForks || 0}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">Forks</span>
                    </div>
                  </div>
                  {dashboardData.githubAnalytics.topRepositories && dashboardData.githubAnalytics.topRepositories.length > 0 && (
                    <div className="mb-4">
                      <p className="text-[10px] text-slate-300 uppercase tracking-wider mb-2">Top Project</p>
                      <a href={dashboardData.githubAnalytics.topRepositories[0].url} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-300 hover:underline">
                        {dashboardData.githubAnalytics.topRepositories[0].name}
                      </a>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/github-analysis')}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold self-start"
                  rightIcon={<ArrowRight className="w-4 h-4 text-brand-600" />}
                >
                  View Full Dashboard
                </Button>
              </Card>
            ) : (
              <Card className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-white" /> Technical Skill Profile
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">AI Technical Analysis</h3>
                  <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                    Technical skills verified from your synced GitHub repositories and skill analysis.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/github-analysis')}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-semibold self-start"
                  rightIcon={<ArrowRight className="w-4 h-4 text-brand-600" />}
                >
                  View GitHub Skill Dashboard
                </Button>
              </Card>
            )}

            <Card className="p-6 bg-gradient-to-br from-brand-600 via-indigo-700 to-violet-800 text-white border-none shadow-modal flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" /> AI Teammate Recommendations
                  </span>
                </div>
                  <h3 className="text-lg font-bold text-white mb-2">Smart Teammate Matches</h3>
                  <p className="text-xs text-indigo-100 mb-4 leading-relaxed">
                    Discover teams or hackathons looking for your specific skills.
                  </p>
                  
                  {recommendedTeams.length > 0 ? (
                    <div className="space-y-3 mb-4">
                      {recommendedTeams.slice(0, 2).map(team => (
                        <div key={team.id || team.teamId} className="bg-white/10 rounded-lg p-3 border border-white/20">
                           <h4 className="font-bold text-sm text-white mb-1">{team.name || team.teamName}</h4>
                           <p className="text-xs text-indigo-200 mb-2 truncate">{team.eventName}</p>
                           <div className="flex flex-wrap gap-1 mt-2">
                             {team.requiredSkills && team.requiredSkills.map(skill => (
                               <span key={skill} className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold text-white">
                                 {skill}
                               </span>
                             ))}
                           </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/10 rounded-lg p-4 mb-4 border border-white/20 text-xs text-center text-indigo-100">
                       No highly matched teams found for your current skills.
                    </div>
                  )}

                </div>
              <Button
                size="sm"
                onClick={() => navigate('/recommendations')}
                className="bg-white text-slate-900 hover:bg-slate-100 font-semibold self-start"
                leftIcon={<UserPlus className="w-4 h-4 text-brand-600" />}
              >
                Explore AI Teammate Recommendations
              </Button>
            </Card>
          </div>

          {/* My Teams Preview Section */}
          <MyTeamsPreviewSection teams={dashboardData.myTeams} />
        </div>
      )}

      {/* TAB 2: MY COLLEGE (STUDENTS + TEAMS) */}
      {activeTab === 'college' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs font-bold text-brand-300 uppercase tracking-wider block">My Institution Hub</span>
              <h2 className="text-xl font-extrabold text-white mt-1">My College (Students & Teams)</h2>
              <p className="text-xs text-slate-300 mt-1">
                Showing students and active teams registered under your institution.
              </p>
            </div>
            <Button size="sm" onClick={() => navigate('/teams/create')}>Form College Team</Button>
          </div>

          {renderFilterBar(true, true, true)}

          {/* Section 1: College Students */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" /> College Students ({collegeStudents.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : collegeStudents.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No college peers registered yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applyFilters(collegeStudents, 'STUDENT').map((person) => (
                  <Card key={person.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={person.name} src={person.avatarUrl} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{person.name}</h4>
                          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {person.collegeName || 'My College'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        <GraduationCap className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                        {person.departmentName || 'Computer Science'} • {person.yearOfStudy ? `Year ${person.yearOfStudy}` : 'Student'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/candidates/${person.id}`)}>
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: College Teams */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> College Teams ({collegeTeams.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : collegeTeams.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No active college teams formed yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applyFilters(collegeTeams, 'TEAM').map((team) => (
                  <Card key={team.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{team.name}</h4>
                        <span className="text-[10px] font-bold bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full border border-brand-200">
                          {team.status || 'RECRUITING'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{team.description || 'College team recruiting members.'}</p>
                      <p className="text-xs text-slate-500 mb-4">
                        Members: <strong className="text-slate-900">{team.currentMembers || 1} / {team.maxMembers || 4}</strong>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/teams/${team.id}`)}>
                        View Team Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MY DEPARTMENT (STUDENTS + TEAMS) */}
      {activeTab === 'department' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-gradient-to-r from-indigo-900 to-violet-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">Department Hub</span>
              <h2 className="text-xl font-extrabold text-white mt-1">My Department (Students & Teams)</h2>
              <p className="text-xs text-slate-300 mt-1">
                Showing classmates and department teams.
              </p>
            </div>
            <SecondaryButton size="sm" onClick={() => navigate('/teams/create')}>Form Dept Team</SecondaryButton>
          </div>

          {renderFilterBar(true, true, false)}

          {/* Section 1: Department Students */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Department Classmates ({departmentStudents.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : departmentStudents.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No classmates registered in your department yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applyFilters(departmentStudents, 'STUDENT').map((person) => (
                  <Card key={person.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={person.name} src={person.avatarUrl} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{person.name}</h4>
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {person.departmentName || 'Computer Science (CSE)'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        {person.collegeName || 'University'} • {person.yearOfStudy ? `Year ${person.yearOfStudy}` : 'Student'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/candidates/${person.id}`)}>
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Department Teams */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" /> Department Teams ({departmentTeams.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : departmentTeams.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No department teams active currently.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {applyFilters(departmentTeams, 'TEAM').map((team) => (
                  <Card key={team.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{team.name}</h4>
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                          {team.status || 'RECRUITING'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{team.description || 'Department team recruiting members.'}</p>
                      <p className="text-xs text-slate-500 mb-4">
                        Members: <strong className="text-slate-900">{team.currentMembers || 1} / {team.maxMembers || 4}</strong>
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/teams/${team.id}`)}>
                        View Team Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: MY TEAMS */}
      {activeTab === 'my-teams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-600 text-white rounded-xl">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">My Active Teams</h3>
                <p className="text-xs text-slate-600">All hackathon teams you are currently in as a member or team lead</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              {myTeams.length} Active Teams
            </span>
          </div>

          {isTabLoading ? (
            <SkeletonLoader variant="card" count={3} />
          ) : myTeams.length === 0 ? (
            <Card className="p-8 text-center bg-white border-dashed border-slate-300">
              <Crown className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-900">No Active Team Memberships</h4>
              <p className="text-xs text-slate-500 mt-1">You are not currently in any teams. Browse hackathon teams to join one!</p>
              <div className="mt-4">
                <Button size="sm" onClick={() => setTab('global')}>
                  Browse Global Teams
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTeams.map((team) => (
                <Card key={team.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                        {team.name}
                        {team.role === 'LEAD' && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-600" /> Team Lead
                          </span>
                        )}
                      </h4>
                      <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                        {team.status || 'ACTIVE'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 line-clamp-2">{team.description || 'Active hackathon team workspace.'}</p>

                    <div className="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                      <span>Event: <strong>{team.eventName || 'Global Event'}</strong></span>
                      <span>Members: <strong>{team.currentMembersCount || team.members?.length || 1} / {team.maxMembers || 4}</strong></span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => navigate(`/teams/${team.id}`)}>
                      View Team Details
                    </Button>
                    {team.role === 'LEAD' && (
                      <SecondaryButton size="sm" onClick={() => navigate(`/teams/${team.id}/requests`)}>
                        Manage Requests
                      </SecondaryButton>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: GLOBAL DISCOVERY (TEAMS + STUDENTS + WORK PROFESSIONALS) */}
      {activeTab === 'global' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">Global Discovery Hub</span>
              <h2 className="text-xl font-extrabold text-white mt-1">Global Hackathons, Students & Work Professionals</h2>
              <p className="text-xs text-slate-300 mt-1">
                Explore global teams, students across all institutions, and industry work professionals.
              </p>
            </div>
            <Button size="sm" onClick={() => navigate('/teams/create')}>Form Global Team</Button>
          </div>

          {renderFilterBar(true, true, true)}

          {/* Section 1: Global Teams */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Global Teams ({globalTeams.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={2} />
            ) : globalTeams.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No active global teams formed yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applyFilters(globalTeams, 'TEAM').map((t) => (
                  <Card key={t.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{t.name}</h4>
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                          {t.status || 'RECRUITING'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{t.description || 'Global hackathon team recruiting members.'}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span>Members: <strong className="text-slate-900">{t.currentMembers || 1} / {t.maxMembers || 4}</strong></span>
                        <span>Scope: <strong className="text-slate-900">{t.scope || 'GLOBAL'}</strong></span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/teams/${t.id}`)}>
                        View Team Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Global Students */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" /> Global Students ({globalStudents.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : globalStudents.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No global students found.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applyFilters(globalStudents, 'STUDENT').map((person) => (
                  <Card key={person.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar name={person.name} src={person.avatarUrl} size="md" />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{person.name}</h4>
                          <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                            {person.collegeName || 'Student'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">
                        {person.departmentName || 'Computer Science'} • {person.yearOfStudy ? `Year ${person.yearOfStudy}` : 'Student'}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <Button size="sm" fullWidth onClick={() => navigate(`/candidates/${person.id}`)}>
                        View Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Work Professionals */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-600" /> Work Professionals ({globalProfessionals.length})
            </h3>
            {isTabLoading ? (
              <SkeletonLoader variant="card" count={3} />
            ) : globalProfessionals.length === 0 ? (
              <Card className="p-6 text-center bg-white border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No work professionals registered yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applyFilters(globalProfessionals, 'MENTOR').map((pro) => (
                  <Card key={pro.id} className="p-5 bg-white border-slate-200 hover:shadow-md transition flex flex-col justify-between">
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
                    <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/teams/invite?userId=${pro.id}`)}
                        className="bg-brand-600 hover:bg-brand-700 text-white text-[11px] font-bold py-1.5 px-1"
                      >
                        Invite Member
                      </Button>
                      <SecondaryButton
                        size="sm"
                        onClick={() => navigate(`/mentors/${pro.id}`)}
                        className="text-[11px] font-bold py-1.5 px-1"
                      >
                        Request Mentor
                      </SecondaryButton>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
