import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Select, MultiSelect, FileUpload } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { Card, Badge } from '@/components/ui/Cards';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const ProfessionalOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerProfessional } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    jobTitle: '',
    company: '',
    yearsOfExperience: 3,
    linkedInUrl: '',
    githubUrl: '',
    skills: ['System Design', 'React'],
    employeeIdCardFile: null as File | null,
    locationAllowed: true,
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.mobile.trim()) {
        setErrorMessage('All basic personal fields are required');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.jobTitle.trim() || !formData.company.trim()) {
        setErrorMessage('Job title and company name are required');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerProfessional({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        jobTitle: formData.jobTitle,
        company: formData.company,
        yearsOfExperience: Number(formData.yearsOfExperience),
        linkedInUrl: formData.linkedInUrl,
        githubUrl: formData.githubUrl,
        skills: formData.skills,
        employeeIdCardFile: formData.employeeIdCardFile,
        locationAllowed: formData.locationAllowed,
      });
      navigate('/registration-success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Professional registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Professional & Mentor Onboarding</h2>
        <p className="text-xs text-slate-500 mt-1">Join as an industry mentor, judge, or professional advisor</p>
      </div>

      {/* Steps Progress */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-xs font-semibold">
        <span className={currentStep === 1 ? 'text-violet-600 font-bold' : 'text-slate-400'}>1. Personal</span>
        <span className={currentStep === 2 ? 'text-violet-600 font-bold' : 'text-slate-400'}>2. Professional</span>
        <span className={currentStep === 3 ? 'text-violet-600 font-bold' : 'text-slate-400'}>3. Verification</span>
        <span className={currentStep === 4 ? 'text-violet-600 font-bold' : 'text-slate-400'}>4. Review</span>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="Full Name *"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. David Vance"
              required
            />
            <TextInput
              label="Work / Personal Email *"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="david@company.com"
              required
            />
            <div>
              <PasswordInput
                label="Create Password *"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
                required
              />
              <PasswordStrengthIndicator password={formData.password} />
            </div>
            <PasswordInput
              label="Confirm Password *"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
            />
            <TextInput
              label="Mobile Number *"
              value={formData.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="Job Title / Role *"
              value={formData.jobTitle}
              onChange={(e) => updateField('jobTitle', e.target.value)}
              placeholder="e.g. Senior Software Architect"
              required
            />
            <TextInput
              label="Current Company / Organization *"
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
              placeholder="e.g. Google / Microsoft / Startup"
              required
            />
            <Select
              label="Years of Experience"
              value={String(formData.yearsOfExperience)}
              onChange={(e) => updateField('yearsOfExperience', e.target.value)}
              options={[
                { value: '1', label: '1 - 2 Years' },
                { value: '3', label: '3 - 5 Years' },
                { value: '7', label: '6 - 10 Years' },
                { value: '12', label: '10+ Years' },
              ]}
            />
            <TextInput
              label="LinkedIn Profile URL"
              value={formData.linkedInUrl}
              onChange={(e) => updateField('linkedInUrl', e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
            <MultiSelect
              label="Areas of Expertise & Skills"
              options={[
                { value: 'System Design', label: 'System Design' },
                { value: 'Cloud Architecture', label: 'Cloud Architecture' },
                { value: 'AI / Machine Learning', label: 'AI / Machine Learning' },
                { value: 'React', label: 'React' },
                { value: 'Python', label: 'Python' },
                { value: 'DevOps', label: 'DevOps' },
              ]}
              value={formData.skills}
              onChange={(vals) => updateField('skills', vals)}
            />
          </div>
        )}

        {/* Step 3: Verification */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="bg-slate-50 border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Employment Verification Status</span>
                <Badge variant="warning">Verification Pending</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload your Employee ID badge, offer letter, or work certificate for verification by our moderation team.
              </p>
            </Card>

            <FileUpload
              label="Upload Employee ID Card / Proof (PDF, JPG, PNG)"
              accept=".pdf,.png,.jpg,.jpeg"
              onFileSelect={(file) => updateField('employeeIdCardFile', file)}
            />
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase text-slate-500">Summary & Confirmation</h4>
            <Card className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pb-2">
                <span className="text-slate-400 block">Personal</span>
                <p className="font-semibold text-slate-800">{formData.name} ({formData.email})</p>
              </div>
              <div className="py-2">
                <span className="text-slate-400 block">Professional Identity</span>
                <p className="font-semibold text-slate-800">{formData.jobTitle} at {formData.company}</p>
                <p className="text-slate-600">{formData.yearsOfExperience} Years Experience</p>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block">Verification File Attached</span>
                <p className="font-semibold text-slate-800">
                  {formData.employeeIdCardFile ? formData.employeeIdCardFile.name : 'No file uploaded (Optional)'}
                </p>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <SecondaryButton type="button" size="sm" onClick={() => setCurrentStep((prev) => prev - 1)} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </SecondaryButton>
          ) : (
            <Link to="/signup" className="text-xs text-slate-500 hover:underline">
              Change Role
            </Link>
          )}

          {currentStep < 4 ? (
            <Button type="button" size="sm" onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
              Continue
            </Button>
          ) : (
            <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Complete Professional Registration
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
