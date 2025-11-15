import { motion } from 'framer-motion';
import { Zap, CheckCircle, AlertCircle } from 'lucide-react';

interface NextBestAction {
  id: string;
  title: string;
  steps: string[];
  reasoning: string;
  confidence: number;
  difficulty: 'easy' | 'medium' | 'hard';
  signals: string[];
}

interface NextBestActionCardProps {
  action: NextBestAction;
  onExecute: () => void;
}

export default function NextBestActionCard({ action, onExecute }: NextBestActionCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-semantic-success';
      case 'medium':
        return 'text-semantic-warning';
      case 'hard':
        return 'text-semantic-error';
      default:
        return 'text-gray-400';
    }
  };

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-semantic-success/20';
      case 'medium':
        return 'bg-semantic-warning/20';
      case 'hard':
        return 'bg-semantic-error/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-xl p-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-primary-content font-semibold text-sm">Next Best Action</h3>
            <p className="text-[10px] text-secondary-content">AI Recommended</p>
          </div>
        </div>
        
        {/* Confidence Badge */}
        <div className="flex items-center gap-1.5">
          <div className="text-right">
            <div className="text-xs font-semibold text-primary">{action.confidence}%</div>
            <div className="text-[10px] text-secondary-content">Confidence</div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-3">
        <h4 className="text-primary-content font-medium text-sm mb-1">{action.title}</h4>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getDifficultyBg(action.difficulty)} ${getDifficultyColor(action.difficulty)}`}>
            {action.difficulty.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-3">
        <div className="text-[10px] text-secondary-content mb-2 font-medium">Action Steps:</div>
        <div className="space-y-1.5">
          {action.steps.map((step, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold
                ${getDifficultyBg(action.difficulty)} ${getDifficultyColor(action.difficulty)}
              `}>
                {index + 1}
              </div>
              <p className="text-xs text-secondary-content flex-1 leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-3 p-2.5 dark:bg-dark-hover light:bg-gray-100 rounded-lg">
        <div className="flex items-center gap-1.5 mb-1.5">
          <AlertCircle size={12} className="text-primary" />
          <span className="text-[10px] font-medium text-primary-content">Why this action?</span>
        </div>
        <p className="text-xs text-secondary-content leading-relaxed">{action.reasoning}</p>
      </div>

      {/* Signals */}
      {action.signals && action.signals.length > 0 && (
        <div className="mb-3">
          <div className="text-[10px] text-secondary-content mb-1.5">Based on:</div>
          <div className="flex flex-wrap gap-1.5">
            {action.signals.map((signal, index) => (
              <span
                key={index}
                className="px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-md text-[10px] text-secondary-content"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Execute Button */}
      <button
        onClick={onExecute}
        className="w-full bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <CheckCircle size={16} />
        <span>Execute Action</span>
      </button>
    </motion.div>
  );
}
