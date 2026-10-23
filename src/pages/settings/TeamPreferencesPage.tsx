import React, { useState } from 'react';
import { Card } from '@/components/ui/Cards';
import { Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { Users, CheckCircle2, Save } from 'lucide-react';

export const TeamPreferencesPage: React.FC = () => {
  const [preference, setPreference] = useState<'JOINING' | 'CREATING' | 'BOTH' | 'NOT_LOOKING'>('BOTH');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Team formation preferences saved!');
    }, 600);
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="w-6 h-6 text-brand-600" />
          <h1 className="text-2xl font-bold text-slate-900">Team Formation Availability & Preferences</h1>
        </div>
        <p className="text-xs text-slate-500">
          Configure whether you are currently looking to join existing teams, recruit teammates for a new team, or offer mentorship.
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Current Availability Status</h3>

          <Select
            label="Team Formation Preference *"
            value={preference}
            onChange={(e) => setPreference(e.target.value as any)}
            options={[
              { value: 'BOTH', label: 'Open to both joining existing teams & forming new teams (Recommended)' },
              { value: 'JOINING', label: 'Open to joining existing teams only' },
              { value: 'CREATING', label: 'Looking to recruit members for my own team' },
              { value: 'NOT_LOOKING', label: 'Not currently looking for teams' },
            ]}
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
