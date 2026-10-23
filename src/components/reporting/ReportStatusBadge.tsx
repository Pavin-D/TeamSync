import React from 'react';
import { Badge } from '@/components/ui/Cards';
import { ReportStatus, ReportPriority } from '@/services/api/reportService';

export interface ReportStatusBadgeProps {
  status: ReportStatus | string;
}

export const ReportStatusBadge: React.FC<ReportStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'SUBMITTED':
      return <Badge variant="primary">Submitted</Badge>;
    case 'UNDER_REVIEW':
      return <Badge variant="warning">Under Review</Badge>;
    case 'RESOLVED':
    case 'ACTION_TAKEN':
      return <Badge variant="success">Resolved ✓</Badge>;
    case 'DISMISSED':
      return <Badge variant="default">Dismissed</Badge>;
    case 'CLOSED':
      return <Badge variant="default">Closed</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export const ReportPriorityBadge: React.FC<{ priority: ReportPriority | string }> = ({ priority }) => {
  switch (priority) {
    case 'CRITICAL':
      return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold px-2.5 py-0.5 rounded-md text-[10px]">CRITICAL</span>;
    case 'HIGH':
      return <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold px-2 py-0.5 rounded-md text-[10px]">HIGH</span>;
    case 'MEDIUM':
      return <span className="bg-sky-100 text-sky-800 border border-sky-300 font-semibold px-2 py-0.5 rounded-md text-[10px]">MEDIUM</span>;
    case 'LOW':
    default:
      return <span className="bg-slate-100 text-slate-600 border border-slate-200 font-medium px-2 py-0.5 rounded-md text-[10px]">LOW</span>;
  }
};
