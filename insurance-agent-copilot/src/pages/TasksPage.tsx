import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Calendar, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNavigation from '../components/BottomNavigation';
import leadsData from '../data/mock/leads.json';

interface Task {
  id: string;
  title: string;
  description: string;
  leadId: string;
  leadName: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  type: 'follow-up' | 'renewal' | 'document' | 'call' | 'meeting';
}

type FilterType = 'all' | 'pending' | 'completed' | 'today' | 'overdue';

export default function TasksPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending');

  // Mock tasks data
  const mockTasks: Task[] = [
    {
      id: 'task-1',
      title: 'Follow-up call with Priya Sharma',
      description: 'Discuss term life policy options and send quote',
      leadId: 'lead-1',
      leadName: 'Priya Sharma',
      dueDate: '2024-11-15T10:00:00Z',
      priority: 'high',
      status: 'pending',
      type: 'follow-up',
    },
    {
      id: 'task-2',
      title: 'Send renewal reminder to Amit Patel',
      description: 'Policy renewal due in 7 days',
      leadId: 'lead-2',
      leadName: 'Amit Patel',
      dueDate: '2024-11-15T14:00:00Z',
      priority: 'high',
      status: 'pending',
      type: 'renewal',
    },
    {
      id: 'task-3',
      title: 'Collect documents from Rahul Mehta',
      description: 'Need ID proof and address proof for policy application',
      leadId: 'lead-4',
      leadName: 'Rahul Mehta',
      dueDate: '2024-11-16T09:00:00Z',
      priority: 'medium',
      status: 'pending',
      type: 'document',
    },
    {
      id: 'task-4',
      title: 'Schedule meeting with Sneha Reddy',
      description: 'Discuss budget-friendly term life options',
      leadId: 'lead-3',
      leadName: 'Sneha Reddy',
      dueDate: '2024-11-17T11:00:00Z',
      priority: 'low',
      status: 'pending',
      type: 'meeting',
    },
    {
      id: 'task-5',
      title: 'Called Priya Sharma',
      description: 'Discussed coverage options',
      leadId: 'lead-1',
      leadName: 'Priya Sharma',
      dueDate: '2024-11-13T10:00:00Z',
      priority: 'high',
      status: 'completed',
      type: 'call',
    },
  ];

  const [tasks, setTasks] = useState(mockTasks);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'today', label: 'Today' },
    { id: 'overdue', label: 'Overdue' },
    { id: 'completed', label: 'Completed' },
  ];

  const filteredTasks = tasks.filter(task => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.dueDate);
    taskDate.setHours(0, 0, 0, 0);

    switch (activeFilter) {
      case 'pending':
        return task.status === 'pending';
      case 'completed':
        return task.status === 'completed';
      case 'today':
        return task.status === 'pending' && taskDate.getTime() === today.getTime();
      case 'overdue':
        return task.status === 'pending' && taskDate < today;
      default:
        return true;
    }
  });

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-semantic-error bg-semantic-error/20';
      case 'medium':
        return 'text-semantic-warning bg-semantic-warning/20';
      case 'low':
        return 'text-semantic-info bg-semantic-info/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString: string, status: string) => {
    if (status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dateString);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const todayCount = tasks.filter(t => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(t.dueDate);
    taskDate.setHours(0, 0, 0, 0);
    return t.status === 'pending' && taskDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="min-h-screen bg-page pb-24">
      <div className="px-4 pt-4 pb-4 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary-content">Tasks</h1>
            <p className="text-xs text-secondary-content mt-0.5">
              {pendingCount} pending • {todayCount} due today
            </p>
          </div>
          <button className="w-10 h-10 rounded-full bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors">
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                ${activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'glass-effect text-secondary-content hover:border-primary/50'
                }
              `}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  glass-effect rounded-xl p-4 transition-all
                  ${task.status === 'completed' ? 'opacity-60' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all
                      ${task.status === 'completed'
                        ? 'bg-semantic-success border-semantic-success'
                        : 'border-gray-400 hover:border-primary'
                      }
                    `}
                  >
                    {task.status === 'completed' && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`
                        text-sm font-medium flex-1
                        ${task.status === 'completed'
                          ? 'line-through text-secondary-content'
                          : 'text-primary-content'
                        }
                      `}>
                        {task.title}
                      </h3>
                    </div>

                    <p className="text-xs text-secondary-content mb-2 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Lead */}
                      <button
                        onClick={() => navigate(`/leads/${task.leadId}`)}
                        className="flex items-center gap-1 px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-md text-[10px] text-secondary-content hover:text-primary transition-colors"
                      >
                        <User size={10} />
                        <span>{task.leadName}</span>
                      </button>

                      {/* Due Date */}
                      <div className={`
                        flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px]
                        ${isOverdue(task.dueDate, task.status)
                          ? 'bg-semantic-error/20 text-semantic-error'
                          : 'dark:bg-dark-hover light:bg-gray-200 text-secondary-content'
                        }
                      `}>
                        {isOverdue(task.dueDate, task.status) ? (
                          <AlertCircle size={10} />
                        ) : (
                          <Calendar size={10} />
                        )}
                        <span>{formatDate(task.dueDate)}</span>
                      </div>

                      {/* Priority */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-dark-hover flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-primary-content font-medium mb-2 text-sm">No tasks found</h3>
            <p className="text-secondary-content text-xs">
              {activeFilter === 'completed' 
                ? 'No completed tasks yet'
                : 'All caught up! No pending tasks.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={3} />
    </div>
  );
}
