import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { rankingService, CollegeRanking } from '@/services/api/rankingService';
import { PerformanceChart } from '@/components/rankings/PerformanceChart';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Building2 } from 'lucide-react';

export const CollegeDetailPage: React.FC = () => {
  const { collegeId } = useParams<{ collegeId: string }>();
  const navigate = useNavigate();

  const [college, setCollege] = useState<CollegeRanking | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      setIsLoading(true);
      try {
        if (!collegeId) return;
        const res = await rankingService.getCollegeById(collegeId);
        if (res.success && res.data) {
          setCollege(res.data);
        } else {
          setCollege(null);
        }
      } catch {
        setCollege(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollege();
  }, [collegeId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!college) {
    return (
      <ErrorState
        title="College Not Found"
        message="The requested institutional profile could not be loaded."
        onRetry={() => navigate('/rankings/colleges')}
      />
    );
  }

  const scoreVal = college.score || college.totalScore || 0;
  const partStudents = college.participatingStudents || college.activeParticipantsCount || college.totalStudents || 0;
  const winsCount = college.wins || college.totalWins || 0;
  const finalistsCount = college.finalists || college.totalFinalists || 0;
  const eventsCount = college.eventsParticipated || college.totalEventsCount || 0;

  const chartData = [
    { year: 2026, events: eventsCount, wins: winsCount, finalists: finalistsCount },
  ];

  return (
    <div className="space-y-8 text-left pb-16">
      <div>
        <Link
          to="/rankings/colleges"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to College Rankings
        </Link>
        <div className="flex items-center gap-3">
          <Building2 className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-slate-900">{college.collegeName}</h1>
        </div>
        <p className="text-xs text-slate-500">{college.location || 'Registered Campus'}</p>
      </div>

      {/* Header Banner */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border-none shadow-modal">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-slate-300 text-xs block mb-1">Global College Rank</span>
            <span className="text-2xl font-extrabold text-amber-400">#{college.rank}</span>
          </div>

          <div>
            <span className="text-slate-300 text-xs block mb-1">Total Ranking Score</span>
            <span className="text-2xl font-extrabold text-brand-300 font-mono">{scoreVal.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-slate-300 text-xs block mb-1">Participating Students</span>
            <span className="text-2xl font-extrabold text-white">{partStudents}</span>
          </div>

          <div>
            <span className="text-slate-300 text-xs block mb-1">Total Wins 🏆</span>
            <span className="text-2xl font-extrabold text-emerald-400">{winsCount}</span>
          </div>
        </div>
      </Card>

      {/* Performance Trend Chart */}
      <PerformanceChart data={chartData} title="Institutional Hackathon Growth & Winning Trend" />
    </div>
  );
};
