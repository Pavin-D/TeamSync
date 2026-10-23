import React from 'react';
import { AccountStatus } from '@/services/api/reportService';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ModerationStatusBannerProps {
  status: AccountStatus;
  activeRestrictions?: string[];
}

export const ModerationStatusBanner: React.FC<ModerationStatusBannerProps> = ({
  status,
  activeRestrictions = [],
}) => {
  if (status === 'ACTIVE') return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-subtle mb-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-950">
            Account Status: {status.replace('_', ' ')}
          </h4>
          <p className="text-xs text-amber-800 mt-0.5">
            {status === 'RESTRICTED'
              ? `Your account currently has active restrictions (${activeRestrictions.join(', ') || 'Team creation disabled'}).`
              : status === 'SUSPENDED'
              ? 'Your account is temporarily suspended from participating in hackathon events and team formation.'
              : 'Your account is under moderation review.'}
          </p>
        </div>
      </div>

      <Link
        to="/appeals"
        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 transition"
      >
        <span>Appeal Account Action</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};
