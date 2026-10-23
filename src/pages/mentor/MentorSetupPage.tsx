import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mentorService } from '@/services/api/mentorService';
import { TextInput, Textarea, Select, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { ArrowLeft, CheckCircle2, Award } from 'lucide-react';

export const MentorSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Senior Cloud Architect',
    company: 'Google Cloud',
    yearsOfExperience: 8,
    industry: 'Cloud Computing & Microservices',
    primarySkills: ['Node.js', 'AWS', 'System Design', 'PostgreSQL'],
    mentoringAreas: ['Technical Development', 'System Design & Architecture', 'Hackathon Strategy'],
    bio: 'Experienced Cloud Architect passionate about helping student hackathon teams design production-grade cloud services and scalable microservices.',
    availabilitySchedule: 'Weekdays 6:00 PM - 9:00 PM IST',
    maxActiveMentees: 3,
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
      return;
    }

    setIsSubmitting(true);
    try {
      await mentorService.createMentorProfile(formData);
      navigate('/mentor/dashboard');
    } catch {
      navigate('/mentor/dashboard');
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
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900">Become an Industry Mentor</h1>
        </div>
        <p className="text-xs text-slate-500">
          Share your professional experience to guide student developers building hackathon and innovation projects.
        </p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 text-xs font-semibold">
        <span className={step >= 1 ? 'text-brand-600 font-bold' : 'text-slate-400'}>1. Experience & Role</span>
        <span className={step >= 2 ? 'text-brand-600 font-bold' : 'text-slate-400'}>2. Expertise & Areas</span>
        <span className={step >= 3 ? 'text-brand-600 font-bold' : 'text-slate-400'}>3. Schedule & Capacity</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Professional Role & Background</h3>

            <TextInput
              label="Professional Title *"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Senior Software Engineer"
              required
            />

            <TextInput
              label="Company / Organization *"
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder="e.g. Google, Microsoft, Startup"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Years of Experience *"
                value={String(formData.yearsOfExperience)}
                onChange={(e) => updateField('yearsOfExperience', parseInt(e.target.value, 10))}
                options={[
                  { value: '3', label: '3 Years' },
                  { value: '5', label: '5 Years' },
                  { value: '8', label: '8 Years' },
                  { value: '10', label: '10+ Years' },
                ]}
              />

              <TextInput
                label="Industry / Domain *"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                placeholder="e.g. Cloud & AI Systems"
                required
              />
            </div>

            <Textarea
              label="Short Bio & Introduction *"
              value={formData.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              rows={4}
              required
            />
          </Card>
        )}

        {step === 2 && (
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Technical Expertise & Mentoring Areas</h3>

            <MultiSelect
              label="Primary Technical Skills *"
              options={[
                { value: 'Node.js', label: 'Node.js' },
                { value: 'AWS', label: 'AWS' },
                { value: 'System Design', label: 'System Design' },
                { value: 'PostgreSQL', label: 'PostgreSQL' },
                { value: 'Python', label: 'Python' },
                { value: 'PyTorch', label: 'PyTorch' },
                { value: 'React', label: 'React' },
              ]}
              value={formData.primarySkills}
              onChange={(vals) => updateField('primarySkills', vals)}
            />

            <MultiSelect
              label="Areas You Can Mentor Students In *"
              options={[
                { value: 'Technical Development', label: 'Technical Development' },
                { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
                { value: 'System Design & Architecture', label: 'System Design & Architecture' },
                { value: 'Hackathon Strategy', label: 'Hackathon Strategy & Pitching' },
                { value: 'Career Guidance', label: 'Career Guidance' },
              ]}
              value={formData.mentoringAreas}
              onChange={(vals) => updateField('mentoringAreas', vals)}
            />
          </Card>
        )}

        {step === 3 && (
          <Card className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Availability & Capacity</h3>

            <Select
              label="Maximum Active Student Mentees *"
              value={String(formData.maxActiveMentees)}
              onChange={(e) => updateField('maxActiveMentees', parseInt(e.target.value, 10))}
              options={[
                { value: '1', label: '1 Mentee' },
                { value: '2', label: '2 Mentees' },
                { value: '3', label: '3 Mentees (Recommended)' },
                { value: '5', label: '5 Mentees' },
              ]}
            />

            <TextInput
              label="Availability Schedule *"
              value={formData.availabilitySchedule}
              onChange={(e) => updateField('availabilitySchedule', e.target.value)}
              placeholder="e.g. Weekdays 6:00 PM - 9:00 PM IST"
              required
            />
          </Card>
        )}

        <div className="flex justify-between pt-2">
          {step > 1 ? (
            <SecondaryButton type="button" onClick={() => setStep((prev) => (prev - 1) as any)}>
              ← Back
            </SecondaryButton>
          ) : (
            <div />
          )}

          <Button type="submit" isLoading={isSubmitting} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
            {step === 3 ? 'Publish Mentor Profile' : 'Continue →'}
          </Button>
        </div>
      </form>
    </div>
  );
};
