import { useState, useEffect } from 'react';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); 
    return () => clearInterval(interval); 
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all notifications as read');
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors">
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl max-h-[32rem] overflow-hidden z-50">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <span className="font-bold text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Mark all read
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`p-4 text-sm border-b border-gray-50 cursor-pointer transition-colors ${n.isRead ? 'text-gray-500 hover:bg-gray-50' : 'font-medium bg-blue-50 hover:bg-blue-100'}`}
                >
                  <p className="leading-snug">{n.message}</p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
