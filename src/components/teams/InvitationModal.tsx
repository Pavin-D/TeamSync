import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TextInput } from '@/components/ui/Inputs';
import { Avatar, SkillBadge } from '@/components/ui/Cards';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Search, Sparkles, Check } from 'lucide-react';

export interface CandidateItem {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  college: string;
  skills: string[];
  matchScore: number;
  isInvited?: boolean;
}

export interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  onSendInvite: (candidateId: string) => Promise<void>;
}

export const InvitationModal: React.FC<InvitationModalProps> = ({
  isOpen,
  onClose,
  teamName,
  onSendInvite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [invitedIds, setInvitedIds] = useState<string[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [candidates] = useState<CandidateItem[]>([
    {
      id: 'usr_cand_01',
      name: 'Aarav Kumar',
      role: 'Frontend Developer',
      college: 'Stanford University',
      skills: ['React', 'TypeScript', 'Tailwind'],
      matchScore: 94,
    },
    {
      id: 'usr_cand_02',
      name: 'Sophia Lin',
      role: 'ML & Data Engineer',
      college: 'MIT',
      skills: ['PyTorch', 'FastAPI', 'Python'],
      matchScore: 89,
    },
    {
      id: 'usr_cand_03',
      name: 'Liam Chen',
      role: 'Full Stack Engineer',
      college: 'Stanford University',
      skills: ['Node.js', 'PostgreSQL', 'React'],
      matchScore: 82,
    },
  ]);

  const handleInvite = async (candId: string) => {
    setLoadingId(candId);
    try {
      await onSendInvite(candId);
      setInvitedIds((prev) => [...prev, candId]);
    } catch {
      // Handled
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Invite Teammates to ${teamName}`}>
      <div className="space-y-4 text-left">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <TextInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, skill, or college..."
            className="pl-9"
          />
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {filtered.map((cand) => {
            const isInvited = invitedIds.includes(cand.id);

            return (
              <div
                key={cand.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 hover:bg-slate-100/60 transition"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={cand.name} src={cand.avatarUrl} size="md" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{cand.name}</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> {cand.matchScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{cand.college} • {cand.role}</p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {cand.skills.map((s) => (
                        <SkillBadge key={s} skill={s} />
                      ))}
                    </div>
                  </div>
                </div>

                {isInvited ? (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Invited
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="shrink-0 text-xs py-1 px-3"
                    isLoading={loadingId === cand.id}
                    onClick={() => handleInvite(cand.id)}
                  >
                    Send Invite
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <SecondaryButton size="sm" onClick={onClose}>
            Done
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};
