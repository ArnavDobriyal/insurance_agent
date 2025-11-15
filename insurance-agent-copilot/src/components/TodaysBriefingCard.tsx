import { motion } from 'framer-motion';
import { BriefingItem } from '../types/models';

interface TodaysBriefingCardProps {
  summary: string[];
  urgentItems: BriefingItem[];
  isLoading: boolean;
}

export default function TodaysBriefingCard({ summary, urgentItems, isLoading }: TodaysBriefingCardProps) {
  if (isLoading) {
    return (
      <div className="bg-neutral-card rounded-card shadow-visionos p-6 animate-pulse">
        <div className="h-8 bg-neutral-bg rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-neutral-bg rounded"></div>
          <div className="h-4 bg-neutral-bg rounded w-5/6"></div>
          <div className="h-4 bg-neutral-bg rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-card rounded-card shadow-visionos p-6"
    >
      <h2 className="text-2xl font-heading text-neutral-heading mb-4">
        📌 Today's Summary
      </h2>

      {/* Summary Points */}
      <ul className="space-y-3 mb-6">
        {summary.map((item, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-2 text-neutral-body"
          >
            <span className="text-primary mt-1">•</span>
            <span>{item}</span>
          </motion.li>
        ))}
      </ul>

      {/* Urgent Items */}
      {urgentItems.length > 0 && (
        <div className="border-t border-neutral-bg pt-4">
          <h3 className="text-sm font-subhead text-neutral-heading mb-3">
            🔥 Urgent Actions
          </h3>
          <div className="space-y-2">
            {urgentItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={item.action}
                whileHover={{ x: 4 }}
                className={`
                  w-full text-left px-4 py-3 rounded-button transition-colors
                  ${item.priority === 'high' 
                    ? 'bg-semantic-error/10 text-semantic-error hover:bg-semantic-error/20' 
                    : item.priority === 'medium'
                    ? 'bg-semantic-warning/10 text-semantic-warning hover:bg-semantic-warning/20'
                    : 'bg-semantic-info/10 text-semantic-info hover:bg-semantic-info/20'
                  }
                `}
              >
                {item.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
