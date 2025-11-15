import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, X, Zap } from 'lucide-react';

interface AutoPilotMiniPanelProps {
  sessionId: string;
  onPause: () => void;
  onResume: () => void;
  onAbort: () => void;
}

interface SessionStatus {
  status: 'running' | 'paused' | 'aborted';
  currentIndex: number;
  queueSize: number;
  pendingActions: number;
  stats: {
    actionsProcessed: number;
    actionsApplied: number;
    actionsSkipped: number;
  };
}

export default function AutoPilotMiniPanel({
  sessionId,
  onPause,
  onResume,
  onAbort,
}: AutoPilotMiniPanelProps) {
  const [status, setStatus] = useState<SessionStatus | null>(null);
  const [currentLead, setCurrentLead] = useState('');
  const [nextAction, setNextAction] = useState('');

  useEffect(() => {
    if (!sessionId) return;

    // Fetch status
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/autopilot/status?sessionId=${sessionId}`);
        const data = await response.json();
        setStatus(data);

        // Fetch queue to get current action
        const queueResponse = await fetch(`/api/autopilot/queue?sessionId=${sessionId}`);
        const queueData = await queueResponse.json();
        
        if (queueData.queue && queueData.queue.length > 0) {
          const currentAction = queueData.queue.find((a: any) => a.status === 'pending');
          if (currentAction) {
            setCurrentLead(currentAction.leadName);
            setNextAction(currentAction.description);
          }
        }
      } catch (error) {
        console.error('Failed to fetch AutoPilot status:', error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);

    return () => clearInterval(interval);
  }, [sessionId]);

  if (!status) return null;

  const progress = status.queueSize > 0 
    ? (status.stats.actionsProcessed / status.queueSize) * 100 
    : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-0 right-0 mx-4 md:left-auto md:right-4 md:w-96 z-50"
    >
      <div className="glass-effect rounded-2xl p-4 border-l-4 border-l-primary shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-primary-content">AutoPilot Active</h3>
              <p className="text-xs text-secondary-content">
                {status.stats.actionsProcessed} of {status.queueSize} actions
              </p>
            </div>
          </div>

          <button
            onClick={onAbort}
            className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-secondary-content" />
          </button>
        </div>

        {/* Current Lead */}
        {currentLead && (
          <div className="mb-3">
            <p className="text-xs text-secondary-content mb-1">Current Lead</p>
            <p className="text-sm font-medium text-primary-content">{currentLead}</p>
          </div>
        )}

        {/* Next Action */}
        {nextAction && (
          <div className="mb-3">
            <p className="text-xs text-secondary-content mb-1">Next Action</p>
            <p className="text-sm text-primary-content line-clamp-2">{nextAction}</p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="w-full h-2 bg-dark-hover rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-secondary-content mt-1 text-right">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {status.status === 'running' ? (
            <button
              onClick={onPause}
              className="flex-1 py-2 px-4 bg-dark-hover hover:bg-dark-border rounded-xl text-sm font-medium text-primary-content transition-colors flex items-center justify-center gap-2"
            >
              <Pause size={16} />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={onResume}
              className="flex-1 py-2 px-4 bg-primary hover:bg-primary-dark rounded-xl text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              <Play size={16} />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={onAbort}
            className="px-4 py-2 text-sm font-medium text-semantic-error hover:bg-semantic-error/10 rounded-xl transition-colors"
          >
            Abort
          </button>
        </div>

        {/* Stats */}
        <div className="mt-3 pt-3 border-t border-dark-border grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-semantic-success">
              {status.stats.actionsApplied}
            </div>
            <div className="text-xs text-secondary-content">Applied</div>
          </div>
          <div>
            <div className="text-lg font-bold text-semantic-warning">
              {status.stats.actionsSkipped}
            </div>
            <div className="text-xs text-secondary-content">Skipped</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {status.pendingActions}
            </div>
            <div className="text-xs text-secondary-content">Pending</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
