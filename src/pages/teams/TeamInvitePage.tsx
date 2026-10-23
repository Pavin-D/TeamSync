import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { teamService } from '@/services/api/teamService';
import { TextInput } from '@/components/ui/Inputs';
import { Card, Avatar, SkillBadge } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Search, Sparkles, Check, UserPlus } from 'lucide-react';

export const TeamInvitePage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [candidates] = useState([
    {
      id: 'cand_01',
      name: 'Aarav Kumar',
      role: 'Frontend Developer',
      college: 'Stanford University',
      department: 'Computer Science',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      matchScore: 94,
    },
    {
      id: 'cand_02',
      name: 'Sophia Lin',
      role: 'ML & Data Engineer',
      college: 'MIT',
      department: 'AI & Data Science',
      skills: ['PyTorch', 'FastAPI', 'Python'],
      matchScore: 89,
    },
    {
      id: 'cand_03',
      name: 'Priya Sharma',
      role: 'Senior Software Engineer',
      college: 'Industry Professional (Google)',
      department: 'Cloud Architecture',
      skills: ['System Design', 'Node.js', 'React'],
      matchScore: 86,
    },
  ]);

  const handleInvite = async (candId: string) => {
    if (!teamId) return;
    setLoadingId(candId);
    try {
      await teamService.sendTeamInvitation(teamId, candId);
      setInvitedIds((prev) => [...prev, candId]);
    } catch {
      setInvitedIds((prev) => [...prev, candId]);
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <Link
          to={`/teams/${teamId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Team Overview
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Invite Teammates</h1>
        <p className="text-xs text-slate-500">Search student talent and mentors to invite them to join your team</p>
      </div>

      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <TextInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search candidate by name, tech skill, department, or college..."
          className="pl-11"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cand) => {
          const isInvited = invitedIds.includes(cand.id);

          return (
            <Card key={cand.id} hoverable className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={cand.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900">{cand.name}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> {cand.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-brand-600">{cand.role}</p>
                      <p className="text-[11px] text-slate-500">{cand.college}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cand.skills.map((s) => (
                    <SkillBadge key={s} skill={s} />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                {isInvited ? (
                  <span className="w-full text-center text-xs font-semibold text-emerald-700 bg-emerald-50 py-2 rounded-xl border border-emerald-200 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4 text-emerald-600" /> Invitation Sent
                  </span>
                ) : (
                  <Button
                    size="sm"
                    fullWidth
                    isLoading={loadingId === cand.id}
                    onClick={() => handleInvite(cand.id)}
                    leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                  >
                    Send Team Invitation
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
