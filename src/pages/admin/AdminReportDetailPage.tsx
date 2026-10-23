import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { reportService, Report } from '@/services/api/reportService';
import { ReportStatusBadge, ReportPriorityBadge } from '@/components/reporting/ReportStatusBadge';
import { ConfirmationModal } from '@/components/teams/ConfirmationModal';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, FileText, AlertTriangle } from 'lucide-react';

export const AdminReportDetailPage: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Action Modal States
  const [actionType, setActionType] = useState<'WARN' | 'RESTRICT' | 'SUSPEND' | 'DELETE' | 'RESOLVE' | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        if (!reportId) return;
        const res = await reportService.getAdminReportById(reportId);
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

  const handleExecuteAction = async () => {
    if (!report || !actionType) return;

    try {
      if (actionType === 'WARN' && report.reportedUserId) {
        await reportService.warnUser(report.reportedUserId, 'Moderation warning for reported conduct');
      } else if (actionType === 'RESTRICT' && report.reportedUserId) {
        await reportService.restrictUser(report.reportedUserId, ['CREATE_TEAMS', 'JOIN_TEAMS'], 14, 'Team abandonment violation');
      } else if (actionType === 'SUSPEND' && report.reportedUserId) {
        await reportService.suspendUser(report.reportedUserId, 30, 'Repeated misconduct complaints');
      } else if (actionType === 'DELETE' && report.reportedUserId) {
        await reportService.deleteUser(report.reportedUserId, 'Account threshold exceeded (30+ validated reports)');
      } else if (actionType === 'RESOLVE') {
        await reportService.resolveReport(report.id, 'RESOLVED', 'CONFIRMED');
      }

      setReport({ ...report, status: 'RESOLVED' });
      setActionType(null);
    } catch {
      setReport({ ...report, status: 'RESOLVED' });
      setActionType(null);
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!report) {
    return (
      <ErrorState
        title="Report Not Found"
        message="The requested moderation report could not be found."
        onRetry={() => navigate('/admin/moderation')}
      />
    );
  }

  const validatedCount = report.validatedReportsCountForUser || 0;
  const isAboveThreshold = validatedCount >= 30;

  return (
    <div className="space-y-6 text-left pb-16 max-w-4xl mx-auto">
      <div>
        <Link
          to="/admin/moderation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Moderation Queue
        </Link>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">Review Report {report.reportNumber || `#RPT-${report.id.slice(0, 6)}`}</h1>
            <ReportStatusBadge status={report.status} />
            <ReportPriorityBadge priority={report.severity || report.priority || 'MEDIUM'} />
          </div>
        </div>
      </div>

      {/* 30-Report Threshold Warning Banner */}
      {isAboveThreshold && (
        <Card className="p-5 bg-rose-50 border-rose-300 text-xs text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-extrabold text-rose-900 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Threshold Alert: {validatedCount} Validated Reports Received</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            This account has accumulated <strong>{validatedCount} validated complaints</strong> (Platform Business Rule Threshold: 30 reports). Review reported misconduct history below and determine whether account restriction, suspension, or deletion is appropriate.
          </p>
        </Card>
      )}

      {/* Report Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reported User & Entity</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Reported Name</span>
              <span className="font-bold text-slate-900">{report.reportedEntityName || report.reportedUserName || report.reportedUser?.name || 'User'}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Reason</span>
              <span className="font-bold text-brand-600">{(report.reason || '').replace(/_/g, ' ')}</span>
            </div>
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Reporter Details</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Reporter</span>
              <span className="font-bold text-slate-900">{report.reporterName || report.reporterEmail || 'User'}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-50 rounded-xl">
              <span className="text-slate-500">Submission Date</span>
              <span className="font-bold text-slate-900">{report.createdAt ? report.createdAt.split('T')[0] : 'Recently'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Description & Evidence */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Complaint Statement</h3>
        <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl leading-relaxed">
          "{report.description}"
        </p>

        {report.evidence && report.evidence.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-900">Evidence Attachments ({report.evidence.length})</h4>
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
      </Card>

      {/* Admin Action Drawer */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Take Authoritative Moderation Action</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setActionType('WARN')}
          >
            Warn User
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setActionType('RESTRICT')}
            className="border-amber-300 text-amber-800 hover:bg-amber-50"
          >
            Restrict Account
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setActionType('SUSPEND')}
            className="border-rose-300 text-rose-800 hover:bg-rose-50"
          >
            Suspend Account
          </Button>

          <Button
            size="sm"
            onClick={() => setActionType('DELETE')}
            className="bg-rose-700 hover:bg-rose-800 text-white"
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Action Dialog Modal */}
      {actionType && (
        <ConfirmationModal
          isOpen={!!actionType}
          onClose={() => setActionType(null)}
          title={`Confirm Action: ${actionType}`}
          message={`Confirm executing ${actionType} on account ${report.reportedEntityName || 'User'}:`}
          confirmLabel={`Execute ${actionType}`}
          isDanger={actionType === 'DELETE' || actionType === 'SUSPEND'}
          onConfirm={handleExecuteAction}
        />
      )}
    </div>
  );
};
