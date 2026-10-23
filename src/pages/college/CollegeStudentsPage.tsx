import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collegeService, CollegeStudent } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TextInput, Select, PasswordInput } from '@/components/ui/Inputs';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Users, Search, ExternalLink, UserPlus, Trash2, X } from 'lucide-react';

export const CollegeStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<CollegeStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Add Student Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: 'password123',
    department: 'Computer Science',
    yearOfStudy: 1,
  });

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const res = await collegeService.getCollegeStudents(undefined, {
        search: search || undefined,
        departmentId: departmentFilter !== 'ALL' ? departmentFilter : undefined,
      });

      if (res.success && res.data) {
        setStudents(res.data);
      } else {
        setStudents([]);
      }
    } catch {
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [departmentFilter]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddError(null);
    try {
      const res = await collegeService.addStudent(undefined, newStudent);
      if (res.success) {
        setIsAddModalOpen(false);
        setNewStudent({ name: '', email: '', password: 'password123', department: 'Computer Science', yearOfStudy: 1 });
        fetchStudents();
      } else {
        setAddError(res.message || 'Failed to add student');
      }
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from your institution?`)) {
      return;
    }
    try {
      const res = await collegeService.deleteStudent(undefined, studentId);
      if (res.success) {
        fetchStudents();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter((s) => {
    const code = s.studentCode || s.email || s.studentId;
    return s.name.toLowerCase().includes(search.toLowerCase()) || code.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Institutional Student Roster</h1>
              <p className="text-xs text-slate-500">Monitor student hackathon engagement, events participated, and college ranks</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-brand-600 hover:bg-brand-700 text-white font-bold"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Student
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student name or ID..."
              className="pl-9"
            />
          </div>

          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Departments' },
            ]}
          />
        </div>

        {/* Roster Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Rank</th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Email / Code</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5 text-center">Events</th>
                <th className="p-3.5 text-center">Wins 🏆</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center">
                    <SkeletonLoader variant="table" count={4} />
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No students match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => (
                  <tr key={s.studentId} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-extrabold text-slate-900 font-mono">#{s.collegeRank || idx + 1}</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} src={s.avatarUrl} size="sm" />
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">Year {s.yearOfStudy || 1}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-500 font-mono">{s.studentCode || s.email}</td>
                    <td className="p-3.5 text-slate-800 font-medium">{s.department}</td>
                    <td className="p-3.5 text-center font-bold text-slate-800">{s.eventsParticipated || s.participationsCount || 0}</td>
                    <td className="p-3.5 text-center font-extrabold text-amber-600">{s.wins}</td>
                    <td className="p-3.5 text-right flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/college/students/${s.studentId}`)}
                        rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
                      >
                        View
                      </Button>
                      <button
                        onClick={() => handleDeleteStudent(s.studentId, s.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-600" /> Add New Student
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddStudent} className="space-y-3">
              <TextInput
                label="Full Name *"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="e.g. Alex Johnson"
                required
              />
              <TextInput
                label="Email Address *"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="student@college.edu"
                required
              />
              <TextInput
                label="Department *"
                value={newStudent.department}
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                placeholder="e.g. Computer Science"
                required
              />
              <TextInput
                label="Year of Study *"
                type="number"
                min={1}
                max={6}
                value={newStudent.yearOfStudy}
                onChange={(e) => setNewStudent({ ...newStudent, yearOfStudy: parseInt(e.target.value) || 1 })}
                required
              />
              <PasswordInput
                label="Initial Password *"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                required
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting}>
                  Add Student
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

