import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import BottomNavigation from '../components/BottomNavigation';

interface Notification {
  id: string;
  type: 'renewal' | 'followup' | 'compliance' | 'missed-call';
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

type FilterType = 'all' | 'renewal' | 'followup' | 'compliance' | 'missed-call';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      type: 'renewal',
      title: 'Policy Renewal Due',
      message: 'Amit Patel\'s health insurance policy expires in 7 days',
      leadId: 'lead-2',
      leadName: 'Amit Patel',
      timestamp: '2024-11-15T09:00:00Z',
      isRead: false,
      priority: 'high',
    },
    {
      id: 'notif-2',
      type: 'followup',
      title: 'Follow-up Reminder',
      message: 'Time to follow up with Priya Sharma about term life quote',
      leadId: 'lead-1',
      leadName: 'Priya Sharma',
      timestamp: '2024-11-15T10:30:00Z',
      isRead: false,
      priority: 'high',
    },
    {
      id: 'notif-3',
      type: 'missed-call',
      title: 'Missed Call',
      message: 'Rahul Mehta tried to reach you at 2:30 PM',
      leadId: 'lead-4',
      leadName: 'Rahul Mehta',
      timestamp: '2024-11-15T14:30:00Z',
      isRead: false,
      priority: 'medium',
    },
    {
      id: 'notif-4',
      type: 'compliance',
      title: 'Compliance Alert',
      message: 'New IRDAI guidelines published - Review required',
      timestamp: '2024-11-14T16:00:00Z',
      isRead: true,
      priority: 'high',
    },
  ]);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'renewal', label: 'Renewals' },
    { id: 'followup', label: 'Follow-ups' },
    { id: 'compliance', label: 'Compliance' },
    { id: 'missed-call', label: 'Missed Calls' },
  ];

  const filteredNotifications = notifications.filter(notif =>
    activeFilter === 'all' ? true : notif.type === activeFilter
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'renewal':
        return <Clock className="w-4 h-4" />;
      case 'followup':
        return <Bell className="w-4 h-4" />;
      case 'compliance':
        return <AlertTriangle className="w-4 h-4" />;
      case 'missed-call':
        return <Phone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'renewal':
        return 'bg-semantic-warning/20 text-semantic-warning';
      case 'followup':
        return 'bg-primary/20 text-primary';
      case 'compliance':
        return 'bg-semantic-error/20 text-semantic-error';
      case 'missed-call':
        return 'bg-semantic-info/20 text-semantic-info';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-page pb-24">
      <div className="px-4 pt-4 pb-4 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-content">Notifications</h1>
            <p className="text-xs text-secondary-content mt-0.5">
              {unreadCount} unread
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-primary hover:text-primary-dark font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                ${activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'glass-effect text-secondary-content hover:border-primary/50'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  glass-effect rounded-xl p-4 transition-all
                  ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-medium text-primary-content">
                        {notification.title}
                      </h3>
                      <span className="text-[10px] text-secondary-content whitespace-nowrap">
                        {formatTime(notification.timestamp)}
                      </span>
                    </div>

                    <p className="text-xs text-secondary-content mb-2">
                      {notification.message}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {notification.leadId && (
                        <button
                          onClick={() => navigate(`/leads/${notification.leadId}`)}
                          className="text-xs text-primary hover:text-primary-dark font-medium"
                        >
                          View Lead
                        </button>
                      )}
                      {!notification.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-xs text-secondary-content hover:text-primary-content font-medium flex items-center gap-1"
                        >
                          <CheckCircle size={12} />
                          <span>Mark Read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-dark-hover flex items-center justify-center mx-auto mb-3">
              <Bell className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-primary-content font-medium mb-2 text-sm">No notifications</h3>
            <p className="text-secondary-content text-xs">
              You're all caught up!
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={unreadCount} />
    </div>
  );
}
