import React from 'react';
import { EventEligibilityType } from '@/services/api/eventService';
import { Card } from '@/components/ui/Cards';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export interface EventEligibilityCardProps {
  eligibilityType: EventEligibilityType;
  eligibilityNotes?: string[];
  className?: string;
}

export const EventEligibilityCard: React.FC<EventEligibilityCardProps> = ({
  eligibilityType,
  eligibilityNotes = [
    'Valid Student / Working Professional identity verification required',
    'Cross-college & cross-department team collaboration permitted',
    'Individual participants can join existing open teams',
  ],
  className,
}) => {
  const getEligibilityHeader = () => {
    switch (eligibilityType) {
      case 'STUDENTS':
        return 'College & University Students Only';
      case 'PROFESSIONALS':
        return 'Industry Professionals & Mentors Only';
      case 'STUDENTS_AND_PROFESSIONALS':
        return 'Open to Both Students & Working Professionals';
      default:
        return 'Open Eligibility';
    }
  };

  return (
    <Card className={`text-left ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Eligibility Criteria</h3>
      </div>

      <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl mb-4 text-xs font-bold text-emerald-800">
        ✓ {getEligibilityHeader()}
      </div>

      <div className="space-y-2 text-xs text-slate-600">
        {eligibilityNotes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{note}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};
