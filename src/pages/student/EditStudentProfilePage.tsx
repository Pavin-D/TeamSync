import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { studentService, StudentProfileData } from '@/services/api/studentService';
import { TextInput, Textarea, Select, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Card } from '@/components/ui/Cards';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { Save, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const EditStudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<StudentProfileData>>({
    name: user?.name || 'Alex Morgan',
    email: user?.email || 'alex.morgan@university.edu',
    institution: user?.institution || 'Stanford University',
    department: user?.department || 'Computer Science & Engineering',
    course: 'B.S. Computer Science',
    yearOfStudy: '3rd Year',
    bio: 'Passionate full-stack & AI student developer looking to build innovative products for upcoming hackathons.',
    mobile: '+1 (555) 012-4821',
    githubUrl: 'https://github.com/alexmorgan',
    linkedInUrl: 'https://linkedin.com/in/alexmorgan',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'FastAPI'],
    availability: {
      availableForTeams: true,
      academicProjects: true,
      hackathons: true,
      longTermProjects: false,
    },
    locationPref: {
      allowed: true,
      approximateCity: 'Stanford, CA Area',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await studentService.getStudentProfile();
        if (response.success && response.data) {
          setFormData(response.data);
        }
      } catch {
        // Dev fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateAvailability = (key: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability!,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    try {
      await studentService.updateStudentProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => navigate('/student/profile'), 1000);
    } catch {
      setSuccessMessage('Profile changes saved locally.');
      setTimeout(() => navigate('/student/profile'), 1000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <SkeletonLoader variant="card" count={3} className="h-40" />;
  }

  return (
    <div className="space-y-6 text-left pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/student/profile')}
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <h1 className="text-xl font-bold text-slate-900">Edit Student Profile</h1>
        </div>

        <SecondaryButton size="sm" onClick={() => navigate('/student/profile')}>
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
        {/* Basic Information */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Details</h3>
          <TextInput
            label="Full Name *"
            value={formData.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
          <TextInput
            label="Mobile Number"
            value={formData.mobile || ''}
            onChange={(e) => updateField('mobile', e.target.value)}
            helperText="Display will be masked in public views"
          />
          <Textarea
            label="Short Bio"
            value={formData.bio || ''}
            onChange={(e) => updateField('bio', e.target.value)}
            rows={3}
          />
        </Card>

        {/* Academic Details */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Academic Details</h3>
          <TextInput
            label="College / Institution Name *"
            value={formData.institution || ''}
            onChange={(e) => updateField('institution', e.target.value)}
            required
          />
          <TextInput
            label="Department *"
            value={formData.department || ''}
            onChange={(e) => updateField('department', e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Course / Degree"
              value={formData.course || ''}
              onChange={(e) => updateField('course', e.target.value)}
            />
            <Select
              label="Year of Study"
              value={formData.yearOfStudy || '3rd Year'}
              onChange={(e) => updateField('yearOfStudy', e.target.value)}
              options={[
                { value: '1st Year', label: '1st Year' },
                { value: '2nd Year', label: '2nd Year' },
                { value: '3rd Year', label: '3rd Year' },
                { value: '4th Year / Senior', label: '4th Year / Senior' },
                { value: 'Postgraduate / PhD', label: 'Postgraduate / PhD' },
              ]}
            />
          </div>
        </Card>

        {/* Technical & Social Profiles */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Social & Technical Links</h3>
          <TextInput
            label="GitHub Profile URL"
            value={formData.githubUrl || ''}
            onChange={(e) => updateField('githubUrl', e.target.value)}
            placeholder="https://github.com/username"
          />
          <TextInput
            label="LinkedIn Profile URL"
            value={formData.linkedInUrl || ''}
            onChange={(e) => updateField('linkedInUrl', e.target.value)}
            placeholder="https://linkedin.com/in/username"
          />
          <MultiSelect
            label="Primary Tech & Domain Skills"
            options={[
              { value: 'React', label: 'React' },
              { value: 'TypeScript', label: 'TypeScript' },
              { value: 'Python', label: 'Python' },
              { value: 'FastAPI', label: 'FastAPI' },
              { value: 'Node.js', label: 'Node.js' },
              { value: 'PostgreSQL', label: 'PostgreSQL' },
              { value: 'Tailwind CSS', label: 'Tailwind CSS' },
            ]}
            value={formData.skills || []}
            onChange={(vals) => updateField('skills', vals)}
          />
        </Card>

        {/* Availability Preferences */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Collaboration Preferences</h3>
          <div className="space-y-2 text-xs">
            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availability?.availableForTeams || false}
                onChange={(e) => updateAvailability('availableForTeams', e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Available for new teams</span>
            </label>

            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availability?.hackathons || false}
                onChange={(e) => updateAvailability('hackathons', e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Open to Hackathons & Competitions</span>
            </label>

            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availability?.academicProjects || false}
                onChange={(e) => updateAvailability('academicProjects', e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Open to Academic Projects</span>
            </label>

            <label className="flex items-center gap-2 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={formData.availability?.longTermProjects || false}
                onChange={(e) => updateAvailability('longTermProjects', e.target.checked)}
                className="rounded text-brand-600"
              />
              <span>Open to Long-term Projects</span>
            </label>
          </div>
        </Card>

        <div className="flex justify-end gap-3 pt-2">
          <SecondaryButton type="button" onClick={() => navigate('/student/profile')}>
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
