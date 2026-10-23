import React, { useEffect, useState } from 'react';
import { mentorService, ActiveMentorship } from '@/services/api/mentorService';
import { Card, Avatar, Badge } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Star, Award, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const MentorshipHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<ActiveMentorship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await mentorService.getActiveMentorships();
        setHistory((res.data || []).filter((m) => m.status === 'COMPLETED'));
      } catch {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Award className="w-6 h-6 text-amber-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mentorship History</h1>
          <p className="text-xs text-slate-500">Archive of completed mentorship relationships and submitted feedback</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonLoader variant="card" count={2} />
        </div>
      ) : history.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Mentorship History</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You have no completed mentorship relationships yet. Discover industry mentors or mentor students to get started.
          </p>
          <Button onClick={() => navigate('/mentors')} rightIcon={<ArrowRight className="w-4 h-4" />}>
            Discover Mentors
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((m) => (
            <Card key={m.id} className="p-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.mentorName || 'Mentor'} src={m.mentorAvatarUrl} size="md" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{m.mentorName || 'Mentor'}</h4>
                      <p className="text-xs text-slate-500">{m.mentorTitle || 'Tech Leader'}</p>
                    </div>
                  </div>
                  <Badge variant="success">Completed ✓</Badge>
                </div>

                <p className="text-xs font-bold text-slate-800">{m.goalSummary || 'Mentorship Guidance'}</p>
                <p className="text-[11px] text-slate-500">{m.eventName || m.eventTitle || 'Event'} • {m.startedAt || 'Completed'}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> Rated 5.0 ★
                </span>
                <button
                  onClick={() => navigate(`/mentorship/${m.id}`)}
                  className="text-xs font-semibold text-brand-600 hover:underline"
                >
                  View Record →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
