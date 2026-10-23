import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rankingService, ParticipationRecord } from '@/services/api/rankingService';
import { Card, Badge, SkillBadge } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ParticipationDetailPage: React.FC = () => {
  const { participationId } = useParams<{ participationId: string }>();
  const navigate = useNavigate();

  const [record, setRecord] = useState<ParticipationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setIsLoading(true);
      try {
        if (!participationId) return;
        const res = await rankingService.getParticipationDetails(participationId);
        if (res.success && res.data) {
          setRecord(res.data);
        } else {
          setRecord(null);
        }
      } catch {
        setRecord(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecord();
  }, [participationId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!record) {
    return (
      <ErrorState
        title="Record Not Found"
        message="The requested participation record details could not be loaded."
        onRetry={() => navigate('/participation')}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <Link
          to="/participation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Participation History
        </Link>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-slate-900">{record.eventName || record.eventTitle || 'Event'}</h1>
          <Badge variant="success">🏆 {record.result}</Badge>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Team Name</span>
            <span className="font-bold text-slate-900 text-sm">{record.teamName}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Role</span>
            <span className="font-bold text-brand-600 text-sm">{record.role || 'Member'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Date</span>
            <span className="font-bold text-slate-900 text-sm">{record.date || record.participatedAt?.split('T')[0] || 'Recently'}</span>
          </div>
        </div>

        {record.problemStatement && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Problem Statement</h3>
            <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl leading-relaxed">
              "{record.problemStatement}"
            </p>
          </div>
        )}

        {record.technologies && record.technologies.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Technologies Used</h3>
            <div className="flex flex-wrap gap-1.5">
              {record.technologies.map((t) => (
                <SkillBadge key={t} skill={t} />
              ))}
            </div>
          </div>
        )}

        {record.isVerified && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>This achievement has been officially verified by the platform event committee.</span>
          </div>
        )}
      </Card>
    </div>
  );
};
