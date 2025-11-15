import { motion } from 'framer-motion';
import { User, MapPin, Tag } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  age: number;
  location: string;
  tags: string[];
  temperature: 'hot' | 'warm' | 'cold';
  lastInteractionSummary: string;
  lastInteractionDate: string;
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot':
        return 'bg-semantic-error/20 text-semantic-error border-semantic-error/30';
      case 'warm':
        return 'bg-semantic-warning/20 text-semantic-warning border-semantic-warning/30';
      case 'cold':
        return 'bg-semantic-info/20 text-semantic-info border-semantic-info/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '☀️';
      case 'cold':
        return '❄️';
      default:
        return '•';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-effect rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-primary-content font-semibold text-base truncate">
                {lead.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-secondary-content mt-1">
                <span>{lead.age} years</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span className="truncate">{lead.location}</span>
                </div>
              </div>
            </div>

            {/* Temperature Badge */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 flex-shrink-0
              ${getTemperatureColor(lead.temperature)}
            `}>
              <span>{getTemperatureIcon(lead.temperature)}</span>
              <span className="capitalize">{lead.temperature}</span>
            </div>
          </div>

          {/* Last Interaction */}
          <p className="text-xs text-secondary-content line-clamp-2 mb-2">
            {lead.lastInteractionSummary}
          </p>

          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              <Tag size={12} className="text-secondary-content" />
              {lead.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-md text-[10px] text-secondary-content"
                >
                  {tag}
                </span>
              ))}
              {lead.tags.length > 2 && (
                <span className="text-[10px] text-secondary-content">
                  +{lead.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-2 border-t border-dark-border">
            <span>Last: {formatDate(lead.lastInteractionDate)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
