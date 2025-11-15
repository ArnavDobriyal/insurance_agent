import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Sparkles, Users, CheckSquare, Phone, Map, Bell, Settings } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface NavigationRailProps {
  activeRoute: string;
  notificationCount: number;
  onNavigate: (route: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  route: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home, route: '/' },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles, route: '/ai' },
  { id: 'leads', label: 'Leads', icon: Users, route: '/leads' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, route: '/tasks' },
  { id: 'calls', label: 'Calls', icon: Phone, route: '/calls' },
  { id: 'maps', label: 'Maps', icon: Map, route: '/maps' },
  { id: 'notifications', label: 'Notifications', icon: Bell, route: '/notifications' },
  { id: 'settings', label: 'Settings', icon: Settings, route: '/settings' },
];

export default function NavigationRail({ activeRoute, notificationCount, onNavigate }: NavigationRailProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (route: string) => {
    navigate(route);
    onNavigate(route);
  };

  const isActive = (route: string) => {
    return location.pathname === route;
  };

  return (
    <nav className="fixed left-0 top-0 h-screen w-20 bg-neutral-card shadow-visionos z-40 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
          A
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col gap-4">
        {navItems.map((item) => {
          const active = isActive(item.route);
          const Icon = item.icon;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavClick(item.route)}
              className={`
                relative w-14 h-14 rounded-button flex items-center justify-center
                transition-all duration-200
                ${active 
                  ? 'bg-primary text-white' 
                  : 'bg-transparent text-neutral-body hover:bg-neutral-bg'
                }
              `}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              <Icon size={22} strokeWidth={active ? 2.5 : 2} />
              
              {/* Active Indicator */}
              {active && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              {/* Notification Badge */}
              {item.id === 'notifications' && notificationCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-semantic-error rounded-full flex items-center justify-center text-white text-xs font-bold"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* User Avatar */}
      <div className="mt-auto">
        <button className="w-12 h-12 rounded-full bg-primary-glow flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity">
          RK
        </button>
      </div>
    </nav>
  );
}
