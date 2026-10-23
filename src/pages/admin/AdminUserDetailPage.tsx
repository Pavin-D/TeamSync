import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminService, AdminUser } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ModerationModal } from '@/components/admin/ModerationModal';
import { Card, Avatar } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader, ErrorState } from '@/components/ui/Feedback';
import { ArrowLeft } from 'lucide-react';

export const AdminUserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Moderation state
  const [modalAction, setModalAction] = useState<'SUSPEND' | 'DELETE' | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        if (!userId) return;
        const res = await adminService.getUserById(userId);
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleActionConfirm = async (reason: string, durationDays?: number) => {
    if (!user || !modalAction) return;
    const targetId = user.userId || user.id || '';
    if (!targetId) return;

    if (modalAction === 'SUSPEND') {
      await adminService.updateUserStatus(targetId, 'SUSPENDED', reason, durationDays);
      setUser({ ...user, status: 'SUSPENDED', isActive: false });
    } else if (modalAction === 'DELETE') {
      await adminService.deleteUser(targetId, reason);
      setUser({ ...user, status: 'DELETED', isActive: false });
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-48" />;
  }

  if (!user) {
    return (
      <ErrorState
        title="User Not Found"
        message="The requested user details could not be loaded."
        onRetry={() => navigate('/admin/users')}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto max-w-4xl">
        <div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to User Directory
          </Link>
          <div className="flex items-center gap-3">
            <Avatar name={user.name} src={user.avatarUrl} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-xs text-slate-500">{user.role} • {user.email}</p>
            </div>
          </div>
        </div>

        {/* Status & Overview */}
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5">Account Status</span>
              <span className="font-bold text-slate-900 text-sm">{user.status}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Institution / Org</span>
              <span className="font-bold text-brand-600 text-sm">{user.college || user.institutionName || user.organization || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Joined Date</span>
              <span className="font-bold text-slate-900 text-sm">{user.createdAt || user.joinedDate || 'Recently'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Reports Received</span>
              <span className="font-extrabold text-rose-600 text-sm">{user.reportsCount} Reports</span>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setModalAction('SUSPEND')}
              className="border-amber-300 text-amber-800 hover:bg-amber-50"
            >
              Suspend Account
            </Button>
            <Button
              size="sm"
              onClick={() => setModalAction('DELETE')}
              className="bg-rose-700 hover:bg-rose-800 text-white"
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </main>

      {/* Moderation Modal */}
      {modalAction && (
        <ModerationModal
          isOpen={!!modalAction}
          onClose={() => setModalAction(null)}
          title={`Confirm ${modalAction}: ${user.name}`}
          actionType={modalAction}
          targetName={user.name}
          onConfirm={handleActionConfirm}
        />
      )}
    </div>
  );
};
