import React from 'react';
import { Button } from '@/components/ui/Button';
import { Sparkles, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface AiTeamMatchingBannerProps {
  eventId: string;
  className?: string;
}

export const AiTeamMatchingBanner: React.FC<AiTeamMatchingBannerProps> = ({ eventId, className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden text-left ${className}`}
    >
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart AI Matchmaking Engine</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">Need Teammates for this Event?</h3>

        <p className="text-xs sm:text-sm text-indigo-100 mt-2 leading-relaxed">
          Our AI algorithm analyzes skill sets, GitHub repositories, department requirements, and availability to match you with compatible teammates.
        </p>

        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={() => navigate(`/events/${eventId}/find-team`)}
            size="md"
            className="bg-white text-brand-700 hover:bg-slate-50 font-semibold shadow-md border border-white"
            leftIcon={<Users className="w-4 h-4 text-brand-600" />}
            rightIcon={<ArrowRight className="w-4 h-4 text-brand-600" />}
          >
            Find Compatible Teammates
          </Button>
        </div>
      </div>
    </div>
  );
};
