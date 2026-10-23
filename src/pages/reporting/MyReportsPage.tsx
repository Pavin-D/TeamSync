import React, { useEffect, useState } from 'react';
import { reportService, Report } from '@/services/api/reportService';
import { ReportStatusBadge } from '@/components/reporting/ReportStatusBadge';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Flag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchReports = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await reportService.getMyReports();
      if (res.success && res.data) {
        setReports(res.data);
      } else {
        setReports([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Reports"
        message="Unable to connect to the reporting service."
        onRetry={fetchReports}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16">
      <div className="flex items-center gap-2">
        <Flag className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Submitted Reports</h1>
          <p className="text-xs text-slate-500">Track moderation status and review progress of complaints you filed</p>
        </div>
      </div>

      {isLoading ? (
        <SkeletonLoader variant="card" count={2} />
      ) : reports.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center my-4">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No Submitted Reports</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
            You haven't submitted any complaints or misconduct reports. If you encounter violations of our community guidelines, you can report them anytime.
          </p>
          <Button onClick={() => navigate('/guidelines')}>
            View Community Guidelines
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((rpt) => (
            <Card key={rpt.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-900">{rpt.reportNumber || `#RPT-${rpt.id.slice(0, 6)}`}</span>
                  <ReportStatusBadge status={rpt.status} />
                  <span className="text-[11px] text-slate-400">• {rpt.createdAt ? rpt.createdAt.split('T')[0] : 'Recently'}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  Reported User: <span className="text-brand-600">{rpt.reportedUserName || rpt.reportedUser?.name || 'User'}</span>
                </h4>
                <p className="text-xs text-slate-500 font-medium">Reason: {(rpt.reason || '').replace(/_/g, ' ')}</p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate(`/reports/${rpt.id}`)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shrink-0"
              >
                View Details
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
