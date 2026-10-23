import React, { useEffect, useState } from 'react';
import { rankingService, CollegeRanking } from '@/services/api/rankingService';
import { CollegeRankingCard } from '@/components/rankings/CollegeRankingCard';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Building2 } from 'lucide-react';

export const CollegeRankingsPage: React.FC = () => {
  const [colleges, setColleges] = useState<CollegeRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchColleges = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await rankingService.getCollegeRankings();
      if (res.success && res.data) {
        setColleges(res.data);
      } else {
        setColleges([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load College Leaderboard"
        message="Unable to connect to the institutional ranking service."
        onRetry={fetchColleges}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">College & University Rankings</h1>
            <p className="text-xs text-slate-500">Top performing institutions based on hackathon wins, finalist placements, and student participation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : colleges.length === 0 ? (
          <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Institutional Data Available</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No registered colleges have active student participation records yet.
            </p>
          </div>
        ) : (
          colleges.map((c) => (
            <CollegeRankingCard key={c.collegeId} college={c} />
          ))
        )}
      </div>
    </div>
  );
};
