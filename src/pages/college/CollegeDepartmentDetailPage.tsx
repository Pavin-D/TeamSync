import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collegeService, DepartmentSummary } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { CollegeParticipationChart } from '@/components/college/CollegeParticipationChart';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft, Building2 } from 'lucide-react';

export const CollegeDepartmentDetailPage: React.FC = () => {
  const { departmentId } = useParams<{ departmentId: string }>();
  const navigate = useNavigate();

  const [dept, setDept] = useState<DepartmentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDept = async () => {
      setIsLoading(true);
      try {
        if (!departmentId) return;
        const res = await collegeService.getDepartmentDetails('me', departmentId);
        if (res.success && res.data) {
          setDept(res.data);
        } else {
          setDept(null);
        }
      } catch {
        setDept(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDept();
  }, [departmentId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!dept) {
    return (
      <ErrorState
        title="Department Not Found"
        message="The requested department profile could not be loaded."
        onRetry={() => navigate('/college/departments')}
      />
    );
  }

  const chartData = [
    { year: 2026, students: dept.participatingStudents || dept.participantsCount || 0, events: dept.eventsParticipated || 0, teams: 0 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div>
          <Link
            to="/college/departments"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Departments
          </Link>
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-brand-600" />
            <h1 className="text-2xl font-bold text-slate-900">{dept.departmentName}</h1>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Department Rank</span>
            <span className="text-xl font-extrabold text-brand-600 font-mono">#{dept.rank || 1}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Enrolled Students</span>
            <span className="text-xl font-extrabold text-slate-900">{dept.totalStudents}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Participation Rate</span>
            <span className="text-xl font-extrabold text-emerald-600 font-mono">{dept.participationRate || 0}%</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Department Wins 🏆</span>
            <span className="text-xl font-extrabold text-amber-600">{dept.wins || dept.totalWins || 0}</span>
          </Card>
        </div>

        {/* Participation Chart */}
        <CollegeParticipationChart data={chartData} />
      </main>
    </div>
  );
};
