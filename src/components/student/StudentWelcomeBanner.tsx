import React from 'react';
import { Button, SecondaryButton } from '@/components/ui/Button';
import { Sparkles, Users, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface StudentWelcomeBannerProps {
  studentName?: string;
  className?: string;
}

export const StudentWelcomeBanner: React.FC<StudentWelcomeBannerProps> = ({
  studentName = 'Student',
  className,
}) => {
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div
      className={`bg-gradient-to-r from-brand-600 via-brand-700 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden text-left ${className}`}
    >
      {/* Background visual glow */}
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20 text-white/90">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Team Formation Workspace</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getGreeting()}, {studentName}!
        </h1>

        <p className="text-xs sm:text-sm text-indigo-100 mt-2 leading-relaxed">
          Ready to build your next great team? Discover teammates based on skills, GitHub activity, interests, location, and compatibility.
        </p>

        <div className="flex flex-wrap items-center gap-3 mt-6">
          <Button
            onClick={() => navigate('/student/teammates')}
            size="md"
            className="bg-white text-brand-700 hover:bg-slate-50 font-semibold shadow-md border border-white"
            leftIcon={<Users className="w-4 h-4 text-brand-600" />}
            rightIcon={<ArrowRight className="w-4 h-4 text-brand-600" />}
          >
            Find Teammates
          </Button>

          <SecondaryButton
            onClick={() => navigate('/student/events')}
            size="md"
            className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
            leftIcon={<Calendar className="w-4 h-4" />}
          >
            Explore Events
          </SecondaryButton>
        </div>
      </div>
    </div>
  );
};
