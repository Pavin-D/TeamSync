import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificationService, NotificationItem } from '@/services/api/notificationService';
import { formatRelativeTime } from '@/utils/dateUtils';
import { Bell, CheckCheck, Users, Calendar, UserCheck, Trophy } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        notificationService.getNotifications({ unreadOnly: false }),
        notificationService.getUnreadCount(),
      ]);

      if (listRes.success && listRes.data) {
        setNotifications(listRes.data);
      } else {
        setNotifications([]);
      }

      if (countRes.success && countRes.data) {
        setUnreadCount(countRes.data.count || countRes.data.unreadCount || 0);
      }
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (notif: NotificationItem) => {
    try {
      await notificationService.markNotificationRead(notif.id);
      setNotifications(notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      setNotifications(notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    if (notif.entityType === 'TEAM' && notif.entityId) {
      setIsOpen(false);
      navigate(`/teams/${notif.entityId}`);
    } else if (notif.actionUrl) {
      setIsOpen(false);
      navigate(notif.actionUrl);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    if (type.includes('TEAM') || type.includes('JOIN')) return <Users className="w-4 h-4 text-brand-600" />;
    if (type.includes('EVENT')) return <Calendar className="w-4 h-4 text-emerald-600" />;
    if (type.includes('MENTOR')) return <UserCheck className="w-4 h-4 text-indigo-600" />;
    if (type.includes('RANKING') || type.includes('ACHIEVEMENT')) return <Trophy className="w-4 h-4 text-amber-600" />;
    return <Bell className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-80 sm:w-96 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 text-left">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  {unreadCount} Unread
                </span>
              )}
            </div>

            <button
              onClick={handleMarkAllRead}
              className="text-[11px] font-semibold text-brand-600 hover:underline flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Mark all read
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif)}
                  className={`p-3.5 flex gap-3 hover:bg-slate-50 cursor-pointer transition ${
                    !notif.isRead ? 'bg-brand-50/30' : 'bg-white'
                  }`}
                >
                  <div className="pt-0.5 shrink-0">{getNotificationIcon(notif.type)}</div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold block ${!notif.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs font-medium">You're all caught up. No notifications yet.</div>
            )}
          </div>

          <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="text-xs font-bold text-brand-600 hover:underline"
            >
              View All Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
