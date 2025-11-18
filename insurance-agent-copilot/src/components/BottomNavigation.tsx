import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, CheckSquare, Bell, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  notificationCount: number;
}

const navItems = [
  { id: 'home', label: 'Home', icon: Home, route: '/home', isExternal: false },
  { id: 'ai', label: 'AI', icon: Sparkles, route: '/ai', isExternal: false },
  { id: 'leads', label: 'Leads', icon: Users, route: '/leads', isExternal: false },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, route: '/tasks', isExternal: false },
  { id: 'notifications', label: 'Alerts', icon: Bell, route: '/notifications', isExternal: false },
];

export default function BottomNavigation({ notificationCount }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (route: string) => location.pathname === route;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-effect border-t border-dark-border safe-area-bottom shadow-2xl">
      <div className="flex items-center justify-around px-2 py-3.5 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => {
                if (item.isExternal) {
                  window.open(item.route, '_blank');
                } else {
                  navigate(item.route);
                }
              }}
              className={`
                relative flex flex-col items-center gap-1.5 px-4 py-2 rounded-xl
                transition-all duration-200 min-w-[68px]
                ${active ? 'text-primary' : 'text-gray-400 hover:text-gray-300'}
              `}
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                
                {/* Notification Badge */}
                {item.id === 'notifications' && notificationCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-semantic-error rounded-full flex items-center justify-center"
                  >
                    <span className="text-[10px] font-bold text-white">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <span className={`text-[11px] font-medium ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
