import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Select } from '@/components/ui/Inputs';
import { Button } from '@/components/ui/Button';
import { ALL_ROLES, ROLE_CONFIGS, UserRole, ROLES } from '@/constants/roles';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerStudent, registerProfessional, registerCollege } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (selectedRole === 'STUDENT') {
        await registerStudent({
          name,
          email,
          password,
          college: 'General University',
          department: 'Computer Science',
          yearOfStudy: 1,
        });
        navigate('/student/dashboard');
      } else if (selectedRole === 'PROFESSIONAL') {
        await registerProfessional({
          name,
          email,
          password,
          company: 'Industry Partner',
          jobTitle: 'Software Engineer',
        });
        navigate('/professional/dashboard');
      } else if (selectedRole === ROLES.COLLEGE) {
        await registerCollege({
          institutionName: name || 'University Campus',
          officialEmail: email,
          password,
          institutionType: 'Engineering College',
          city: 'City',
          state: 'State',
          country: 'Country',
        });
        navigate('/college/dashboard');
      } else {
        navigate(ROLE_CONFIGS[selectedRole].defaultPath);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">Create an Account</h3>
        <p className="text-xs text-slate-500 mt-1">
          Join TeamSync to build teams, connect with mentors, and join hackathons.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Sarah Jenkins"
          required
        />

        <TextInput
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@institution.edu"
          required
        />

        <Select
          label="Account Type / Role"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole)}
          options={ALL_ROLES.map((r) => ({
            value: r,
            label: `${ROLE_CONFIGS[r].label}`,
          }))}
        />

        <PasswordInput
          label="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          required
        />

        <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<UserPlus className="w-4 h-4" />}>
          Register Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
