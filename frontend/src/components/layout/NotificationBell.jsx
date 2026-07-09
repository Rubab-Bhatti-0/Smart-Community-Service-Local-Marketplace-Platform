import { useState, useEffect } from 'react';
import { getMyNotifications, markNotificationRead, markAllNotificationsRead } from '../../api/notifications';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    const res = await getMyNotifications();
    setNotifications(res.data.notifications);
    setUnreadCount(res.data.unreadCount);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); 
    return () => clearInterval(interval); 

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    fetchNotifications();
  };
}
  )
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-10">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-medium text-sm">Notifications</span>
            <button onClick={handleMarkAllRead} className="text-xs text-blue-600">Mark all read</button>
          </div>
          {notifications.length === 0 && <p className="p-3 text-sm text-gray-500">No notifications.</p>}
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && handleMarkRead(n._id)}
              className={`p-3 text-sm border-b cursor-pointer ${n.isRead ? 'text-gray-500' : 'font-medium bg-blue-50'}`}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}