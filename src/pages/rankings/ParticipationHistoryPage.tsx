import React, { useEffect, useState } from 'react';
import { rankingService, ParticipationRecord } from '@/services/api/rankingService';
import { ParticipationCard } from '@/components/rankings/ParticipationCard';
import { PerformanceChart } from '@/components/rankings/PerformanceChart';
import { Select } from '@/components/ui/Inputs';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Calendar } from 'lucide-react';

export const ParticipationHistoryPage: React.FC = () => {
  const [records, setRecords] = useState<ParticipationRecord[]>([]);
  const [filterResult, setFilterResult] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const res = await rankingService.getParticipationHistory();
        if (res.success && res.data) {
          setRecords(res.data);
        } else {
          setRecords([]);
        }
      } catch {
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredRecords = records.filter((r) => {
    if (filterResult === 'ALL') return true;
    return (r.result || '').toUpperCase() === filterResult;
  });

  const chartData = [
    { year: 2026, events: records.length, wins: records.filter((r) => (r.result || '').toUpperCase() === 'WINNER').length, finalists: records.filter((r) => (r.result || '').toUpperCase() === 'FINALIST').length },
  ];

  return (
    <div className="space-y-8 text-left pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Participation History & Verified Results</h1>
            <p className="text-xs text-slate-500">Verified record of hackathons, competitions, roles, and achievements</p>
          </div>
        </div>

        <Select
          value={filterResult}
          onChange={(e) => setFilterResult(e.target.value)}
          options={[
            { value: 'ALL', label: 'All Results' },
            { value: 'WINNER', label: 'Winners Only 🏆' },
            { value: 'FINALIST', label: 'Finalists Only ⭐' },
          ]}
        />
      </div>

      {/* Performance Trend Chart */}
      <PerformanceChart data={chartData} title="My Hackathon Growth & Winning Trend" />

      {/* Timeline Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Event History ({filteredRecords.length})</h2>

        {isLoading ? (
          <SkeletonLoader variant="card" count={2} />
        ) : filteredRecords.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Participation Records Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              You haven't participated in any hackathon events matching this filter yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRecords.map((rec) => (
              <ParticipationCard key={rec.id} record={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
