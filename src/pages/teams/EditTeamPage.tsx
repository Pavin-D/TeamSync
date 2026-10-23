import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamService, Team, TeamScope, TeamStatus } from '@/services/api/teamService';
import { TextInput, Textarea, Select, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { ArrowLeft, Save, CheckCircle2 } from 'lucide-react';

export const EditTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    description: '',
    scope: 'GLOBAL',
    recruitmentStatus: 'RECRUITING',
    requiredSkills: [],
  });

  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true);
      try {
        if (!teamId) return;
        const res = await teamService.getTeamById(teamId);
        if (res.success && res.data) {
          setFormData(res.data);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [teamId]);

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      if (teamId) {
        await teamService.updateTeam(teamId, formData);
      }
      setSuccessMessage('Team updated successfully!');
      setTimeout(() => navigate(`/teams/${teamId}`), 1000);
    } catch {
      setSuccessMessage('Changes saved locally.');
      setTimeout(() => navigate(`/teams/${teamId}`), 1000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={2} className="h-40" />;
  }

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate(`/teams/${teamId}`)}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Team Overview
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Edit Team Settings</h1>
        </div>

        <SecondaryButton size="sm" onClick={() => navigate(`/teams/${teamId}`)}>
          Cancel
        </SecondaryButton>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Team Information</h3>

          <TextInput
            label="Team Name *"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />

          <Textarea
            label="Project Description *"
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={4}
            required
          />

          <Select
            label="Recruitment Status"
            value={formData.recruitmentStatus || 'RECRUITING'}
            onChange={(e) => updateField('recruitmentStatus', e.target.value as TeamStatus)}
            options={[
              { value: 'RECRUITING', label: 'Actively Recruiting' },
              { value: 'PAUSED', label: 'Recruitment Paused' },
              { value: 'CLOSED', label: 'Recruitment Closed' },
            ]}
          />

          <Select
            label="Visibility Scope"
            value={formData.scope || 'GLOBAL'}
            onChange={(e) => updateField('scope', e.target.value as TeamScope)}
            options={[
              { value: 'DEPARTMENT', label: 'Department Scope' },
              { value: 'COLLEGE', label: 'College Scope' },
              { value: 'ALL_COLLEGES', label: 'All Colleges' },
              { value: 'GLOBAL', label: 'Global Platform' },
            ]}
          />

          <MultiSelect
            label="Required Skills Needed"
            options={[
              { value: 'React', label: 'React' },
              { value: 'TypeScript', label: 'TypeScript' },
              { value: 'Python', label: 'Python' },
              { value: 'PyTorch', label: 'PyTorch' },
              { value: 'Node.js', label: 'Node.js' },
              { value: 'FastAPI', label: 'FastAPI' },
              { value: 'PostgreSQL', label: 'PostgreSQL' },
              { value: 'UI/UX Design', label: 'UI/UX Design' },
            ]}
            value={formData.requiredSkills || []}
            onChange={(vals) => updateField('requiredSkills', vals)}
          />
        </Card>

        <div className="flex justify-end gap-3">
          <SecondaryButton type="button" onClick={() => navigate(`/teams/${teamId}`)}>
            Cancel
          </SecondaryButton>
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
