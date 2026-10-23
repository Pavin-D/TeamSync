import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { studentService, StudentProfileData } from '@/services/api/studentService';
import { Card, Avatar, Badge, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ProfileCompletionWidget } from '@/components/ui/ProfileCompletionWidget';
import { SkeletonLoader } from '@/components/ui/Feedback';
import {
  GraduationCap,
  Github,
  Linkedin,
  MapPin,
  CheckCircle2,
  Edit3,
  Globe,
  Phone,
  Lock,
} from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const normalizeProfileData = (data: any, u: any): StudentProfileData => {
    const src = data || {};
    const inst = typeof src.institution === 'string' ? src.institution : src.college?.name || u?.studentProfile?.college?.name || u?.institution || 'College Not Set';
    const dept = typeof src.department === 'string' ? src.department : src.department?.name || u?.studentProfile?.department?.name || u?.department || 'Department Not Set';

    const rawSkills = src.skills || u?.skills || [];
    const skillsList = Array.isArray(rawSkills)
      ? rawSkills.map((s: any) => (typeof s === 'string' ? s : s?.name || s?.skill?.name || String(s))).filter(Boolean)
      : [];

    const yr = src.yearOfStudy || u?.studentProfile?.yearOfStudy;
    const yrStr = yr ? (typeof yr === 'number' ? `Year ${yr}` : String(yr)) : '1st Year';

    const locObj = src.location || src.locationPref || u?.studentProfile?.location;
    const cityStr = locObj
      ? typeof locObj.approximateCity === 'string'
        ? locObj.approximateCity
        : locObj.city
        ? `${locObj.city}${locObj.state ? `, ${locObj.state}` : ''}`
        : 'Location Set'
      : 'Location Not Set';

    return {
      id: src.userId || src.id || u?.id || 'usr_db',
      name: src.name || u?.name || 'Student User',
      email: src.email || u?.email || 'student@university.edu',
      role: 'STUDENT',
      avatarUrl: src.profileImage || src.avatarUrl || u?.avatarUrl,
      institution: inst,
      department: dept,
      bio: src.bio || u?.studentProfile?.bio || u?.bio || 'No bio added yet.',
      mobile: src.phone || src.mobile || u?.phone || 'Not provided',
      course: src.course || 'Bachelor of Science / Technology',
      yearOfStudy: yrStr,
      githubUrl: src.githubUrl || u?.studentProfile?.githubUrl || undefined,
      githubConnected: !!(src.githubUrl || u?.studentProfile?.githubUrl),
      githubLastAnalyzed: src.githubUrl ? 'Recently' : undefined,
      linkedInUrl: src.linkedinUrl || src.linkedInUrl || u?.studentProfile?.linkedinUrl || undefined,
      linkedInConnected: !!(src.linkedinUrl || src.linkedInUrl || u?.studentProfile?.linkedinUrl),
      skills: skillsList,
      availability: {
        availableForTeams: src.availability?.availableForTeams ?? true,
        academicProjects: src.availability?.academicProjects ?? true,
        hackathons: src.availability?.hackathons ?? true,
        longTermProjects: src.availability?.longTermProjects ?? false,
      },
      locationPref: {
        allowed: true,
        approximateCity: cityStr,
      },
      visibility: src.visibility || 'STUDENTS_ONLY',
      profileCompletionPercentage: src.profileCompletion || src.profileCompletionPercentage || 70,
      githubAnalytics: src.githubAnalytics,
    };
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await studentService.getStudentProfile();
        if (response.success && response.data) {
          setProfile(normalizeProfileData(response.data, user));
        } else {
          setProfile(normalizeProfileData(null, user));
        }
      } catch {
        setProfile(normalizeProfileData(null, user));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={3} className="h-40" />;
  }

  const p = profile || normalizeProfileData(null, user);

  return (
    <div className="space-y-6 text-left pb-12">
      {/* 1. Header Banner & Profile Card */}
      <Card className="p-6 relative overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-none shadow-modal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar name={p.name} src={p.avatarUrl} size="xl" className="ring-4 ring-white/20" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{p.name}</h1>
                <Badge variant="primary">Student</Badge>
              </div>
              <p className="text-xs text-indigo-200 font-medium">{p.department}</p>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" /> {p.institution} • {p.yearOfStudy}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <Button
              onClick={() => navigate('/student/profile/edit')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-semibold"
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">About / Bio</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{p.bio || 'No bio added yet.'}</p>
          </Card>

          {/* Academic Information */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Academic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">University / College</span>
                <span className="font-bold text-slate-800">{p.institution}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Department</span>
                <span className="font-bold text-slate-800">{p.department}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Degree / Course</span>
                <span className="font-bold text-slate-800">{p.course}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 block mb-0.5">Year of Study</span>
                <span className="font-bold text-slate-800">{p.yearOfStudy}</span>
              </div>
            </div>
          </Card>

          {/* Technical Skills */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Technical Skills & Tools</h3>
            {p.skills && p.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {p.skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No technical skills added yet. Update profile or connect GitHub.</p>
            )}
          </Card>

          {/* GitHub Analytics */}
          {p.githubAnalytics && (
            <Card>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Github className="w-4 h-4" /> GitHub Analytics
              </h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-800">{p.githubAnalytics.totalCommits || 0}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Commits</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-800">{p.githubAnalytics.totalStars || 0}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Stars</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-800">{p.githubAnalytics.totalForks || 0}</span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Forks</span>
                </div>
              </div>

              {p.githubAnalytics.topRepositories && p.githubAnalytics.topRepositories.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Top Projects</h4>
                  {p.githubAnalytics.topRepositories.map((repo: any) => (
                    <div key={repo.name} className="p-4 border border-slate-100 rounded-xl">
                      <div className="flex justify-between items-start mb-2">
                        <a href={repo.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-brand-600 hover:underline">
                          {repo.name}
                        </a>
                        {repo.language && (
                          <Badge variant="primary" className="text-[10px]">{repo.language}</Badge>
                        )}
                      </div>
                      {repo.description && <p className="text-xs text-slate-600 mb-3">{repo.description}</p>}
                      
                      {repo.recentCommits && repo.recentCommits.length > 0 && (
                        <div className="bg-slate-50 p-2 rounded-lg space-y-2 mt-2">
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Recent Commits</p>
                          {repo.recentCommits.slice(0, 3).map((commit: any, idx: number) => (
                            <div key={idx} className="text-xs text-slate-600 truncate border-l-2 border-brand-200 pl-2">
                              <span className="font-semibold">{commit.author}:</span> {commit.message}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* GitHub & LinkedIn Profiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-slate-900" />
                    <h4 className="text-sm font-bold text-slate-900">GitHub Profile</h4>
                  </div>
                  {p.githubConnected ? (
                    <Badge variant="success">Connected ✓</Badge>
                  ) : (
                    <Badge variant="warning">Not Connected</Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  {p.githubUrl ? p.githubUrl.replace('https://', '') : 'No GitHub profile linked'}
                </p>

                {p.githubConnected && p.githubLastAnalyzed && (
                  <p className="text-[11px] text-slate-400">Last analyzed: {p.githubLastAnalyzed}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3">
                {p.githubConnected ? (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View GitHub Profile</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Button size="sm" fullWidth onClick={() => navigate('/student/profile/edit')}>
                    Connect GitHub
                  </Button>
                )}
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900">LinkedIn Profile</h4>
                  </div>
                  {p.linkedInConnected ? (
                    <Badge variant="success">Connected ✓</Badge>
                  ) : (
                    <Badge variant="default">Not Added</Badge>
                  )}
                </div>

                <p className="text-xs text-slate-500 mb-3">
                  {p.linkedInUrl ? p.linkedInUrl.replace('https://', '') : 'No LinkedIn profile linked'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3">
                {p.linkedInConnected ? (
                  <a
                    href={p.linkedInUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-brand-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View LinkedIn</span>
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/student/profile/edit')}>
                    Add LinkedIn
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column: Preferences, Availability, Contact Privacy */}
        <div className="space-y-6">
          <ProfileCompletionWidget />

          {/* Availability Settings Card */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Collaboration Availability</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Available for Teams</span>
                <Badge variant={p.availability?.availableForTeams ? 'success' : 'default'}>
                  {p.availability?.availableForTeams ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Hackathons</span>
                <CheckCircle2 className={`w-4 h-4 ${p.availability?.hackathons ? 'text-emerald-600' : 'text-slate-300'}`} />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Academic Projects</span>
                <CheckCircle2 className={`w-4 h-4 ${p.availability?.academicProjects ? 'text-emerald-600' : 'text-slate-300'}`} />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Long-term Projects</span>
                <CheckCircle2 className={`w-4 h-4 ${p.availability?.longTermProjects ? 'text-emerald-600' : 'text-slate-300'}`} />
              </div>
            </div>
          </Card>

          {/* Privacy & Location Settings */}
          <Card>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Privacy & Location</h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Approximate Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  {p.locationPref?.allowed ? p.locationPref?.approximateCity || 'Enabled' : 'Disabled'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Masked Mobile Number</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {p.mobile}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-0.5">Profile Visibility</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  {p.visibility}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
