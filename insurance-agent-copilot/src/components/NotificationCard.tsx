import { motion } from 'framer-motion';
import { Bell, Clock, AlertTriangle, Phone, CheckCircle } from 'lucide-react';

interface NotificationCardProps {
  id: string;
  type: 'renewal' | 'followup' | 'compliance' | 'missed-call';
  title: string;
  message: string;
  leadId?: string;
  leadName?: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  onMarkAsRead: (id: string) => void;
  onViewLead?: (leadId: string) => void;
}

export default function NotificationCard({
  id,
  type,
  title,
  message,
  leadId,
  timestamp,
  isRead,
  onMarkAsRead,
  onViewLead,
}: NotificationCardProps) {
  const getTypeIcon = () => {
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

  const getTypeColor = () => {
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

  const formatTime = () => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        glass-effect rounded-xl p-4 transition-all
        ${!isRead ? 'border-l-4 border-l-primary' : ''}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor()}`}>
          {getTypeIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-medium text-primary-content">
              {title}
            </h3>
            <span className="text-[10px] text-secondary-content whitespace-nowrap">
              {formatTime()}
            </span>
          </div>

          <p className="text-xs text-secondary-content mb-2">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {leadId && onViewLead && (
              <button
                onClick={() => onViewLead(leadId)}
                className="text-xs text-primary hover:text-primary-dark font-medium"
              >
                View Lead
              </button>
            )}
            {!isRead && (
              <button
                onClick={() => onMarkAsRead(id)}
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
  );
}
