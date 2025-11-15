import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import NextBestActionCard from './NextBestActionCard';
import ObjectionPredictorPanel from './ObjectionPredictorPanel';
import TemplatesPanel from './TemplatesPanel';
import ComplianceFlagBadge from './ComplianceFlagBadge';

interface ContextSection {
  type: 'nextAction' | 'objections' | 'templates' | 'compliance' | 'documents';
  data: any;
  isLoading: boolean;
}

interface SmartContextPanelProps {
  leadId: string;
  sections: ContextSection[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SmartContextPanel({ leadId, sections, isOpen = true, onClose }: SmartContextPanelProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sectionTitles = {
    nextAction: 'Next Best Action',
    objections: 'Objections',
    templates: 'Templates',
    compliance: 'Compliance',
    documents: 'Documents',
  };

  const currentSection = sections[activeSection];

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile: Full Screen Overlay */}
      <div className="lg:hidden">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-page"
            >
              {/* Header */}
              <div className="glass-effect border-b border-dark-border px-4 py-3 flex items-center justify-between">
                <h2 className="text-primary-content font-semibold text-sm">AI Insights</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-dark-hover flex items-center justify-center transition-colors"
                >
                  <X size={16} className="text-secondary-content" />
                </button>
              </div>

              {/* Section Tabs */}
              <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-dark-border scrollbar-hide">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`
                      px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                      ${activeSection === index
                        ? 'bg-primary text-white'
                        : 'glass-effect text-secondary-content hover:border-primary/50'
                      }
                    `}
                  >
                    {sectionTitles[section.type]}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 pb-24">
                {currentSection && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderSection(currentSection)}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              {/* Navigation */}
              {sections.length > 1 && (
                <div className="glass-effect border-t border-dark-border px-4 py-3 flex items-center justify-between">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-hover transition-colors"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>
                  <span className="text-xs text-secondary-content">
                    {activeSection + 1} / {sections.length}
                  </span>
                  <button
                    onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                    disabled={activeSection === sections.length - 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-hover transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop: Side Panel */}
      <div className="hidden lg:block">
        <motion.div
          initial={{ x: 300 }}
          animate={{ x: isCollapsed ? 280 : 0 }}
          className="fixed right-0 top-0 bottom-0 w-80 glass-effect border-l border-dark-border overflow-hidden"
        >
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full w-8 h-16 glass-effect rounded-l-lg border border-r-0 border-dark-border flex items-center justify-center hover:bg-dark-hover transition-colors"
          >
            {isCollapsed ? (
              <ChevronLeft size={16} className="text-secondary-content" />
            ) : (
              <ChevronRight size={16} className="text-secondary-content" />
            )}
          </button>

          {!isCollapsed && (
            <>
              {/* Header */}
              <div className="px-4 py-3 border-b border-dark-border">
                <h2 className="text-primary-content font-semibold text-sm">AI Insights</h2>
                <p className="text-[10px] text-secondary-content">Context-aware suggestions</p>
              </div>

              {/* Section Tabs */}
              <div className="flex flex-col gap-1 p-2 border-b border-dark-border">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium text-left transition-all
                      ${activeSection === index
                        ? 'bg-primary text-white'
                        : 'text-secondary-content hover:bg-dark-hover'
                      }
                    `}
                  >
                    {sectionTitles[section.type]}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {currentSection && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderSection(currentSection)}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}

function renderSection(section: ContextSection) {
  if (section.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  switch (section.type) {
    case 'nextAction':
      return (
        <NextBestActionCard
          action={section.data}
          onExecute={() => console.log('Execute action')}
        />
      );
    case 'objections':
      return (
        <ObjectionPredictorPanel
          objections={section.data}
          onSelectObjection={(id) => console.log('Selected objection:', id)}
        />
      );
    case 'templates':
      return (
        <TemplatesPanel
          templates={section.data.templates}
          leadData={section.data.leadData}
          onSelectTemplate={(id) => console.log('Selected template:', id)}
        />
      );
    case 'compliance':
      return (
        <div className="space-y-3">
          <h4 className="text-primary-content font-medium text-sm">Compliance Status</h4>
          <ComplianceFlagBadge
            violations={section.data}
            onViewDetails={() => console.log('View compliance details')}
          />
        </div>
      );
    default:
      return (
        <div className="text-center py-8 text-secondary-content text-xs">
          No data available
        </div>
      );
  }
}
