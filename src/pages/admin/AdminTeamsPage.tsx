import React, { useEffect, useState } from 'react';
import { adminService, AdminTeam } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { TeamTable } from '@/components/admin/TeamTable';
import { TextInput, Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Users2 } from 'lucide-react';

export const AdminTeamsPage: React.FC = () => {
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editTeam, setEditTeam] = useState<AdminTeam | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 'RECRUITING' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getTeams();
      if (res.success && res.data) {
        setTeams(res.data);
      } else {
        setTeams([]);
      }
    } catch {
      setTeams([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTeam) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.updateTeam(editTeam.id, formData);
      if (res.success) {
        setEditTeam(null);
        fetchTeams();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = async (team: AdminTeam) => {
    if (window.confirm(`Are you sure you want to delete team "${team.name}"?`)) {
      try {
        await adminService.deleteTeam(team.id);
        fetchTeams();
      } catch {
        fetchTeams();
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex items-center gap-2">
          <Users2 className="w-6 h-6 text-brand-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Platform-Wide Teams Roster</h1>
            <p className="text-xs text-slate-500">Monitor and manage active student and professional teams created across all events</p>
          </div>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="table" count={3} />
        ) : teams.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Users2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Teams Created</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No teams are currently recorded in the platform database.
            </p>
          </div>
        ) : (
          <TeamTable
            teams={teams}
            onEdit={(t) => {
              setEditTeam(t);
              setFormData({ name: t.name || t.teamName || '', status: t.status });
            }}
            onDelete={handleDeleteTeam}
          />
        )}
      </main>

      {/* Edit Team Modal */}
      {editTeam && (
        <Modal isOpen={!!editTeam} onClose={() => setEditTeam(null)} title={`Edit Team: ${editTeam.name}`}>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="Team Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Select
              label="Team Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'RECRUITING', label: 'Recruiting' },
                { value: 'FULL', label: 'Full' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'DISBANDED', label: 'Disbanded' },
              ]}
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditTeam(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
