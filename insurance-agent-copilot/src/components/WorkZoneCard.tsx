import { motion } from 'framer-motion';
import { Flame, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface WorkZoneCardProps {
  title: string;
  count: number;
  icon: 'hot' | 'renewal' | 'followup' | 'task';
  onClick: () => void;
}

const iconMap = {
  hot: { Icon: Flame, color: 'text-semantic-error', bg: 'bg-semantic-error/10' },
  renewal: { Icon: TrendingUp, color: 'text-semantic-success', bg: 'bg-semantic-success/10' },
  followup: { Icon: Clock, color: 'text-semantic-warning', bg: 'bg-semantic-warning/10' },
  task: { Icon: AlertCircle, color: 'text-semantic-info', bg: 'bg-semantic-info/10' },
};

export default function WorkZoneCard({ title, count, icon, onClick }: WorkZoneCardProps) {
  const { Icon, color, bg } = iconMap[icon];

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex-shrink-0 w-40 glass-effect rounded-2xl p-4 cursor-pointer hover:border-primary/50 transition-all"
    >
      <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      
      <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{count}</p>
    </motion.div>
  );
}
