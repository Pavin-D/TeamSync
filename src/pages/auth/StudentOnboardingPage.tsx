import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Select, MultiSelect } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { Card } from '@/components/ui/Cards';
import { useAuth } from '@/context/AuthContext';
import { MapPin, CheckCircle2, ChevronRight, ChevronLeft, User, GraduationCap, Code, ShieldCheck } from 'lucide-react';

export const StudentOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerStudent } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    college: '',
    department: '',
    course: '',
    yearOfStudy: '3rd Year',
    githubUrl: '',
    linkedInUrl: '',
    skills: ['React', 'TypeScript'],
    locationAllowed: true,
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  };

  // Validation checks per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!formData.name.trim()) {
        setErrorMessage('Full name is required');
        return false;
      }
      if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
        setErrorMessage('A valid email address is required');
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setErrorMessage('Password must be at least 8 characters');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match');
        return false;
      }
      if (!formData.mobile.trim()) {
        setErrorMessage('Mobile number is required');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.college.trim()) {
        setErrorMessage('College / Institution is required');
        return false;
      }
      if (!formData.department.trim()) {
        setErrorMessage('Department is required');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsLoading(true);
    try {
      await registerStudent({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        college: formData.college,
        department: formData.department,
        course: formData.course || 'B.Tech CS',
        yearOfStudy: formData.yearOfStudy,
        githubUrl: formData.githubUrl,
        linkedInUrl: formData.linkedInUrl,
        skills: formData.skills,
        locationAllowed: formData.locationAllowed,
      });
      navigate('/registration-success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Basic Info', icon: <User className="w-4 h-4" /> },
    { num: 2, title: 'Academic', icon: <GraduationCap className="w-4 h-4" /> },
    { num: 3, title: 'Skills & Profiles', icon: <Code className="w-4 h-4" /> },
    { num: 4, title: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { num: 5, title: 'Review', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Student Onboarding</h2>
        <p className="text-xs text-slate-500 mt-1">Set up your profile to connect with teammates and hackathons</p>
      </div>

      {/* Progress Bar Indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        {steps.map((step) => {
          const isComplete = currentStep > step.num;
          const isCurrent = currentStep === step.num;
          return (
            <div key={step.num} className="flex flex-col items-center gap-1 text-center flex-1 relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isComplete
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isComplete ? <CheckCircle2 className="w-4 h-4" /> : step.num}
              </div>
              <span
                className={`text-[10px] font-medium hidden sm:block ${
                  isCurrent ? 'text-brand-700 font-bold' : 'text-slate-400'
                }`}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="Full Name *"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="e.g. Alex Morgan"
              required
            />
            <TextInput
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="alex@university.edu"
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
              error={
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : undefined
              }
              required
            />
            <TextInput
              label="Mobile Number *"
              type="tel"
              value={formData.mobile}
              onChange={(e) => updateField('mobile', e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>
        )}

        {/* Step 2: Academic Information */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="College / Institution Name *"
              value={formData.college}
              onChange={(e) => updateField('college', e.target.value)}
              placeholder="e.g. Stanford University"
              required
            />
            <TextInput
              label="Department *"
              value={formData.department}
              onChange={(e) => updateField('department', e.target.value)}
              placeholder="e.g. Computer Science & Engineering"
              required
            />
            <TextInput
              label="Course / Degree"
              value={formData.course}
              onChange={(e) => updateField('course', e.target.value)}
              placeholder="e.g. B.S. Computer Science"
            />
            <Select
              label="Year of Study"
              value={formData.yearOfStudy}
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
        )}

        {/* Step 3: GitHub & Skills */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="GitHub Profile URL (Recommended)"
              value={formData.githubUrl}
              onChange={(e) => updateField('githubUrl', e.target.value)}
              placeholder="https://github.com/username"
              helperText="Used by AI to extract skills from repositories"
            />
            <TextInput
              label="LinkedIn Profile URL (Optional)"
              value={formData.linkedInUrl}
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
                { value: 'Machine Learning', label: 'Machine Learning' },
                { value: 'PostgreSQL', label: 'PostgreSQL' },
                { value: 'Tailwind CSS', label: 'Tailwind CSS' },
              ]}
              value={formData.skills}
              onChange={(vals) => updateField('skills', vals)}
            />
          </div>
        )}

        {/* Step 4: Location & Preferences */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <Card className="bg-brand-50/50 border-brand-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Location Discovery Permission</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Your approximate location helps us find teammates, hackathons, and mentors near you. We never reveal exact GPS coordinates.
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand-300">
                <input
                  type="radio"
                  name="locationPref"
                  checked={formData.locationAllowed}
                  onChange={() => updateField('locationAllowed', true)}
                  className="text-brand-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Allow approximate location discovery</p>
                  <p className="text-[11px] text-slate-500">Recommended for local hackathons and nearby team matches</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-brand-300">
                <input
                  type="radio"
                  name="locationPref"
                  checked={!formData.locationAllowed}
                  onChange={() => updateField('locationAllowed', false)}
                  className="text-brand-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-900">Use location later</p>
                  <p className="text-[11px] text-slate-500">You can update this setting anytime in your profile</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Review Your Profile Details</h4>
            <Card className="space-y-2 text-xs divide-y divide-slate-100">
              <div className="pb-2">
                <span className="text-slate-400 block">Personal</span>
                <p className="font-semibold text-slate-800">{formData.name} ({formData.email})</p>
                <p className="text-slate-600">{formData.mobile}</p>
              </div>
              <div className="py-2">
                <span className="text-slate-400 block">Academic</span>
                <p className="font-semibold text-slate-800">{formData.college}</p>
                <p className="text-slate-600">{formData.department} • {formData.yearOfStudy}</p>
              </div>
              <div className="py-2">
                <span className="text-slate-400 block">Skills</span>
                <p className="text-slate-700">{formData.skills.join(', ') || 'None selected'}</p>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block">Location Discovery</span>
                <p className="font-semibold text-slate-800">{formData.locationAllowed ? 'Allowed (Approximate)' : 'Disabled'}</p>
              </div>
            </Card>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <SecondaryButton type="button" size="sm" onClick={handleBack} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </SecondaryButton>
          ) : (
            <Link to="/signup" className="text-xs text-slate-500 hover:underline">
              Change Role
            </Link>
          )}

          {currentStep < 5 ? (
            <Button type="button" size="sm" onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
              Continue
            </Button>
          ) : (
            <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Create Student Account
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
