import { motion } from 'framer-motion';
import { Navigation, Clock, MapPin, Play, X } from 'lucide-react';

interface Waypoint {
  leadId: string;
  leadName: string;
  order: number;
  estimatedArrival: string;
  address: string;
}

interface OptimizedRoute {
  waypoints: Waypoint[];
  totalDistance: number;
  totalTime: number;
}

interface RouteOptimizerCardProps {
  selectedLeads: string[];
  route: OptimizedRoute | null;
  onStartRoute: () => void;
  onClose: () => void;
}

export default function RouteOptimizerCard({ selectedLeads, route, onStartRoute, onClose }: RouteOptimizerCardProps) {
  if (selectedLeads.length === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-20 left-4 right-4 z-40 glass-effect rounded-2xl shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Route Optimizer</h3>
            <p className="text-white/80 text-[10px]">
              {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {route ? (
          <>
            {/* Route Summary */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="glass-effect rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={14} className="text-primary" />
                  <span className="text-[10px] text-secondary-content">Distance</span>
                </div>
                <div className="text-lg font-bold text-primary-content">
                  {route.totalDistance.toFixed(1)} km
                </div>
              </div>
              <div className="glass-effect rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock size={14} className="text-primary" />
                  <span className="text-[10px] text-secondary-content">Time</span>
                </div>
                <div className="text-lg font-bold text-primary-content">
                  {Math.round(route.totalTime)} min
                </div>
              </div>
            </div>

            {/* Waypoints */}
            <div className="mb-4 max-h-48 overflow-y-auto">
              <div className="text-[10px] text-secondary-content mb-2 font-medium">Route Order:</div>
              <div className="space-y-2">
                {route.waypoints.map((waypoint, index) => (
                  <div
                    key={waypoint.leadId}
                    className="flex items-start gap-3 p-2 dark:bg-dark-hover light:bg-gray-100 rounded-lg"
                  >
                    {/* Order Number */}
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {waypoint.order}
                    </div>

                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-medium text-primary-content truncate">
                        {waypoint.leadName}
                      </h4>
                      <p className="text-[10px] text-secondary-content truncate">
                        {waypoint.address}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock size={10} className="text-secondary-content" />
                        <span className="text-[10px] text-secondary-content">
                          ETA: {waypoint.estimatedArrival}
                        </span>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {index < route.waypoints.length - 1 && (
                      <div className="absolute left-7 top-full w-0.5 h-2 bg-primary/30"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={onStartRoute}
              className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <Play size={16} />
              <span>Start Navigation</span>
            </button>
          </>
        ) : (
          /* Loading State */
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs text-secondary-content">Optimizing route...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
