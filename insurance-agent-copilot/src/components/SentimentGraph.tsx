import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentDataPoint {
  date: string;
  score: number; // -1 to 1
  label: string;
}

interface SentimentGraphProps {
  dataPoints: SentimentDataPoint[];
}

export default function SentimentGraph({ dataPoints }: SentimentGraphProps) {
  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="glass-effect rounded-xl p-6">
        <h3 className="text-white font-medium mb-4">Sentiment Timeline</h3>
        <div className="text-center py-8 text-gray-400">
          No sentiment data available
        </div>
      </div>
    );
  }

  // Normalize scores to 0-100 range for display
  const normalizedPoints = dataPoints.map(point => ({
    ...point,
    normalizedScore: ((point.score + 1) / 2) * 100, // Convert -1 to 1 range to 0-100
  }));

  const maxScore = Math.max(...normalizedPoints.map(p => p.normalizedScore));
  const minScore = Math.min(...normalizedPoints.map(p => p.normalizedScore));
  const avgScore = normalizedPoints.reduce((sum, p) => sum + p.normalizedScore, 0) / normalizedPoints.length;

  const getTrend = () => {
    if (normalizedPoints.length < 2) return 'neutral';
    const first = normalizedPoints[0].normalizedScore;
    const last = normalizedPoints[normalizedPoints.length - 1].normalizedScore;
    const diff = last - first;
    if (diff > 5) return 'up';
    if (diff < -5) return 'down';
    return 'neutral';
  };

  const trend = getTrend();

  const getSentimentColor = (score: number) => {
    if (score >= 70) return '#10B981'; // Green
    if (score >= 40) return '#F59E0B'; // Orange
    return '#EF4444'; // Red
  };

  const getSentimentLabel = (score: number) => {
    if (score >= 70) return 'Positive';
    if (score >= 40) return 'Neutral';
    return 'Negative';
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-medium">Sentiment Timeline</h3>
        <div className="flex items-center gap-2">
          {trend === 'up' && <TrendingUp className="w-4 h-4 text-semantic-success" />}
          {trend === 'down' && <TrendingDown className="w-4 h-4 text-semantic-error" />}
          {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-400" />}
          <span className={`text-sm font-medium ${
            trend === 'up' ? 'text-semantic-success' :
            trend === 'down' ? 'text-semantic-error' :
            'text-gray-400'
          }`}>
            {trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="relative h-48 mb-6">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 pr-2">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* Graph area */}
        <div className="ml-8 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-dark-border"></div>
            <div className="border-t border-dark-border"></div>
            <div className="border-t border-dark-border"></div>
          </div>

          {/* Line and points */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {/* Line path */}
            <motion.path
              d={normalizedPoints.map((point, index) => {
                const x = (index / (normalizedPoints.length - 1)) * 100;
                const y = 100 - point.normalizedScore;
                return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ')}
              fill="none"
              stroke="#2196F3"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            />

            {/* Area fill */}
            <motion.path
              d={`
                ${normalizedPoints.map((point, index) => {
                  const x = (index / (normalizedPoints.length - 1)) * 100;
                  const y = 100 - point.normalizedScore;
                  return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
                }).join(' ')}
                L 100% 100%
                L 0% 100%
                Z
              `}
              fill="url(#sentimentGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 1, delay: 0.5 }}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="sentimentGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2196F3" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#2196F3" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Data points */}
          {normalizedPoints.map((point, index) => {
            const x = (index / (normalizedPoints.length - 1)) * 100;
            const y = 100 - point.normalizedScore;

            return (
              <motion.div
                key={index}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="absolute group"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-3 h-3 rounded-full bg-semantic-info border-2 border-dark-bg cursor-pointer hover:scale-150 transition-transform" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                    <div className="text-xs text-gray-400 mb-1">{point.label}</div>
                    <div className="text-sm font-medium" style={{ color: getSentimentColor(point.normalizedScore) }}>
                      {getSentimentLabel(point.normalizedScore)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {Math.round(point.normalizedScore)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Average</div>
          <div className="text-lg font-semibold" style={{ color: getSentimentColor(avgScore) }}>
            {Math.round(avgScore)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Highest</div>
          <div className="text-lg font-semibold text-semantic-success">
            {Math.round(maxScore)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Lowest</div>
          <div className="text-lg font-semibold text-semantic-error">
            {Math.round(minScore)}
          </div>
        </div>
      </div>
    </div>
  );
}
