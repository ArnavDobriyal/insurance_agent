import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Users, Route } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../components/MapView';
import RouteOptimizerCard from '../components/RouteOptimizerCard';
import BottomNavigation from '../components/BottomNavigation';
import leadsData from '../data/mock/leads.json';

interface MapFilter {
  nearMe: boolean;
  radius: number;
  followUpPending: boolean;
  highValue: boolean;
}

export default function MapsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get('leadId');

  const [filters, setFilters] = useState<MapFilter>({
    nearMe: false,
    radius: 30,
    followUpPending: false,
    highValue: false,
  });

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [optimizedRoute, setOptimizedRoute] = useState<any>(null);
  const [showRouteOptimizer, setShowRouteOptimizer] = useState(false);

  // Convert leads data to map format
  const leadLocations = leadsData.map(lead => ({
    id: lead.id,
    name: lead.name,
    lat: lead.lat,
    lng: lead.lng,
    temperature: lead.temperature as 'hot' | 'warm' | 'cold',
    phone: lead.phone,
    address: lead.address,
  }));

  // If leadId is provided, select that lead and show it
  useEffect(() => {
    if (leadIdParam) {
      setSelectedLeads([leadIdParam]);
    }
  }, [leadIdParam]);

  const handleLeadSelect = (leadId: string) => {
    if (selectedLeads.includes(leadId)) {
      setSelectedLeads(selectedLeads.filter(id => id !== leadId));
    } else {
      setSelectedLeads([...selectedLeads, leadId]);
    }
  };

  const handleOptimizeRoute = () => {
    if (selectedLeads.length < 2) {
      alert('Please select at least 2 leads to optimize route');
      return;
    }

    setShowRouteOptimizer(true);

    // Simulate route optimization
    setTimeout(() => {
      const waypoints = selectedLeads.map((leadId, index) => {
        const lead = leadsData.find(l => l.id === leadId);
        return {
          leadId,
          leadName: lead?.name || '',
          order: index + 1,
          estimatedArrival: `${10 + index * 15} min`,
          address: lead?.address || '',
        };
      });

      setOptimizedRoute({
        waypoints,
        totalDistance: selectedLeads.length * 5.2,
        totalTime: selectedLeads.length * 15,
      });
    }, 1500);
  };

  const handleStartRoute = () => {
    if (!optimizedRoute) return;

    // Build Google Maps URL with multiple waypoints
    const origin = optimizedRoute.waypoints[0];
    const destination = optimizedRoute.waypoints[optimizedRoute.waypoints.length - 1];
    const waypoints = optimizedRoute.waypoints.slice(1, -1);

    const originLead = leadsData.find(l => l.id === origin.leadId);
    const destLead = leadsData.find(l => l.id === destination.leadId);

    let url = `https://www.google.com/maps/dir/?api=1`;
    url += `&origin=${originLead?.lat},${originLead?.lng}`;
    url += `&destination=${destLead?.lat},${destLead?.lng}`;

    if (waypoints.length > 0) {
      const waypointCoords = waypoints.map(wp => {
        const lead = leadsData.find(l => l.id === wp.leadId);
        return `${lead?.lat},${lead?.lng}`;
      }).join('|');
      url += `&waypoints=${waypointCoords}`;
    }

    window.open(url, '_blank');
  };

  return (
    <div className="h-screen bg-page flex flex-col">
      {/* Header */}
      <div className="glass-effect border-b border-dark-border px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="w-8 h-8 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-secondary-content" />
          </button>
          <div>
            <h1 className="text-base font-bold text-primary-content">Field Map</h1>
            <p className="text-[10px] text-secondary-content">
              {leadLocations.length} leads nearby
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedLeads.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2 py-1 bg-primary/20 rounded-full"
            >
              <Users size={12} className="text-primary" />
              <span className="text-xs font-semibold text-primary">{selectedLeads.length}</span>
            </motion.div>
          )}

          {selectedLeads.length >= 2 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={handleOptimizeRoute}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-full text-xs font-medium transition-colors"
            >
              <Route size={12} />
              <span>Optimize</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapView
          leads={leadLocations}
          filters={filters}
          onLeadSelect={handleLeadSelect}
          onFilterChange={setFilters}
        />
      </div>

      {/* Route Optimizer Card */}
      <AnimatePresence>
        {showRouteOptimizer && (
          <RouteOptimizerCard
            selectedLeads={selectedLeads}
            route={optimizedRoute}
            onStartRoute={handleStartRoute}
            onClose={() => {
              setShowRouteOptimizer(false);
              setOptimizedRoute(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={3} />
    </div>
  );
}
