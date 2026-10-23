import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collegeService, CollegeStudent } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Card, Avatar } from '@/components/ui/Cards';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft } from 'lucide-react';

export const CollegeStudentDetailPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [student, setStudent] = useState<CollegeStudent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      setIsLoading(true);
      try {
        if (!studentId) return;
        const res = await collegeService.getCollegeStudentById('me', studentId);
        if (res.success && res.data) {
          setStudent(res.data);
        } else {
          setStudent(null);
        }
      } catch {
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!student) {
    return (
      <ErrorState
        title="Student Not Found"
        message="The requested student profile could not be loaded."
        onRetry={() => navigate('/college/students')}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div>
          <Link
            to="/college/students"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Student Roster
          </Link>
          <div className="flex items-center gap-3">
            <Avatar name={student.name} src={student.avatarUrl} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{student.name}</h1>
              <p className="text-xs text-slate-500">{student.department} • Student ID: {student.studentCode || student.email || student.studentId}</p>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">College Rank</span>
            <span className="text-xl font-extrabold text-brand-600 font-mono">#{student.collegeRank || 1}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Year of Study</span>
            <span className="text-xl font-extrabold text-slate-900 font-mono">Year {student.yearOfStudy || 1}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Events Participated</span>
            <span className="text-xl font-extrabold text-slate-900">{student.eventsParticipated || student.participationsCount || 0}</span>
          </Card>
          <Card className="p-4 bg-white border-slate-200">
            <span className="text-xs text-slate-400 font-bold block mb-1">Hackathon Wins 🏆</span>
            <span className="text-xl font-extrabold text-amber-600">{student.wins}</span>
          </Card>
        </div>
      </main>
    </div>
  );
};
