import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportService, Report } from '@/services/api/reportService';
import { ReportStatusBadge, ReportPriorityBadge } from '@/components/reporting/ReportStatusBadge';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TextInput, Select } from '@/components/ui/Inputs';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ShieldAlert, ArrowRight, Search } from 'lucide-react';

export const AdminModerationDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<{ totalReports: number; pendingReports: number; underReviewReports: number; resolvedReports: number; dismissedReports: number }>({
    totalReports: 0,
    pendingReports: 0,
    underReviewReports: 0,
    resolvedReports: 0,
    dismissedReports: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchReports = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [listRes, statsRes] = await Promise.all([
        reportService.getAdminReports(),
        reportService.getAdminReportStats(),
      ]);

      if (listRes.success && listRes.data) {
        setReports(listRes.data);
      } else {
        setReports([]);
      }

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
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

  const filteredReports = reports.filter((r) => {
    const reportNum = r.reportNumber || `#RPT-${r.id.slice(0, 6)}`;
    const entityName = r.reportedEntityName || r.reportedUserName || r.reportedUser?.name || 'User';
    const reporterName = r.reporterName || r.reporterId || 'User';

    const matchesSearch =
      reportNum.toLowerCase().includes(search.toLowerCase()) ||
      entityName.toLowerCase().includes(search.toLowerCase()) ||
      reporterName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Moderation Queue"
        message="Unable to connect to the administration service."
        onRetry={fetchReports}
      />
    );
  }

  return (
    <div className="space-y-8 text-left pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Moderation Center</h1>
            <p className="text-xs text-slate-500">Review reported platform violations, 30-report threshold alerts, and account actions</p>
          </div>
        </div>

        <Button onClick={() => navigate('/admin/audit-logs')} variant="outline" size="sm">
          View Audit Logs
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Total Reports</span>
          <span className="text-xl font-bold text-slate-900">{stats.totalReports}</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Pending Review</span>
          <span className="text-xl font-bold text-rose-600">{stats.pendingReports}</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Under Moderation</span>
          <span className="text-xl font-bold text-amber-600">{stats.underReviewReports}</span>
        </Card>

        <Card className="p-4 bg-white border-slate-200">
          <span className="text-xs text-slate-500 font-medium block mb-1">Resolved Reports</span>
          <span className="text-xl font-bold text-emerald-600">{stats.resolvedReports}</span>
        </Card>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search report ID, user, or reporter..."
              className="pl-9"
            />
          </div>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Report Statuses' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'UNDER_REVIEW', label: 'Under Review' },
              { value: 'RESOLVED', label: 'Resolved' },
              { value: 'DISMISSED', label: 'Dismissed' },
            ]}
          />
        </div>
      </div>

      {/* Queue Table */}
      <Card className="p-0 overflow-hidden border border-slate-200 shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Report ID</th>
                <th className="p-3.5">Reported User</th>
                <th className="p-3.5">Reporter</th>
                <th className="p-3.5">Reason</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <SkeletonLoader variant="table" count={3} />
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No reports match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-mono font-bold text-slate-900">{r.reportNumber || `#RPT-${r.id.slice(0, 6)}`}</td>
                    <td className="p-3.5 font-semibold text-slate-900">
                      {r.reportedEntityName || r.reportedUserName || r.reportedUser?.name || 'User'}
                    </td>
                    <td className="p-3.5 text-slate-600">{r.reporterName || r.reporterEmail || 'User'}</td>
                    <td className="p-3.5 text-brand-600 font-semibold">{(r.reason || '').replace(/_/g, ' ')}</td>
                    <td className="p-3.5">
                      <ReportPriorityBadge priority={r.severity || r.priority || 'MEDIUM'} />
                    </td>
                    <td className="p-3.5">
                      <ReportStatusBadge status={r.status} />
                    </td>
                    <td className="p-3.5 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/moderation/reports/${r.id}`)}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      >
                        Review Report
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
