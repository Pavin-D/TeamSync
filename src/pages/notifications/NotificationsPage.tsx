import React, { useEffect, useState } from 'react';
import { notificationService, NotificationItem } from '@/services/api/notificationService';
import { Card } from '@/components/ui/Cards';
import { Button } from '@/components/ui/Button';
import { SkeletonLoader } from '@/components/ui/Feedback';
import { formatRelativeTime } from '@/utils/dateUtils';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationService.getNotifications();
      if (res.success && res.data) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch {
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllNotificationsRead();
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await notificationService.deleteNotification(id);
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterCategory === 'UNREAD') return !n.isRead;
    if (filterCategory === 'TEAMS') return n.type.includes('TEAM') || n.type.includes('JOIN');
    if (filterCategory === 'EVENTS') return n.type.includes('EVENT');
    if (filterCategory === 'MENTORSHIP') return n.type.includes('MENTOR');
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 text-left pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Notification Center</h1>
            <p className="text-xs text-slate-500">Platform activity alerts, team invitations, and event notifications</p>
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={handleMarkAllRead} leftIcon={<CheckCheck className="w-4 h-4" />}>
          Mark All Read
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs border-b border-slate-100 pb-2">
        {['ALL', 'UNREAD', 'TEAMS', 'EVENTS', 'MENTORSHIP'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              filterCategory === cat ? 'bg-brand-600 text-white shadow-subtle' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <SkeletonLoader variant="card" count={3} />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`p-4 flex items-start justify-between gap-4 transition ${
                  !notif.isRead ? 'bg-brand-50/40 border-brand-200' : 'bg-white border-slate-200'
                }`}
              >
                <div
                  className="flex gap-3 cursor-pointer flex-1"
                  onClick={() => {
                    if (notif.entityType === 'TEAM' && notif.entityId) {
                      navigate(`/teams/${notif.entityId}`);
                    } else if (notif.actionUrl) {
                      navigate(notif.actionUrl);
                    }
                  }}
                >
                  <div className="pt-1">
                    <Bell className="w-4 h-4 text-brand-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 text-sm block">{notif.title}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(notif.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition"
                  title="Delete notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs font-medium">You're all caught up. No notifications found.</div>
          )}
        </div>
      )}
    </div>
  );
};
