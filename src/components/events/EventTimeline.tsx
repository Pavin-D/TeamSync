import React from 'react';
import { TimelineStep } from '@/services/api/eventService';
import { Card } from '@/components/ui/Cards';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export interface EventTimelineProps {
  timeline?: TimelineStep[];
  className?: string;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  timeline = [
    { title: 'Registration Opens', date: 'Aug 01, 2026', isCompleted: true, isCurrent: false },
    { title: 'Registration Deadline', date: 'Aug 18, 2026', isCompleted: false, isCurrent: true },
    { title: 'Hackathon Starts', date: 'Aug 20, 2026', isCompleted: false, isCurrent: false },
    { title: 'Submission Deadline', date: 'Aug 24, 2026', isCompleted: false, isCurrent: false },
    { title: 'Evaluation & Judging', date: 'Aug 25, 2026', isCompleted: false, isCurrent: false },
    { title: 'Winner Announcement', date: 'Aug 26, 2026', isCompleted: false, isCurrent: false },
  ],
  className,
}) => {
  return (
    <Card className={`text-left ${className}`}>
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Event Schedule & Timeline</h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((step, idx) => (
          <div key={idx} className="relative text-xs">
            {/* Timeline Dot */}
            <div className="absolute -left-6 top-0.5">
              {step.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white rounded-full" />
              ) : step.isCurrent ? (
                <Clock className="w-5 h-5 text-brand-600 bg-white rounded-full animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300 bg-white rounded-full" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h4 className={`font-bold ${step.isCurrent ? 'text-brand-700' : 'text-slate-900'}`}>
                  {step.title}
                </h4>
                {step.description && <p className="text-slate-500 text-[11px]">{step.description}</p>}
              </div>

              <span className={`text-[11px] font-semibold ${step.isCurrent ? 'text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200' : 'text-slate-500'}`}>
                {step.date} {step.time ? `• ${step.time}` : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
