import React, { useEffect, useState } from 'react';
import { adminService, PlatformAnalytics } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { BarChart3, Users, Building2, Users2, Calendar, ShieldAlert, Award } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const res = await adminService.getPlatformAnalytics();
        if (res.success && res.data) {
          setAnalytics(res.data);
        } else {
          setAnalytics(null);
        }
      } catch {
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalUsers = analytics?.users?.totalUsers || 0;
  const students = analytics?.users?.students || 0;
  const professionals = analytics?.users?.professionals || 0;
  const collegeAdmins = analytics?.users?.collegeAdmins || 0;
  const platformAdmins = analytics?.users?.platformAdmins || 0;
  const totalColleges = analytics?.colleges?.totalColleges || 0;
  const totalTeams = analytics?.teams?.totalTeams || 0;
  const totalEvents = analytics?.events?.totalEvents || 0;
  const totalParticipations = analytics?.events?.totalParticipations || 0;
  const totalReports = analytics?.reports?.totalReports || 0;
  const pendingReports = analytics?.reports?.pendingReports || 0;
  const skillDist = analytics?.skillDistribution || [];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-5xl">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Global Platform Analytics Hub</h1>
            <p className="text-xs text-slate-500">Live platform metrics from database on users, institutions, teams, events, and moderation</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="card" count={3} />
        ) : (
          <>
            {/* Primary Platform Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Users</span>
                </div>
                <span className="text-3xl font-extrabold text-slate-900 font-mono">{totalUsers}</span>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {students} Students • {professionals} Pros
                </span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Colleges</span>
                </div>
                <span className="text-3xl font-extrabold text-emerald-600 font-mono">{totalColleges}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Registered Institutions</span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Users2 className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Active Teams</span>
                </div>
                <span className="text-3xl font-extrabold text-indigo-600 font-mono">{totalTeams}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Created across events</span>
              </Card>

              <Card className="p-5 bg-white border-slate-200 shadow-subtle">
                <div className="flex items-center gap-2 mb-1 text-slate-500">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">Events</span>
                </div>
                <span className="text-3xl font-extrabold text-amber-600 font-mono">{totalEvents}</span>
                <span className="text-[10px] text-slate-400 block mt-1">{totalParticipations} total entries</span>
              </Card>
            </div>

            {/* Moderation & User Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 bg-white border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> Safety & Moderation Overview
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                    <span className="text-slate-500 block mb-0.5">Total Reports Logged</span>
                    <span className="text-2xl font-extrabold text-rose-700 font-mono">{totalReports}</span>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="text-slate-500 block mb-0.5">Pending Action</span>
                    <span className="text-2xl font-extrabold text-amber-700 font-mono">{pendingReports}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 space-y-4 bg-white border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-600" /> User Role Distribution
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Students</span>
                    <span className="font-bold text-brand-600 font-mono">{students}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Working Professionals</span>
                    <span className="font-bold text-brand-600 font-mono">{professionals}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">College Staff / Admins</span>
                    <span className="font-bold text-brand-600 font-mono">{collegeAdmins}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="font-semibold text-slate-700">Platform System Admins</span>
                    <span className="font-bold text-brand-600 font-mono">{platformAdmins}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Skill Distribution */}
            {skillDist.length > 0 && (
              <Card className="p-6 space-y-4 bg-white border-slate-200">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Top User Skills in Platform Database</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                  {skillDist.map((sk, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="font-bold text-slate-900 block truncate">{sk.skill}</span>
                      <span className="text-brand-600 font-extrabold font-mono text-sm block mt-1">
                        {sk.usersCount} users
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
};
