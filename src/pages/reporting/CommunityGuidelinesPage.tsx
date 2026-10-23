import React from 'react';
import { Card } from '@/components/ui/Cards';
import { ShieldCheck, Users, Award, Heart, CheckCircle2 } from 'lucide-react';

export const CommunityGuidelinesPage: React.FC = () => {
  return (
    <div className="space-y-8 text-left pb-16 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-modal">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Platform Trust & Safety Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Community Standards & Trust Policy</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Our platform connects students, mentors, institutions, and working professionals to foster collaborative innovation. We enforce clear rules to maintain a safe, fair environment.
          </p>
        </div>
      </div>

      {/* Guidelines Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
            <Users className="w-5 h-5 text-brand-600" />
            <span>1. Responsible Team Participation</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Communicate transparently with your hackathon team. Do not abandon teams mid-project or delete shared project repositories without prior consensus.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
            <Award className="w-5 h-5 text-indigo-600" />
            <span>2. Honest Profiles & Credentials</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Provide accurate skill information, academic enrollment, and GitHub repositories. Do not fabricate technical achievements or impersonate others.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <Heart className="w-5 h-5 text-rose-600" />
            <span>3. Zero Tolerance for Harassment</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bullying, abusive language, discrimination, or unwanted solicitation will result in immediate account restriction, suspension, or permanent ban.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>4. Respectful Mentorship Conduct</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mentors and mentees must honor scheduled guidance sessions. If unable to attend, provide advance notice and reschedule promptly.
          </p>
        </Card>
      </div>
    </div>
  );
};
