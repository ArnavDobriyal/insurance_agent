import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Edit, SkipForward, Undo2, AlertTriangle, Shield, ChevronDown, ChevronUp } from 'lucide-react';

interface QueuedAction {
  id: string;
  leadId: string;
  leadName: string;
  type: string;
  description: string;
  steps: string[];
  reasoning: string;
  confidence: number;
  difficulty: 'easy' | 'medium' | 'hard';
  complianceStatus: 'safe' | 'flagged';
  violations: any[];
  requiresApproval: boolean;
  status: 'pending' | 'applied' | 'skipped' | 'failed';
  createdAt: string;
}

interface ActivityFeedPanelProps {
  sessionId: string;
  onApply: (actionId: string, modifications?: any) => void;
  onSkip: (actionId: string, reason?: string) => void;
  onEdit: (actionId: string) => void;
}

export default function ActivityFeedPanel({
  sessionId,
  onApply,
  onSkip,
  onEdit,
}: ActivityFeedPanelProps) {
  const [actions, setActions] = useState<QueuedAction[]>([]);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const fetchQueue = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/autopilot/queue?sessionId=${sessionId}`);
        const data = await response.json();
        setActions(data.queue || []);
      } catch (error) {
        console.error('Failed to fetch queue:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  const toggleExpanded = (actionId: string) => {
    setExpandedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-semantic-success/20 text-semantic-success';
      case 'medium':
        return 'bg-semantic-warning/20 text-semantic-warning';
      case 'hard':
        return 'bg-semantic-error/20 text-semantic-error';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-semantic-success/20 text-semantic-success';
      case 'skipped':
        return 'bg-gray-500/20 text-gray-400';
      case 'failed':
        return 'bg-semantic-error/20 text-semantic-error';
      default:
        return 'bg-semantic-info/20 text-semantic-info';
    }
  };

  const pendingActions = actions.filter(a => a.status === 'pending');
  const completedActions = actions.filter(a => a.status !== 'pending');

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-semibold text-primary-content mb-1">Activity Feed</h2>
        <p className="text-sm text-secondary-content">
          {pendingActions.length} pending action{pendingActions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Pending Actions */}
            {pendingActions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-secondary-content uppercase tracking-wide">
                  Pending Actions
                </h3>
                {pendingActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-effect rounded-xl p-4 border-l-4 border-l-primary"
                  >
                    {/* Action Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-primary-content">
                            {action.leadName}
                          </h4>
                          {action.requiresApproval && (
                            <span className="px-2 py-0.5 bg-semantic-warning/20 text-semantic-warning text-xs rounded-full">
                              Approval Required
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-secondary-content">{action.description}</p>
                      </div>

                      <button
                        onClick={() => toggleExpanded(action.id)}
                        className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
                      >
                        {expandedActions.has(action.id) ? (
                          <ChevronUp size={16} className="text-secondary-content" />
                        ) : (
                          <ChevronDown size={16} className="text-secondary-content" />
                        )}
                      </button>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getDifficultyColor(action.difficulty)}`}>
                        {action.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-primary/20 text-primary rounded-md text-xs font-medium">
                        {Math.round(action.confidence)}% confidence
                      </span>
                      {action.complianceStatus === 'flagged' && (
                        <span className="px-2 py-1 bg-semantic-error/20 text-semantic-error rounded-md text-xs font-medium flex items-center gap-1">
                          <AlertTriangle size={12} />
                          Compliance Issue
                        </span>
                      )}
                      {action.complianceStatus === 'safe' && (
                        <span className="px-2 py-1 bg-semantic-success/20 text-semantic-success rounded-md text-xs font-medium flex items-center gap-1">
                          <Shield size={12} />
                          Compliant
                        </span>
                      )}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedActions.has(action.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mb-3 p-3 bg-dark-hover rounded-lg">
                            <p className="text-xs font-medium text-secondary-content mb-2">Steps:</p>
                            <ol className="list-decimal list-inside space-y-1">
                              {action.steps.map((step, i) => (
                                <li key={i} className="text-xs text-primary-content">{step}</li>
                              ))}
                            </ol>
                          </div>

                          <div className="mb-3 p-3 bg-dark-hover rounded-lg">
                            <p className="text-xs font-medium text-secondary-content mb-1">AI Reasoning:</p>
                            <p className="text-xs text-primary-content">{action.reasoning}</p>
                          </div>

                          {action.violations.length > 0 && (
                            <div className="mb-3 p-3 bg-semantic-error/10 rounded-lg border border-semantic-error/20">
                              <p className="text-xs font-medium text-semantic-error mb-2">Compliance Violations:</p>
                              <ul className="space-y-1">
                                {action.violations.map((v, i) => (
                                  <li key={i} className="text-xs text-semantic-error">
                                    • {v.phrase}: {v.rule}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApply(action.id)}
                        disabled={action.complianceStatus === 'flagged'}
                        className="flex-1 py-2 px-3 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle size={14} />
                        <span>Apply</span>
                      </button>

                      <button
                        onClick={() => onEdit(action.id)}
                        className="py-2 px-3 bg-dark-hover hover:bg-dark-border text-primary-content rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => onSkip(action.id)}
                        className="py-2 px-3 bg-dark-hover hover:bg-dark-border text-secondary-content rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <SkipForward size={14} />
                        <span>Skip</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Completed Actions */}
            {completedActions.length > 0 && (
              <div className="space-y-3 mt-6">
                <h3 className="text-sm font-medium text-secondary-content uppercase tracking-wide">
                  Completed Actions
                </h3>
                {completedActions.map((action) => (
                  <div
                    key={action.id}
                    className="glass-effect rounded-xl p-3 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-primary-content">{action.leadName}</p>
                        <p className="text-xs text-secondary-content">{action.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(action.status)}`}>
                        {action.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {actions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-secondary-content">No actions in queue</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
