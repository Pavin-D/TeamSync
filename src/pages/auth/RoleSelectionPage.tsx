import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Cards';
import { GraduationCap, Briefcase, Building2, ArrowRight } from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();

  const roleOptions = [
    {
      id: 'student',
      title: 'College Student',
      description: 'Find teammates for hackathons, extract skills, connect with mentors, and compete.',
      icon: <GraduationCap className="w-8 h-8 text-brand-600" />,
      badge: 'Students & Alumni',
      color: 'hover:border-brand-300 hover:bg-brand-50/30',
      path: '/signup/student',
    },
    {
      id: 'professional',
      title: 'Working Professional / Mentor',
      description: 'Guide hackathon teams, mentor students, and connect with top college tech talent.',
      icon: <Briefcase className="w-8 h-8 text-violet-600" />,
      badge: 'Industry Experts',
      color: 'hover:border-violet-300 hover:bg-violet-50/30',
      path: '/signup/professional',
    },
    {
      id: 'college',
      title: 'College / Institution',
      description: 'Manage departmental student participation, track hackathon wins, and institution rankings.',
      icon: <Building2 className="w-8 h-8 text-emerald-600" />,
      badge: 'Universities & Admins',
      color: 'hover:border-emerald-300 hover:bg-emerald-50/30',
      path: '/signup/college',
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Create your account</h2>
        <p className="text-xs text-slate-500 mt-1">Select your role to get started with tailored tools</p>
      </div>

      <div className="space-y-3">
        {roleOptions.map((opt) => (
          <Card
            key={opt.id}
            hoverable
            onClick={() => navigate(opt.path)}
            className={`flex items-start gap-4 p-4 transition-all duration-200 border border-slate-200 ${opt.color}`}
          >
            <div className="p-3 bg-slate-50 rounded-xl shrink-0 border border-slate-100">{opt.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {opt.badge}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 self-center shrink-0" />
          </Card>
        ))}
      </div>

      <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
        Already registered?{' '}
        <Link to="/login" className="text-brand-600 font-semibold hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
};
