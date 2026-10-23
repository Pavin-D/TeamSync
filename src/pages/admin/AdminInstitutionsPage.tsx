import React, { useEffect, useState } from 'react';
import { adminService, AdminInstitution } from '@/services/api/adminService';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { InstitutionTable } from '@/components/admin/InstitutionTable';
import { TextInput } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Building2, Plus } from 'lucide-react';

export const AdminInstitutionsPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<AdminInstitution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editInst, setEditInst] = useState<AdminInstitution | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    country: 'India',
    isVerified: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getInstitutions();
      if (res.success && res.data) {
        setInstitutions(res.data);
      } else {
        setInstitutions([]);
      }
    } catch {
      setInstitutions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.createInstitution(formData);
      if (res.success) {
        setIsAddModalOpen(false);
        setFormData({ name: '', city: '', state: '', country: 'India', isVerified: true });
        fetchInstitutions();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInst) return;
    const cid = editInst.collegeId || editInst.id;
    if (!cid) return;
    setIsSubmitting(true);
    try {
      const res = await adminService.updateInstitution(cid, {
        name: formData.name,
        isVerified: formData.isVerified,
      });
      if (res.success) {
        setEditInst(null);
        fetchInstitutions();
      }
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteInst = async (inst: AdminInstitution) => {
    const cid = inst.collegeId || inst.id;
    if (!cid) return;
    if (window.confirm(`Are you sure you want to delete institution "${inst.collegeName || inst.name}"?`)) {
      try {
        await adminService.deleteInstitution(cid);
        fetchInstitutions();
      } catch (err: any) {
        alert(err.response?.data?.error?.message || err.message || 'Failed to delete institution');
        fetchInstitutions();
      }
    }
  };

  const handleVerify = async (inst: AdminInstitution, status: 'VERIFIED' | 'REJECTED') => {
    const instId = inst.collegeId || inst.id;
    if (!instId) return;
    try {
      await adminService.verifyInstitution(instId, status);
      fetchInstitutions();
    } catch {
      fetchInstitutions();
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 text-left pb-16 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-brand-600" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Institutions & University Directory</h1>
              <p className="text-xs text-slate-500">Manage registered colleges, verify official credentials, and monitor institutional hackathon metrics</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setFormData({ name: '', city: '', state: '', country: 'India', isVerified: true });
              setIsAddModalOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Institution
          </Button>
        </div>

        {isLoading ? (
          <SkeletonLoader variant="table" count={3} />
        ) : institutions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center my-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Institutions Registered</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No colleges or universities are currently registered in the database. Click "Add Institution" to register one.
            </p>
          </div>
        ) : (
          <InstitutionTable
            institutions={institutions}
            onVerify={handleVerify}
            onEdit={(inst) => {
              setEditInst(inst);
              setFormData({
                name: inst.collegeName || inst.name || '',
                city: '',
                state: '',
                country: 'India',
                isVerified: Boolean(inst.isVerified || inst.verificationStatus === 'VERIFIED'),
              });
            }}
            onDelete={handleDeleteInst}
          />
        )}
      </main>

      {/* Add Institution Modal */}
      {isAddModalOpen && (
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Institution">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="College / Institution Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. SRM Institute of Science and Technology"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <TextInput
                label="City"
                value={formData.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Chennai"
              />
              <TextInput
                label="State"
                value={formData.state}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g. Tamil Nadu"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="inst-add-verified"
                checked={formData.isVerified}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="inst-add-verified" className="text-xs font-semibold text-slate-700">
                Mark Institution as Verified
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isSubmitting}>
                Register Institution
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Institution Modal */}
      {editInst && (
        <Modal isOpen={!!editInst} onClose={() => setEditInst(null)} title={`Edit Institution: ${editInst.collegeName || editInst.name}`}>
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left p-1">
            <TextInput
              label="College / Institution Name"
              value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="inst-verified"
                checked={formData.isVerified}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isVerified: e.target.checked })}
                className="w-4 h-4 text-brand-600 rounded"
              />
              <label htmlFor="inst-verified" className="text-xs font-semibold text-slate-700">
                Mark Institution as Verified
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditInst(null)}>
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
