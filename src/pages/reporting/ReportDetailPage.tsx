import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { reportService, Report } from '@/services/api/reportService';
import { ReportStatusBadge } from '@/components/reporting/ReportStatusBadge';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        if (!reportId) return;
        const res = await reportService.getReportById(reportId);
        if (res.success && res.data) {
          setReport(res.data);
        } else {
          setReport(null);
        }
      } catch {
        setReport(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The requested report details could not be found."
        onRetry={() => navigate('/reports')}
      />
    );
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to My Reports
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Report {report.reportNumber || `#RPT-${report.id.slice(0, 6)}`}</h1>
          <ReportStatusBadge status={report.status} />
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-xs pb-4 border-b border-slate-100">
          <div>
            <span className="text-slate-400 block mb-0.5">Reported User</span>
            <span className="font-bold text-slate-900 text-sm">{report.reportedUserName || report.reportedUser?.name || 'User'}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Category</span>
            <span className="font-bold text-brand-600 text-sm">{(report.reason || '').replace(/_/g, ' ')}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submitted Description</h3>
          <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-2xl leading-relaxed">
            "{report.description}"
          </p>
        </div>

        {report.evidence && report.evidence.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Submitted Evidence Attachments</h3>
            <div className="space-y-1">
              {report.evidence.map((ev) => (
                <div key={ev.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-200">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" /> {ev.filename}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{(ev.fileSize / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-sky-950">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Moderation Review Process</span>
          </div>
          <p>
            Our trust & safety team reviews submitted complaints according to platform community guidelines. Updates will reflect here when action is taken.
          </p>
        </div>
      </Card>
    </div>
  );
};
