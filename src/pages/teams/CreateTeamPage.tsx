import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamService, TeamScope, TeamType } from '@/services/api/teamService';
import { eventService, Event } from '@/services/api/eventService';
import { TextInput, Textarea, Select, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const CreateTeamPage: React.FC = () => {
  const navigate = useNavigate();
  const { eventId: urlEventId } = useParams<{ eventId?: string }>();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    posterUrl: '',
    eventId: urlEventId || '',
    eventName: '',
    problemStatementId: '',
    problemStatementTitle: '',
    minimumMembers: 2,
    maximumMembers: 5,
    scope: 'GLOBAL' as TeamScope,
    teamType: 'MIXED' as TeamType,
    requiredSkills: [] as string[],
    recruitmentStatus: 'RECRUITING' as const,
    collaborationPreference: 'ONLINE' as const,
  });

  useEffect(() => {
    eventService.getEvents().then(res => {
      if (res.success && res.data) {
        setEvents(res.data);
        if (urlEventId) {
          const ev = res.data.find((e: Event) => e.id === urlEventId);
          if (ev) handleEventSelect(ev);
        } else if (res.data.length > 0) {
          handleEventSelect(res.data[0]);
        }
      }
    });
  }, [urlEventId]);

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEventSelect = async (ev: Event) => {
    setFormData(prev => ({ ...prev, eventId: ev.id, eventName: ev.title }));
    try {
      const res = await eventService.getEventById(ev.id);
      if (res.success && res.data && res.data.requiredSkills) {
        const skills = Array.isArray(res.data.requiredSkills) 
          ? res.data.requiredSkills 
          : (typeof res.data.requiredSkills === 'string' ? (res.data.requiredSkills as string).split(',').map((s: string) => s.trim()) : []);
        setFormData(prev => ({ ...prev, requiredSkills: skills }));
      }
    } catch (e) {
      console.error("Failed to fetch full event", e);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => (prev < 4 ? ((prev + 1) as any) : 4));
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as any) : 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await teamService.createTeam(formData);
      const newId = res.data?.id;
      if (newId) {
        navigate(`/teams/${newId}`);
      } else {
        navigate('/student/dashboard?tab=global');
      }
    } catch (err) {
      console.error('Failed to create team:', err);
      navigate('/student/dashboard?tab=global');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left pb-16 max-w-3xl mx-auto">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel & Return
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Create New Team</h1>
        <p className="text-xs text-slate-500">Form a team for an upcoming event and recruit compatible members</p>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-semibold">
        <span className={step >= 1 ? 'text-brand-600 font-bold' : 'text-slate-400'}>1. Team Info</span>
        <span className={step >= 2 ? 'text-brand-600 font-bold' : 'text-slate-400'}>2. Scope & Capacity</span>
        <span className={step >= 3 ? 'text-brand-600 font-bold' : 'text-slate-400'}>3. Skills Needed</span>
        <span className={step >= 4 ? 'text-brand-600 font-bold' : 'text-slate-400'}>4. Review & Confirm</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Team Details</h3>
            <TextInput label="Team Name *" value={formData.name} onChange={(e) => updateField('name', e.target.value)} required />
            <TextInput label="Hackathon Poster / Banner Image URL" value={formData.posterUrl} onChange={(e) => updateField('posterUrl', e.target.value)} />
            {formData.posterUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-48 flex items-center justify-center p-1">
                <img src={formData.posterUrl} alt="Poster preview" className="max-h-44 w-full object-cover rounded-lg" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              </div>
            )}
            <TextInput
              label="Select Event *"
              value={formData.eventName}
              onChange={(e) => {
                const name = e.target.value;
                const foundEv = events.find(x => x.title.toLowerCase() === name.toLowerCase());
                setFormData(prev => ({
                  ...prev,
                  eventName: name,
                  eventId: foundEv ? foundEv.id : prev.eventId
                }));
              }}
              placeholder="Enter event name (e.g. Global AI & Web Innovation Hackathon 2026)"
              required
            />
            <Textarea label="Team Project Description & Goals *" value={formData.description} onChange={(e) => updateField('description', e.target.value)} rows={4} required />
          </Card>
          <div className="flex justify-end pt-2">
            <Button type="submit">Continue to Step 2 ➔</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleNext} className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Visibility & Member Capacity</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Minimum Team Size *" value={String(formData.minimumMembers)} onChange={(e) => updateField('minimumMembers', parseInt(e.target.value, 10))} options={[{ value: '2', label: '2 Members' }, { value: '3', label: '3 Members' }]} />
              <Select label="Maximum Team Size *" value={String(formData.maximumMembers)} onChange={(e) => updateField('maximumMembers', parseInt(e.target.value, 10))} options={[{ value: '3', label: '3 Members' }, { value: '4', label: '4 Members' }, { value: '5', label: '5 Members' }, { value: '6', label: '6 Members' }]} />
            </div>
            <Select label="Visibility Scope *" value={formData.scope} onChange={(e) => updateField('scope', e.target.value as TeamScope)} options={[{ value: 'DEPARTMENT', label: 'My Department Only' }, { value: 'COLLEGE', label: 'My College Students' }, { value: 'ALL_COLLEGES', label: 'All Participating Colleges' }, { value: 'GLOBAL', label: 'Global Platform (Students + Professionals)' }]} />
            <Select label="Allowed Team Type *" value={formData.teamType} onChange={(e) => updateField('teamType', e.target.value as TeamType)} options={[{ value: 'STUDENT', label: 'Students Only' }, { value: 'PROFESSIONAL', label: 'Professionals Only' }, { value: 'MIXED', label: 'Mixed (Students + Professionals)' }]} />
          </Card>
          <div className="flex justify-between pt-2">
            <SecondaryButton type="button" onClick={handleBack}>
              ← Back
            </SecondaryButton>
            <Button type="submit">Continue to Step 3 ➔</Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleNext} className="space-y-4">
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Required Skills for Recruitment</h3>
            <MultiSelect
              label="Select Tech Stack & Domain Skills Needed *"
              options={[
                { value: 'React', label: 'React' },
                { value: 'TypeScript', label: 'TypeScript' },
                { value: 'Python', label: 'Python' },
                { value: 'PyTorch', label: 'PyTorch' },
                { value: 'Node.js', label: 'Node.js' },
                { value: 'FastAPI', label: 'FastAPI' },
                { value: 'PostgreSQL', label: 'PostgreSQL' },
                { value: 'UI/UX Design', label: 'UI/UX Design' },
                { value: 'Solidity', label: 'Solidity' },
                { value: 'Machine Learning', label: 'Machine Learning' },
                { value: 'Cybersecurity', label: 'Cybersecurity' }
              ]}
              value={formData.requiredSkills}
              onChange={(vals) => updateField('requiredSkills', vals)}
            />
          </Card>
          <div className="flex justify-between pt-2">
            <SecondaryButton type="button" onClick={handleBack}>
              ← Back
            </SecondaryButton>
            <Button type="submit">Review Team Setup ➔</Button>
          </div>
          
        </form>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <Card className="space-y-4 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Review Team Setup</h3>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">
                Ready to Publish
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate-400 block mb-0.5">Team Name</span>
                <span className="font-bold text-slate-900 text-sm">{formData.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Event</span>
                <span className="font-bold text-brand-600">{formData.eventName}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Team Capacity</span>
                <span className="font-bold text-slate-900">{formData.minimumMembers} - {formData.maximumMembers} Members</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Visibility Scope</span>
                <span className="font-bold text-slate-900">{formData.scope}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block mb-0.5">Required Skills</span>
                <span className="font-bold text-slate-900">{formData.requiredSkills.join(', ')}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Project Description</span>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 italic">{formData.description}</p>
            </div>
          </Card>

          <div className="flex justify-between pt-2">
            <SecondaryButton type="button" onClick={handleBack} disabled={isSubmitting}>
              ← Back
            </SecondaryButton>
            <Button onClick={handleSubmit} isLoading={isSubmitting} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Create & Publish Team
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
