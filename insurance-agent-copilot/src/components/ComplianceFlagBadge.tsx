import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, X, Info } from 'lucide-react';

interface ComplianceViolation {
  phrase: string;
  rule: string;
  severity: 'error' | 'warning';
  suggestion: string;
}

interface ComplianceFlagBadgeProps {
  violations: ComplianceViolation[];
  onViewDetails: () => void;
}

export default function ComplianceFlagBadge({ violations, onViewDetails }: ComplianceFlagBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (violations.length === 0) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-semantic-success/20 rounded-full">
        <Shield size={12} className="text-semantic-success" />
        <span className="text-[10px] font-medium text-semantic-success">IRDAI Safe</span>
      </div>
    );
  }

  const errorCount = violations.filter(v => v.severity === 'error').length;
  const warningCount = violations.filter(v => v.severity === 'warning').length;
  const hasErrors = errorCount > 0;

  return (
    <>
      {/* Badge */}
      <div className="relative inline-block">
        <button
          onClick={() => setShowModal(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`
            inline-flex items-center gap-1.5 px-2 py-1 rounded-full transition-all
            ${hasErrors
              ? 'bg-semantic-error/20 hover:bg-semantic-error/30'
              : 'bg-semantic-warning/20 hover:bg-semantic-warning/30'
            }
          `}
        >
          <AlertTriangle
            size={12}
            className={hasErrors ? 'text-semantic-error' : 'text-semantic-warning'}
          />
          <span className={`text-[10px] font-medium ${hasErrors ? 'text-semantic-error' : 'text-semantic-warning'}`}>
            {errorCount > 0 && `${errorCount} Error${errorCount > 1 ? 's' : ''}`}
            {errorCount > 0 && warningCount > 0 && ', '}
            {warningCount > 0 && `${warningCount} Warning${warningCount > 1 ? 's' : ''}`}
          </span>
        </button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none"
            >
              <div className="glass-effect rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                <p className="text-xs text-primary-content font-medium mb-1">
                  IRDAI Compliance Issues
                </p>
                <p className="text-[10px] text-secondary-content">
                  Click to view details and suggestions
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-effect rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${hasErrors ? 'bg-semantic-error/20' : 'bg-semantic-warning/20'}
                  `}>
                    <AlertTriangle
                      className={hasErrors ? 'text-semantic-error' : 'text-semantic-warning'}
                      size={20}
                    />
                  </div>
                  <div>
                    <h3 className="text-primary-content font-semibold">Compliance Issues</h3>
                    <p className="text-xs text-secondary-content">IRDAI Validation Results</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-secondary-content" />
                </button>
              </div>

              {/* Violations List */}
              <div className="space-y-3">
                {violations.map((violation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      border rounded-lg p-3
                      ${violation.severity === 'error'
                        ? 'border-semantic-error/30 bg-semantic-error/5'
                        : 'border-semantic-warning/30 bg-semantic-warning/5'
                      }
                    `}
                  >
                    {/* Severity Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`
                        px-2 py-0.5 rounded-full text-[10px] font-semibold
                        ${violation.severity === 'error'
                          ? 'bg-semantic-error/20 text-semantic-error'
                          : 'bg-semantic-warning/20 text-semantic-warning'
                        }
                      `}>
                        {violation.severity.toUpperCase()}
                      </span>
                    </div>

                    {/* Flagged Phrase */}
                    <div className="mb-2">
                      <div className="text-[10px] text-secondary-content mb-1">Flagged phrase:</div>
                      <p className="text-xs font-medium text-primary-content bg-dark-hover px-2 py-1 rounded">
                        "{violation.phrase}"
                      </p>
                    </div>

                    {/* Rule */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Info size={10} className="text-primary" />
                        <span className="text-[10px] text-secondary-content">IRDAI Rule:</span>
                      </div>
                      <p className="text-xs text-secondary-content">{violation.rule}</p>
                    </div>

                    {/* Suggestion */}
                    <div className="dark:bg-dark-hover light:bg-gray-100 rounded-lg p-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Shield size={10} className="text-semantic-success" />
                        <span className="text-[10px] font-medium text-semantic-success">Safe Alternative:</span>
                      </div>
                      <p className="text-xs text-secondary-content">{violation.suggestion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-dark-border">
                <div className="flex items-start gap-2 p-2 dark:bg-dark-hover light:bg-gray-100 rounded-lg">
                  <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-secondary-content">
                    All AI-generated content is validated against IRDAI guidelines to ensure compliance.
                    Please review and use suggested alternatives.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
