import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Select } from '@/components/ui/Inputs';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { PasswordStrengthIndicator } from '@/components/ui/PasswordStrengthIndicator';
import { Card, Badge } from '@/components/ui/Cards';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export const CollegeOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerCollege } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    institutionName: '',
    officialEmail: '',
    password: '',
    confirmPassword: '',
    institutionType: 'University',
    website: '',
    city: '',
    state: '',
    country: 'United States',
  });

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.institutionName.trim() || !formData.officialEmail.trim() || !formData.password) {
        setErrorMessage('Institution name, official email, and password are required');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage('Passwords do not match');
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerCollege({
        institutionName: formData.institutionName,
        officialEmail: formData.officialEmail,
        password: formData.password,
        institutionType: formData.institutionType,
        website: formData.website,
        city: formData.city,
        state: formData.state,
        country: formData.country,
      });
      navigate('/college/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || 'College registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900">College & Institution Onboarding</h2>
        <p className="text-xs text-slate-500 mt-1">Register your university, department, or educational institute</p>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="Official Institution Name *"
              value={formData.institutionName}
              onChange={(e) => updateField('institutionName', e.target.value)}
              placeholder="e.g. Stanford University"
              required
            />
            <TextInput
              label="Official Institution Email *"
              type="email"
              value={formData.officialEmail}
              onChange={(e) => updateField('officialEmail', e.target.value)}
              placeholder="admin@institution.edu"
              helperText="Must be an official institutional domain email"
              required
            />
            <Select
              label="Institution Type"
              value={formData.institutionType}
              onChange={(e) => updateField('institutionType', e.target.value)}
              options={[
                { value: 'University', label: 'University' },
                { value: 'Autonomous College', label: 'Autonomous College' },
                { value: 'Technical Institute / Polytechnic', label: 'Technical Institute / Polytechnic' },
                { value: 'Department / Organization', label: 'Department / Organization' },
              ]}
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
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <TextInput
              label="Official Website URL"
              value={formData.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://www.institution.edu"
            />
            <div className="grid grid-cols-2 gap-4">
              <TextInput
                label="City *"
                value={formData.city}
                onChange={(e) => updateField('city', e.target.value)}
                placeholder="e.g. Stanford"
                required
              />
              <TextInput
                label="State / Province *"
                value={formData.state}
                onChange={(e) => updateField('state', e.target.value)}
                placeholder="e.g. California"
                required
              />
            </div>

            <Card className="bg-slate-50 border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Institutional Verification</span>
                <Badge variant="warning">Pending Verification</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Institutional accounts require manual approval by system administrators. Your account will have access to college analytics upon confirmation.
              </p>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {currentStep > 1 ? (
            <SecondaryButton type="button" size="sm" onClick={() => setCurrentStep(1)} leftIcon={<ChevronLeft className="w-4 h-4" />}>
              Back
            </SecondaryButton>
          ) : (
            <Link to="/signup" className="text-xs text-slate-500 hover:underline">
              Change Role
            </Link>
          )}

          {currentStep === 1 ? (
            <Button type="button" size="sm" onClick={handleNext} rightIcon={<ChevronRight className="w-4 h-4" />}>
              Continue
            </Button>
          ) : (
            <Button type="submit" size="sm" isLoading={isLoading} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Register Institution
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
