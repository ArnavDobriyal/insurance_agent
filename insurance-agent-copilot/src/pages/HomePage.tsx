import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Mic, CheckCircle, LogOut, UserPlus, FileText, TrendingUp } from 'lucide-react';
import AIAssistant from '../components/AIAssistant';
import WorkZoneCard from '../components/WorkZoneCard';
import BottomNavigation from '../components/BottomNavigation';
import CallRecorder from '../components/CallRecorder';
import leadsData from '../data/mock/leads.json';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCallRecorder, setShowCallRecorder] = useState(false);
  const [aiCommand, setAiCommand] = useState<string | null>(null);

  const hotLeadsCount = leadsData.filter(l => l.temperature === 'hot').length;

  // Mock tasks for today
  const [mockTasks, setMockTasks] = useState([
    {
      id: 'task-1',
      title: 'Follow-up call with Priya Sharma',
      leadName: 'Priya Sharma',
      priority: 'high',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Send renewal reminder to Amit Patel',
      leadName: 'Amit Patel',
      priority: 'high',
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Collect documents from Rahul Mehta',
      leadName: 'Rahul Mehta',
      priority: 'medium',
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Schedule meeting with Sneha Reddy',
      leadName: 'Sneha Reddy',
      priority: 'low',
      completed: true,
    },
  ]);

  const handleToggleTask = (taskId: string) => {
    setMockTasks(mockTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleCommand = (command: string) => {
    console.log('AI Command:', command);
    setAiCommand(command);
    
    // Don't auto-navigate - let the AI Assistant handle the response
    // Users can manually navigate if needed
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-page pb-24">
      <div className="px-4 pt-6 pb-4 max-w-screen-xl mx-auto">
        {/* Header with Logout */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-content">Welcome Back</h1>
            <p className="text-sm text-secondary-content mt-1">{localStorage.getItem('userEmail')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 glass-effect text-gray-400 hover:text-semantic-error hover:border-semantic-error/50 rounded-xl transition-all text-sm shadow-lg"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>

        {/* AI Assistant */}
        <AIAssistant onCommand={handleCommand} />

        {/* Call Recording & Quick Actions Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-primary-content mb-4">Quick Actions</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setShowCallRecorder(true)}
              className="flex items-center gap-2.5 px-5 py-3 glass-effect text-primary-content rounded-xl hover:border-primary/50 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              <Mic size={20} />
              <span className="font-semibold text-sm">Record Call</span>
            </button>
            <button
              onClick={() => navigate('/leads?action=create')}
              className="flex items-center gap-2.5 px-5 py-3 glass-effect text-primary-content rounded-xl hover:border-primary/50 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              <UserPlus size={20} />
              <span className="font-semibold text-sm">New Lead</span>
            </button>
            <button
              onClick={() => navigate('/ai', { state: { message: 'Summarize today' } })}
              className="flex items-center gap-2.5 px-5 py-3 glass-effect text-primary-content rounded-xl hover:border-primary/50 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              <FileText size={20} />
              <span className="font-semibold text-sm">Summarize</span>
            </button>
            <button
              onClick={() => navigate('/leads?filter=hot')}
              className="flex items-center gap-2.5 px-5 py-3 glass-effect text-primary-content rounded-xl hover:border-primary/50 hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0 active:scale-95"
            >
              <TrendingUp size={20} />
              <span className="font-semibold text-sm">Hot Leads</span>
            </button>
          </div>
        </div>

        {/* Work Zones */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-primary-content mb-4">Quick Access</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            <WorkZoneCard
              title="Hot Leads"
              count={hotLeadsCount}
              icon="hot"
              onClick={() => navigate('/leads?filter=hot')}
            />
            <WorkZoneCard
              title="Renewals"
              count={3}
              icon="renewal"
              onClick={() => navigate('/leads?filter=renewal')}
            />
            <WorkZoneCard
              title="Follow-ups"
              count={5}
              icon="followup"
              onClick={() => navigate('/tasks?filter=followup')}
            />
            <WorkZoneCard
              title="Pending"
              count={8}
              icon="task"
              onClick={() => navigate('/tasks')}
            />
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary-content">Today's Tasks</h2>
            <button
              onClick={() => navigate('/tasks')}
              className="text-xs text-primary hover:text-primary-dark font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {mockTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="glass-effect rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${task.completed
                        ? 'bg-semantic-success border-semantic-success'
                        : 'border-gray-400 hover:border-primary'
                      }
                    `}
                  >
                    {task.completed && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className={`
                      text-xs font-medium mb-0.5
                      ${task.completed ? 'line-through text-secondary-content' : 'text-primary-content'}
                    `}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] text-secondary-content">{task.leadName}</span>
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded
                        ${task.priority === 'high' ? 'bg-semantic-error/20 text-semantic-error' : ''}
                        ${task.priority === 'medium' ? 'bg-semantic-warning/20 text-semantic-warning' : ''}
                        ${task.priority === 'low' ? 'bg-semantic-info/20 text-semantic-info' : ''}
                      `}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Actions - Fixed above bottom nav */}
      <div className="fixed bottom-20 left-0 right-0 pb-4 bg-gradient-to-t from-page via-page to-transparent pt-6 z-40 pointer-events-none">
        <div className="px-4 max-w-screen-xl mx-auto pointer-events-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
            <button
              onClick={() => navigate('/leads?filter=hot')}
              className="glass-effect rounded-xl p-3 hover:border-primary/50 transition-all text-left flex-shrink-0 w-[calc(50%-6px)] snap-start"
            >
              <h3 className="text-xs font-medium text-primary-content">Show hot leads</h3>
            </button>
            <button
              onClick={() => navigate('/leads')}
              className="glass-effect rounded-xl p-3 hover:border-primary/50 transition-all text-left flex-shrink-0 w-[calc(50%-6px)] snap-start"
            >
              <h3 className="text-xs font-medium text-primary-content">Create new lead</h3>
            </button>
            <button
              onClick={() => navigate('/leads?filter=warm')}
              className="glass-effect rounded-xl p-3 hover:border-primary/50 transition-all text-left flex-shrink-0 w-[calc(50%-6px)] snap-start"
            >
              <h3 className="text-xs font-medium text-primary-content">Show renewals</h3>
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="glass-effect rounded-xl p-3 hover:border-primary/50 transition-all text-left flex-shrink-0 w-[calc(50%-6px)] snap-start"
            >
              <h3 className="text-xs font-medium text-primary-content">View tasks</h3>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={3} />

      {/* Call Recorder Modal */}
      <AnimatePresence>
        {showCallRecorder && (
          <CallRecorder
            onClose={() => setShowCallRecorder(false)}
            onSave={(summary, leadId) => {
              console.log('Call saved:', { summary, leadId });
              setShowCallRecorder(false);
            }}
          />
        )}
      </AnimatePresence>


    </div>
  );
}
