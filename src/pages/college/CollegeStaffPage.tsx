import React, { useEffect, useState } from 'react';
import { collegeService } from '@/services/api/collegeService';
import { CollegeSidebar } from '@/components/college/CollegeSidebar';
import { Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { TextInput, PasswordInput } from '@/components/ui/Inputs';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { UserCheck, Search, UserPlus, Trash2, Edit3, X, Shield } from 'lucide-react';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  jobTitle?: string;
  company?: string;
}

export const CollegeStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Add Staff Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    password: 'password123',
    jobTitle: 'Assistant Professor & Mentor',
  });

  // Edit Staff Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editStaffData, setEditStaffData] = useState({
    name: '',
    email: '',
    jobTitle: '',
    password: '',
  });

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await collegeService.getCollegeStaff();
      if (res.success && res.data) {
        setStaff(res.data);
      } else {
        setStaff([]);
      }
    } catch {
      setStaff([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAddError(null);
    try {
      const res = await collegeService.addStaff(undefined, newStaff);
      if (res.success) {
        setIsAddModalOpen(false);
        setNewStaff({ name: '', email: '', password: 'password123', jobTitle: 'Assistant Professor & Mentor' });
        fetchStaff();
      } else {
        setAddError(res.message || 'Failed to add staff member');
      }
    } catch (err: any) {
      setAddError(err?.message || 'Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEditModal = (member: StaffMember) => {
    setEditingStaffId(member.id);
    setEditStaffData({
      name: member.name,
      email: member.email,
      jobTitle: member.jobTitle || 'Faculty Member',
      password: '',
    });
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaffId) return;
    setIsSubmitting(true);
    setEditError(null);
    try {
      const res = await collegeService.updateStaff(undefined, editingStaffId, editStaffData);
      if (res.success) {
        setIsEditModalOpen(false);
        setEditingStaffId(null);
        fetchStaff();
      } else {
        setEditError(res.message || 'Failed to update staff member');
      }
    } catch (err: any) {
      setEditError(err?.message || 'Failed to update staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (staffId: string, staffName: string) => {
    if (!window.confirm(`Are you sure you want to remove staff member ${staffName} from your institution?`)) {
      return;
    }
    try {
      const res = await collegeService.deleteStaff(undefined, staffId);
      if (res.success) {
        fetchStaff();
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete staff member');
    }
  };

  const filteredStaff = staff.filter((s) => {
    return s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || (s.jobTitle && s.jobTitle.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <CollegeSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-cyan-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">College Staff & Faculty Roster</h1>
              <p className="text-xs text-slate-500">Manage faculty advisors, project mentors, and institutional staff members</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold"
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add Staff Member
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search staff name, title, or email..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-subtle">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="p-3.5">Staff Member</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Designation / Job Title</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center">
                    <SkeletonLoader variant="table" count={3} />
                  </td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No staff members registered in your institution yet.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={s.name} size="sm" />
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="text-[10px] text-slate-400">{s.company || 'Institution Staff'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-600 font-mono">{s.email}</td>
                    <td className="p-3.5 text-slate-800 font-medium">{s.jobTitle || 'Faculty Member'}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1 w-max">
                        <Shield className="w-3 h-3" /> {s.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(s)}
                        className="p-1.5 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                        title="Edit / Update Staff Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(s.id, s.name)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Staff Member"
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

      {/* Add Staff Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-600" /> Add Staff Member
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

            <form onSubmit={handleAddStaff} className="space-y-3">
              <TextInput
                label="Full Name *"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="e.g. Dr. Robert Vance"
                required
              />
              <TextInput
                label="Official Email *"
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="faculty@college.edu"
                required
              />
              <TextInput
                label="Designation / Job Title *"
                value={newStaff.jobTitle}
                onChange={(e) => setNewStaff({ ...newStaff, jobTitle: e.target.value })}
                placeholder="e.g. Associate Professor & Mentor"
                required
              />
              <PasswordInput
                label="Initial Password *"
                value={newStaff.password}
                onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                required
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  Add Staff
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 text-left animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-600" /> Edit & Update Staff Member
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateStaff} className="space-y-3">
              <TextInput
                label="Full Name *"
                value={editStaffData.name}
                onChange={(e) => setEditStaffData({ ...editStaffData, name: e.target.value })}
                required
              />
              <TextInput
                label="Official Email *"
                type="email"
                value={editStaffData.email}
                onChange={(e) => setEditStaffData({ ...editStaffData, email: e.target.value })}
                required
              />
              <TextInput
                label="Designation / Job Title *"
                value={editStaffData.jobTitle}
                onChange={(e) => setEditStaffData({ ...editStaffData, jobTitle: e.target.value })}
                required
              />
              <PasswordInput
                label="New Password (leave blank to keep current)"
                value={editStaffData.password}
                onChange={(e) => setEditStaffData({ ...editStaffData, password: e.target.value })}
              />

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
