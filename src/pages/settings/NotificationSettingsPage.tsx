import React, { useState } from 'react';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Inputs';
import { Settings, Bell, Mail } from 'lucide-react';

export const NotificationSettingsPage: React.FC = () => {
  const [teamInvitations, setTeamInvitations] = useState(true);
  const [eventUpdates, setEventUpdates] = useState(true);
  const [mentorshipRequests, setMentorshipRequests] = useState(true);
  const [rankingUpdates, setRankingUpdates] = useState(false);
  const [systemNotifications, setSystemNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6 text-left pb-16">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <Settings className="w-6 h-6 text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notification Preferences</h1>
          <p className="text-xs text-slate-500">Configure alert rules for platform updates, team invites, and email delivery</p>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-brand-600" /> In-App Notification Alerts
          </h3>

          <div className="divide-y divide-slate-100 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Team Invitations & Requests</span>
                <span className="text-slate-500 text-[11px]">Alerts when you receive team invites or join requests.</span>
              </div>
              <Toggle checked={teamInvitations} onChange={setTeamInvitations} />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Event & Hackathon Updates</span>
                <span className="text-slate-500 text-[11px]">Reminders for upcoming hackathon deadlines and published results.</span>
              </div>
              <Toggle checked={eventUpdates} onChange={setEventUpdates} />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Mentorship Session Requests</span>
                <span className="text-slate-500 text-[11px]">Alerts for scheduled professional mentorship sessions.</span>
              </div>
              <Toggle checked={mentorshipRequests} onChange={setMentorshipRequests} />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Ranking Movement Alerts</span>
                <span className="text-slate-500 text-[11px]">Notifications when your global or college ranking changes.</span>
              </div>
              <Toggle checked={rankingUpdates} onChange={setRankingUpdates} />
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">System & Security Notices</span>
                <span className="text-slate-500 text-[11px]">Important platform updates and security alerts (Mandatory).</span>
              </div>
              <Toggle checked={systemNotifications} onChange={setSystemNotifications} disabled />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-emerald-600" /> Email Notifications
          </h3>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-900 block">Receive Daily Email Digest</span>
              <span className="text-slate-500 text-[11px]">Send daily summary of team requests and event deadlines to your registered email.</span>
            </div>
            <Toggle checked={emailNotifications} onChange={setEmailNotifications} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          {isSaved && <span className="text-xs font-bold text-emerald-600">✓ Preferences saved successfully!</span>}
          <Button onClick={handleSave} className="ml-auto">
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
};
