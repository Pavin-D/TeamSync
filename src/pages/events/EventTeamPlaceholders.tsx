import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Users, PlusCircle } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export const EventTeamPlaceholderPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const location = useLocation();

  const isCreate = location.pathname.includes('create-team');
  const isJoin = location.pathname.includes('join-team');

  const getTitle = () => {
    if (isCreate) return 'Create Team for Event';
    if (isJoin) return 'Join Existing Team';
    return 'Find Teammates with AI Matching';
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`/events/${eventId || ''}`)}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Module 5 Entry Point: {location.pathname}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{getTitle()}</h1>
        </div>
      </div>

      <Card className="p-8 text-center bg-slate-50 border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          {isCreate ? <PlusCircle className="w-6 h-6" /> : <Users className="w-6 h-6" />}
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">{getTitle()} Workspace</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Full team creation workflows, join request processing, candidate AI skill matching, and team leader dashboards will be integrated in <strong>MODULE 5 — TEAM FORMATION & MANAGEMENT</strong>.
        </p>
        <Button onClick={() => navigate(`/events/${eventId || ''}`)}>
          Return to Event Overview
        </Button>
      </Card>
    </div>
  );
};
