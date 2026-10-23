import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export interface EventCountdownProps {
  targetTimestamp: string; // ISO String
  className?: string;
}

export const EventCountdown: React.FC<EventCountdownProps> = ({ targetTimestamp, className }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetTimestamp).getTime() - new Date().getTime();
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  if (timeLeft.isExpired) {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 text-xs font-semibold px-3 py-1 rounded-xl border border-rose-200 ${className}`}>
        <Clock className="w-3.5 h-3.5" />
        <span>Registration Closed</span>
      </div>
    );
  }

  return (
    <div className={`bg-amber-50/80 border border-amber-200/90 p-3 rounded-2xl text-left ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1.5">
        <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>Registration Closes In:</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-white p-1.5 rounded-xl border border-amber-100 shadow-subtle">
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            {String(timeLeft.days).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Days</span>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-amber-100 shadow-subtle">
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Hours</span>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-amber-100 shadow-subtle">
          <span className="text-base font-extrabold text-slate-900 block leading-tight">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Mins</span>
        </div>
        <div className="bg-white p-1.5 rounded-xl border border-amber-100 shadow-subtle">
          <span className="text-base font-extrabold text-slate-900 block leading-tight text-amber-600">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Secs</span>
        </div>
      </div>
    </div>
  );
};
