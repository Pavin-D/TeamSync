import React, { useEffect, useState } from 'react';
import { adminService, AdminUser } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { UserTable } from '@/components/admin/UserTable';
import { ModerationModal } from '@/components/admin/ModerationModal';
import { TextInput, Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Users, Search, UserPlus } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Moderation modal state
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);

  // Add / Edit user modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getUsers({
        search: search || undefined,
        role: roleFilter !== 'ALL' ? roleFilter : undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
      });

      if (res.success && res.data) {
        setUsers(res.data);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.createUser(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'STUDENT' });
        fetchUsers();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    const uid = editUser.userId || editUser.id;
    if (!uid) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.updateUser(uid, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });
      if (res.success) {
        setEditUser(null);
        fetchUsers();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    const uid = user.userId || user.id;
    if (!uid) return;
    if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
      try {
        await adminService.deleteUser(uid, 'Admin deleted user');
        fetchUsers();
      } catch {
        fetchUsers();
      }
    }
  };

  const handleSuspendConfirm = async (reason: string, durationDays?: number) => {
    const targetId = targetUser?.userId || targetUser?.id;
    if (!targetId) return;
    try {
      await adminService.updateUserStatus(targetId, 'SUSPENDED', reason, durationDays);
      setUsers(users.map((u) => ((u.userId || u.id) === targetId ? { ...u, status: 'SUSPENDED', isActive: false } : u)));
    } catch {
      setUsers(users.map((u) => ((u.userId || u.id) === targetId ? { ...u, status: 'SUSPENDED', isActive: false } : u)));
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Platform User Directory</h1>
              <p className="text-xs text-slate-500">Manage all registered students, working professionals, college staff, and system accounts</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setFormData({ name: '', email: '', password: '', role: 'STUDENT' });
              setIsAddModalOpen(true);
            }}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Add New User
          </Button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-subtle grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="pl-9"
            />
          </div>

          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Roles' },
              { value: 'STUDENT', label: 'Students Only' },
              { value: 'PROFESSIONAL', label: 'Working Professionals' },
              { value: 'COLLEGE_ADMIN', label: 'College Staff / Admins' },
              { value: 'PLATFORM_ADMIN', label: 'Platform Admins' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Account Statuses' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'SUSPENDED', label: 'Suspended' },
            ]}
          />
        </div>

        {/* User Table */}
        {isLoading ? (
          <SkeletonLoader variant="table" count={5} />
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Matching Accounts</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No user accounts found matching your selected search query or role filter.
            </p>
          </div>
        ) : (
          <UserTable
            users={filteredUsers}
            onSuspend={(user) => {
              setTargetUser(user);
              setIsSuspendModalOpen(true);
            }}
            onEdit={(user) => {
              setEditUser(user);
              setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role || 'STUDENT',
              });
            }}
            onDelete={handleDeleteUser}
          />
        )}
      </main>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Account">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextInput
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Leave blank for default: password123"
            />
            <Select
              label="User Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'STUDENT', label: 'Student' },
                { value: 'PROFESSIONAL', label: 'Working Professional' },
                { value: 'COLLEGE_ADMIN', label: 'College Staff / Admin' },
                { value: 'PLATFORM_ADMIN', label: 'System Admin' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Create User
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title={`Edit Account: ${editUser.name}`}>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Select
              label="User Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'STUDENT', label: 'Student' },
                { value: 'PROFESSIONAL', label: 'Working Professional' },
                { value: 'COLLEGE_ADMIN', label: 'College Staff / Admin' },
                { value: 'PLATFORM_ADMIN', label: 'System Admin' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Suspend Confirmation Modal */}
      {isSuspendModalOpen && targetUser && (
        <ModerationModal
          isOpen={isSuspendModalOpen}
          onClose={() => setIsSuspendModalOpen(false)}
          title={`Suspend Account: ${targetUser.name}`}
          actionType="SUSPEND"
          targetName={targetUser.name}
          onConfirm={handleSuspendConfirm}
        />
      )}
    </div>
  );
};
