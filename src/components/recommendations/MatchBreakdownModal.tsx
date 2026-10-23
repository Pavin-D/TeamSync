import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { MatchBreakdown } from '@/services/api/recommendationService';
import { Sparkles } from 'lucide-react';

export interface MatchBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  breakdown: MatchBreakdown;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  breakdown,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Match Score Breakdown: ${candidateName}`}>
      <div className="space-y-4 text-left">
        <div className="p-3 bg-brand-50 border border-brand-100 rounded-xl text-xs text-brand-800 flex items-center justify-between">
          <span className="font-bold flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-brand-600" /> Overall AI Compatibility
          </span>
          <span className="text-base font-extrabold text-brand-900">{breakdown.overallCompatibility}%</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>Skill Complementarity (Filling Gaps)</span>
              <span className="font-bold text-slate-900">{breakdown.skillComplementarity}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.skillComplementarity}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>Problem Statement Requirements Fit</span>
              <span className="font-bold text-slate-900">{breakdown.problemFit}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full" style={{ width: `${breakdown.problemFit}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>Technology Stack Compatibility</span>
              <span className="font-bold text-slate-900">{breakdown.technologyFit}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full" style={{ width: `${breakdown.technologyFit}%` }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>Experience & Contribution Relevance</span>
              <span className="font-bold text-slate-900">{breakdown.experienceRelevance}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-accent-600 rounded-full" style={{ width: `${breakdown.experienceRelevance}%` }} />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
          Scoring weights are configured by event rules and skill complementarity algorithms.
        </p>
      </div>
    </Modal>
  );
};
