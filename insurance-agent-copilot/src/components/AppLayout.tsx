import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NavigationRail from './NavigationRail';
import CommandBar from './CommandBar';
import { CommandSuggestion } from '../types/models';

interface AppLayoutProps {
  children: ReactNode;
  showContextPanel?: boolean;
  contextPanel?: ReactNode;
}

export default function AppLayout({ children, showContextPanel = false, contextPanel }: AppLayoutProps) {
  const [notificationCount] = useState(3);
  const [isCommandLoading, setIsCommandLoading] = useState(false);

  // Mock command suggestions
  const commandSuggestions: CommandSuggestion[] = [
    {
      id: '1',
      text: 'Go to Hot Leads',
      icon: '🔥',
      action: () => console.log('Navigate to hot leads'),
      category: 'navigation',
    },
    {
      id: '2',
      text: 'Create New Lead',
      icon: '➕',
      action: () => console.log('Create lead'),
      category: 'action',
    },
    {
      id: '3',
      text: 'Search Priya Sharma',
      icon: '🔍',
      action: () => console.log('Search lead'),
      category: 'search',
    },
    {
      id: '4',
      text: 'Summarize Today',
      icon: '📊',
      action: () => console.log('Summarize'),
      category: 'action',
    },
  ];

  const handleCommand = async (command: string) => {
    setIsCommandLoading(true);
    console.log('Command:', command);
    // TODO: Send to AI intent endpoint
    setTimeout(() => setIsCommandLoading(false), 1000);
  };

  const handleNavigate = (route: string) => {
    console.log('Navigate to:', route);
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Navigation Rail */}
      <NavigationRail
        activeRoute="/"
        notificationCount={notificationCount}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div className="ml-20 min-h-screen flex flex-col">
        {/* Command Bar Header */}
        <header className="sticky top-0 z-30 bg-neutral-bg/80 backdrop-blur-lg border-b border-neutral-bg">
          <div className="px-8 py-4 flex items-center justify-center">
            <CommandBar
              onCommand={handleCommand}
              suggestions={commandSuggestions}
              isLoading={isCommandLoading}
            />
          </div>
        </header>

        {/* Content with Optional Context Panel */}
        <div className="flex-1 flex">
          {/* Main Content */}
          <motion.main
            className={`flex-1 ${showContextPanel ? 'mr-96' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26 }}
          >
            <div className="p-8">
              {children}
            </div>
          </motion.main>

          {/* Smart Context Panel */}
          <AnimatePresence>
            {showContextPanel && contextPanel && (
              <motion.aside
                initial={{ x: 384, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 384, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed right-0 top-0 h-screen w-96 bg-neutral-card shadow-visionos overflow-y-auto z-20"
              >
                <div className="p-6">
                  {contextPanel}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
