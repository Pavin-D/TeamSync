import React from 'react';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface StudentPlaceholderProps {
  title: string;
  description: string;
}

export const StudentPlaceholderPage: React.FC<StudentPlaceholderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto py-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Student Route: {location.pathname}</span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h1>
        </div>
      </div>

      <Card className="p-8 text-center bg-slate-50 border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">{title} Module Placeholder</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          {description}
        </p>
        <Button onClick={() => navigate('/student/dashboard')}>
          Back to Student Dashboard
        </Button>
      </Card>
    </div>
  );
};
