import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ConversionGaugeProps {
  probability: number; // 0 to 100
  confidence: number; // 0 to 100
}

export default function ConversionGauge({ probability, confidence }: ConversionGaugeProps) {
  const getColor = (value: number) => {
    if (value >= 70) return '#10B981'; // Green
    if (value >= 40) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getLabel = (value: number) => {
    if (value >= 70) return 'High';
    if (value >= 40) return 'Medium';
    return 'Low';
  };

  // Calculate arc path for semi-circle gauge
  const radius = 80;
  const strokeWidth = 12;
  const center = 100;
  const circumference = Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  return (
    <div className="glass-effect rounded-xl p-6">
      <h3 className="text-white font-medium mb-6">Conversion Probability</h3>

      {/* Gauge */}
      <div className="relative flex items-center justify-center mb-6">
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#1F2937"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated progress arc */}
          <motion.path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke={getColor(probability)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          {/* Glow effect */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="text-center"
          >
            <div className="text-4xl font-bold mb-1" style={{ color: getColor(probability) }}>
              {probability}%
            </div>
            <div className="text-sm text-gray-400">
              {getLabel(probability)} Probability
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="glass-effect rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-xs text-gray-400">Confidence</span>
          </div>
          <div className="text-lg font-semibold text-white">
            {confidence}%
          </div>
        </div>

        <div className="glass-effect rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-1">Status</div>
          <div className="text-lg font-semibold" style={{ color: getColor(probability) }}>
            {getLabel(probability)}
          </div>
        </div>
      </div>

      {/* Progress bar for confidence */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">AI Confidence Level</span>
          <span className="text-gray-300">{confidence}%</span>
        </div>
        <div className="h-2 bg-dark-hover rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary-dark"
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="text-xs text-gray-400 mb-2">Key Factors</div>
        <div className="space-y-1">
          {probability >= 70 && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-success"></div>
                <span>Strong engagement history</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-success"></div>
                <span>Positive sentiment trend</span>
              </div>
            </>
          )}
          {probability >= 40 && probability < 70 && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-warning"></div>
                <span>Moderate engagement</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-warning"></div>
                <span>Needs follow-up</span>
              </div>
            </>
          )}
          {probability < 40 && (
            <>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-error"></div>
                <span>Low engagement</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <div className="w-1.5 h-1.5 rounded-full bg-semantic-error"></div>
                <span>Requires nurturing</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
