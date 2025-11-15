import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Filter, Download, ChevronDown, ChevronUp, Calendar, User, Activity } from 'lucide-react';

interface AuditEntry {
  id: string;
  userId: string;
  actionType: string;
  entityType: string;
  entityId: string;
  changes: any;
  source: 'manual' | 'autopilot' | 'ai';
  aiConfidence: number | null;
  aiReasoning: string | null;
  userDecision: 'applied' | 'edited' | 'skipped';
  complianceStatus: 'safe' | 'flagged';
  createdAt: string;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditEntry[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    dateRange: 'all',
    agent: 'all',
    actionType: 'all',
    complianceStatus: 'all',
    source: 'all',
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [logs, filters]);

  const fetchAuditLogs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/autopilot/audit');
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...logs];

    if (filters.agent !== 'all') {
      filtered = filtered.filter(log => log.userId === filters.agent);
    }

    if (filters.actionType !== 'all') {
      filtered = filtered.filter(log => log.actionType === filters.actionType);
    }

    if (filters.complianceStatus !== 'all') {
      filtered = filtered.filter(log => log.complianceStatus === filters.complianceStatus);
    }

    if (filters.source !== 'all') {
      filtered = filtered.filter(log => log.source === filters.source);
    }

    if (filters.dateRange !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoff.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoff.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoff.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(log => new Date(log.createdAt) >= cutoff);
    }

    setFilteredLogs(filtered);
  };

  const toggleExpanded = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const exportToCSV = () => {
    const headers = ['Date', 'User', 'Action', 'Entity', 'Source', 'Decision', 'Compliance', 'Confidence'];
    const rows = filteredLogs.map(log => [
      new Date(log.createdAt).toLocaleString(),
      log.userId,
      log.actionType,
      `${log.entityType}:${log.entityId}`,
      log.source,
      log.userDecision,
      log.complianceStatus,
      log.aiConfidence ? `${log.aiConfidence}%` : 'N/A',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'autopilot':
        return 'bg-primary/20 text-primary';
      case 'ai':
        return 'bg-semantic-info/20 text-semantic-info';
      case 'manual':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getComplianceColor = (status: string) => {
    return status === 'safe'
      ? 'bg-semantic-success/20 text-semantic-success'
      : 'bg-semantic-error/20 text-semantic-error';
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'applied':
        return 'bg-semantic-success/20 text-semantic-success';
      case 'edited':
        return 'bg-semantic-warning/20 text-semantic-warning';
      case 'skipped':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-dark-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-content">Audit Trail</h1>
              <p className="text-sm text-secondary-content">
                {filteredLogs.length} of {logs.length} entries
              </p>
            </div>
          </div>

          <button
            onClick={exportToCSV}
            className="py-2 px-4 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-secondary-content" />
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-3 py-2 bg-dark-hover rounded-lg text-sm text-primary-content border border-dark-border focus:border-primary outline-none"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>

          {/* Action Type */}
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-secondary-content" />
            <select
              value={filters.actionType}
              onChange={(e) => setFilters(prev => ({ ...prev, actionType: e.target.value }))}
              className="px-3 py-2 bg-dark-hover rounded-lg text-sm text-primary-content border border-dark-border focus:border-primary outline-none"
            >
              <option value="all">All Actions</option>
              <option value="update_lead">Update Lead</option>
              <option value="create_lead">Create Lead</option>
              <option value="send_message">Send Message</option>
            </select>
          </div>

          {/* Source */}
          <select
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
            className="px-3 py-2 bg-dark-hover rounded-lg text-sm text-primary-content border border-dark-border focus:border-primary outline-none"
          >
            <option value="all">All Sources</option>
            <option value="manual">Manual</option>
            <option value="autopilot">AutoPilot</option>
            <option value="ai">AI</option>
          </select>

          {/* Compliance Status */}
          <select
            value={filters.complianceStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, complianceStatus: e.target.value }))}
            className="px-3 py-2 bg-dark-hover rounded-lg text-sm text-primary-content border border-dark-border focus:border-primary outline-none"
          >
            <option value="all">All Compliance</option>
            <option value="safe">Safe</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length > 0 ? (
          <div className="space-y-3">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="glass-effect rounded-xl p-4"
              >
                {/* Log Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-primary-content capitalize">
                        {log.actionType.replace('_', ' ')}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSourceColor(log.source)}`}>
                        {log.source}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(log.complianceStatus)}`}>
                        {log.complianceStatus}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDecisionColor(log.userDecision)}`}>
                        {log.userDecision}
                      </span>
                    </div>
                    <p className="text-xs text-secondary-content">
                      {new Date(log.createdAt).toLocaleString()} • User: {log.userId} • Entity: {log.entityType}:{log.entityId}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleExpanded(log.id)}
                    className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
                  >
                    {expandedLogs.has(log.id) ? (
                      <ChevronUp size={16} className="text-secondary-content" />
                    ) : (
                      <ChevronDown size={16} className="text-secondary-content" />
                    )}
                  </button>
                </div>

                {/* Expanded Details */}
                {expandedLogs.has(log.id) && (
                  <div className="space-y-3 pt-3 border-t border-dark-border">
                    {/* Changes */}
                    <div className="p-3 bg-dark-hover rounded-lg">
                      <p className="text-xs font-medium text-secondary-content mb-2">Changes:</p>
                      <pre className="text-xs text-primary-content overflow-x-auto">
                        {JSON.stringify(log.changes, null, 2)}
                      </pre>
                    </div>

                    {/* AI Reasoning */}
                    {log.aiReasoning && (
                      <div className="p-3 bg-dark-hover rounded-lg">
                        <p className="text-xs font-medium text-secondary-content mb-1">AI Reasoning:</p>
                        <p className="text-xs text-primary-content">{log.aiReasoning}</p>
                        {log.aiConfidence && (
                          <p className="text-xs text-secondary-content mt-1">
                            Confidence: {log.aiConfidence}%
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-primary-content mb-2">No audit logs found</h3>
            <p className="text-sm text-secondary-content">
              Try adjusting your filters or check back later
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
