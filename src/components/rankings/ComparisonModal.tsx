import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { StudentRanking } from '@/services/api/rankingService';
import { Avatar } from '@/components/ui/Cards';
import { SecondaryButton } from '@/components/ui/Button';

export interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentRanking[];
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  students,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Side-by-Side Student Performance Comparison">
      <div className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          {students.map((s) => (
            <div key={s.studentId} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} src={s.avatarUrl} size="md" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.college}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-500">Global Rank</span>
                  <span className="font-extrabold text-slate-900">#{s.rank}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-500">Ranking Score</span>
                  <span className="font-extrabold text-brand-600 font-mono">{s.score} pts</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-500">Events Participated</span>
                  <span className="font-bold text-slate-800">{s.eventsParticipated}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-500">Hackathon Wins</span>
                  <span className="font-extrabold text-amber-600">{s.wins}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-500">Finalist Appearances</span>
                  <span className="font-extrabold text-indigo-600">{s.finalists}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <SecondaryButton onClick={onClose}>Close Comparison</SecondaryButton>
        </div>
      </div>
    </Modal>
  );
};
