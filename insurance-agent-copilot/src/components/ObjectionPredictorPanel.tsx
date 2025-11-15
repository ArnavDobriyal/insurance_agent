import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, Shield } from 'lucide-react';

interface PredictedObjection {
  id: string;
  text: string;
  probability: number;
  safeResponse: string;
  signals: string[];
}

interface ObjectionPredictorPanelProps {
  objections: PredictedObjection[];
  onSelectObjection: (id: string) => void;
}

export default function ObjectionPredictorPanel({ objections, onSelectObjection }: ObjectionPredictorPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleObjection = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    onSelectObjection(id);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-semantic-error';
    if (probability >= 40) return 'text-semantic-warning';
    return 'text-semantic-info';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 70) return 'bg-semantic-error/20';
    if (probability >= 40) return 'bg-semantic-warning/20';
    return 'bg-semantic-info/20';
  };

  return (
    <div className="glass-effect rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-semantic-warning/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-semantic-warning" />
        </div>
        <div>
          <h3 className="text-primary-content font-semibold text-sm">Objection Predictor</h3>
          <p className="text-[10px] text-secondary-content">IRDAI-Compliant Responses</p>
        </div>
      </div>

      {/* Objections List */}
      <div className="space-y-2">
        {objections.map((objection, index) => (
          <motion.div
            key={objection.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-dark-border rounded-lg overflow-hidden"
          >
            {/* Objection Header */}
            <button
              onClick={() => toggleObjection(objection.id)}
              className="w-full p-3 hover:bg-dark-hover transition-colors text-left"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getProbabilityBg(objection.probability)} ${getProbabilityColor(objection.probability)}`}>
                      {objection.probability}%
                    </span>
                    <span className="text-[10px] text-secondary-content">Likelihood</span>
                  </div>
                  <p className="text-xs text-primary-content font-medium line-clamp-2">
                    "{objection.text}"
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {expandedId === objection.id ? (
                    <ChevronUp size={16} className="text-secondary-content" />
                  ) : (
                    <ChevronDown size={16} className="text-secondary-content" />
                  )}
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedId === objection.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 pt-0 space-y-3">
                    {/* Safe Response */}
                    <div className="dark:bg-dark-hover light:bg-gray-100 rounded-lg p-2.5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Shield size={12} className="text-semantic-success" />
                        <span className="text-[10px] font-medium text-semantic-success">IRDAI-Safe Response</span>
                      </div>
                      <p className="text-xs text-secondary-content leading-relaxed">
                        {objection.safeResponse}
                      </p>
                    </div>

                    {/* Signals */}
                    {objection.signals && objection.signals.length > 0 && (
                      <div>
                        <div className="text-[10px] text-secondary-content mb-1.5">Predicted from:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {objection.signals.map((signal, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-md text-[10px] text-secondary-content"
                            >
                              {signal}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy Button */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(objection.safeResponse);
                      }}
                      className="w-full py-2 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      Copy Response
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {objections.length === 0 && (
        <div className="text-center py-6">
          <AlertTriangle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-xs text-secondary-content">No objections predicted</p>
        </div>
      )}
    </div>
  );
}
