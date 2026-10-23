import React, { useEffect, useState } from 'react';
import { adminService, AdminDashboardStats, SystemActivityItem } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminGlobalSearch } from '@/components/admin/AdminGlobalSearch';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/Feedback';
import { Users, Building2, Calendar, Flag, ShieldAlert, Users2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activity, setActivity] = useState<SystemActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const [statsRes, activityRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getSystemActivity(),
      ]);

      if (statsRes.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        setStats(null);
      }

      if (activityRes.success && activityRes.data) {
        setActivity(activityRes.data);
      } else {
        setActivity([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const totalStud = stats?.users?.students || stats?.totalStudents || 0;
  const totalPros = stats?.users?.professionals || stats?.totalProfessionals || 0;
  const totalCols = (stats as any)?.colleges?.totalColleges || stats?.totalInstitutions || stats?.totalColleges || 0;
  const totalTeamsCount = (stats as any)?.teams?.totalTeams || stats?.totalTeams || 0;
  const totalEventsCount = (stats as any)?.events?.totalEvents || stats?.totalEvents || 0;
  const pendingReps = (stats as any)?.reports?.pendingReports || stats?.pendingReports || 0;
  const confirmedReps = (stats as any)?.reports?.confirmedReports || stats?.confirmedReports || 0;
  const totalParts = (stats as any)?.events?.totalParticipations || stats?.totalParticipations || 0;

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Admin Dashboard"
        message="Unable to connect to the platform administration service."
        onRetry={fetchAdminData}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-8 text-left pb-16 overflow-y-auto">
        {/* Header Bar with Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Platform Command Center</h1>
            <p className="text-xs text-slate-500">Global user metrics, institutional verification queue, and platform moderation</p>
          </div>

          <AdminGlobalSearch />
        </div>

        {/* Moderation Alerts Banner */}
        {pendingReps > 0 && (
          <div className="bg-gradient-to-r from-rose-600 to-amber-600 rounded-2xl p-4 text-white shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-white shrink-0" />
              <div className="text-xs">
                <h3 className="font-bold text-white text-sm">Action Required: Moderation Queue</h3>
                <p className="text-rose-100">
                  {pendingReps} pending misconduct reports requiring review • {confirmedReps} confirmed reports logged.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-white text-rose-950 hover:bg-slate-100 font-bold"
                onClick={() => navigate('/admin/moderation')}
              >
                Review Moderation Queue
              </Button>
            </div>
          </div>
        )}

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Enrolled Students"
            value={totalStud}
            icon={Users}
            isLoading={isLoading}
            linkTo="/admin/students"
          />
          <AdminStatCard
            label="Total Professionals"
            value={totalPros}
            icon={Users}
            isLoading={isLoading}
            linkTo="/admin/professionals"
          />
          <AdminStatCard
            label="Registered Colleges"
            value={totalCols}
            icon={Building2}
            isLoading={isLoading}
            linkTo="/admin/colleges"
          />
          <AdminStatCard
            label="Active Teams"
            value={totalTeamsCount}
            icon={Users2}
            isLoading={isLoading}
            linkTo="/admin/teams"
          />
          <AdminStatCard
            label="Active Events"
            value={totalEventsCount}
            icon={Calendar}
            isLoading={isLoading}
            linkTo="/admin/events"
          />
          <AdminStatCard
            label="Verified Participations"
            value={totalParts}
            icon={Users2}
            isLoading={isLoading}
            linkTo="/admin/analytics"
          />
          <AdminStatCard
            label="Pending Reports"
            value={pendingReps}
            isAlert={true}
            icon={Flag}
            isLoading={isLoading}
            linkTo="/admin/reports"
          />
          <AdminStatCard
            label="Confirmed Reports"
            value={confirmedReps}
            isAlert={true}
            icon={Building2}
            isLoading={isLoading}
            linkTo="/admin/reports"
          />
        </div>

        {/* System Activity Stream Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Recent Admin Audit Trail</h2>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/admin/activity')}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Audit Logs
            </Button>
          </div>

          <Card className="p-0 overflow-hidden border border-slate-200 shadow-subtle">
            {activity.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No recent administrative activity recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {activity.map((act) => (
                  <div key={act.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                    <div>
                      <span className="font-bold text-slate-900">{act.adminName || act.actor || 'Admin'}</span>
                      <span className="text-slate-600"> {act.action}: </span>
                      <span className="font-semibold text-brand-600">{act.reason || act.target || act.targetType}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{act.createdAt || act.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
};
