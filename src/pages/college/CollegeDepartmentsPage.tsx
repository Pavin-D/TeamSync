import React, { useEffect, useState } from 'react';
import { collegeService, DepartmentSummary } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { DepartmentPerformanceTable } from '@/components/college/DepartmentPerformanceTable';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { Building2 } from 'lucide-react';

export const CollegeDepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<DepartmentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchDepts = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await collegeService.getDepartments();
      if (res.success && res.data) {
        setDepartments(res.data);
      } else {
        setDepartments([]);
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  if (isError) {
    return (
      <ErrorState
        title="Failed to Load Departments"
        message="Unable to connect to the department management service."
        onRetry={fetchDepts}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Building2 className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Departmental Performance Leaderboard</h1>
            <p className="text-xs text-slate-500">Departmental participation rates, total hackathon wins, and achievement metrics</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="table" count={3} />
        ) : departments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Department Performance Data</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No departmental activity recorded for this institution yet.
            </p>
          </div>
        ) : (
          <DepartmentPerformanceTable departments={departments} />
        )}
      </main>
    </div>
  );
};
