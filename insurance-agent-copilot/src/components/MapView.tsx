import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Filter, X } from 'lucide-react';

interface LeadLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  temperature: 'hot' | 'warm' | 'cold';
  phone: string;
  address: string;
}

interface MapFilter {
  nearMe: boolean;
  radius: number;
  followUpPending: boolean;
  highValue: boolean;
}

interface MapViewProps {
  leads: LeadLocation[];
  filters: MapFilter;
  onLeadSelect: (id: string) => void;
  onFilterChange: (filter: MapFilter) => void;
}

export default function MapView({ leads, filters, onLeadSelect, onFilterChange }: MapViewProps) {
  const [selectedLead, setSelectedLead] = useState<LeadLocation | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot':
        return '#EF4444';
      case 'warm':
        return '#F59E0B';
      case 'cold':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const handleLeadClick = (lead: LeadLocation) => {
    setSelectedLead(lead);
    onLeadSelect(lead.id);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredLeads = leads.filter(lead => {
    if (filters.nearMe && userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        lead.lat,
        lead.lng
      );
      const maxDistance = filters.radius * 0.5; // Convert minutes to km (rough estimate)
      if (distance > maxDistance) return false;
    }
    if (filters.highValue && lead.temperature !== 'hot') return false;
    return true;
  });

  return (
    <div className="relative h-full w-full">
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-400"></div>
            ))}
          </div>
        </div>

        {/* User Location Marker */}
        {userLocation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: '50%',
              top: '50%',
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-75"></div>
            </div>
          </div>
        )}

        {/* Lead Markers */}
        {filteredLeads.map((lead, index) => {
          // Calculate position relative to user or center
          const baseX = userLocation ? 50 : 50;
          const baseY = userLocation ? 50 : 50;
          const offsetX = (lead.lng - (userLocation?.lng || 77.5946)) * 100;
          const offsetY = (lead.lat - (userLocation?.lat || 12.9716)) * -100;

          return (
            <motion.div
              key={lead.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-20"
              style={{
                left: `${baseX + offsetX}%`,
                top: `${baseY + offsetY}%`,
              }}
              onClick={() => handleLeadClick(lead)}
            >
              <div className="relative">
                {/* Marker Pin */}
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
                  style={{ backgroundColor: getTemperatureColor(lead.temperature) }}
                >
                  <MapPin size={16} className="text-white" />
                </div>
                {/* Pulse effect for hot leads */}
                {lead.temperature === 'hot' && (
                  <div
                    className="absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: getTemperatureColor(lead.temperature) }}
                  ></div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Filter Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all shadow-lg"
      >
        <Filter size={18} className="text-primary-content" />
      </button>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 right-4 z-30 glass-effect rounded-xl p-4 shadow-xl w-64"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-primary-content font-semibold text-sm">Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="w-6 h-6 rounded-full hover:bg-dark-hover flex items-center justify-center"
            >
              <X size={14} className="text-secondary-content" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Near Me */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.nearMe}
                onChange={(e) => onFilterChange({ ...filters, nearMe: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs text-primary-content">Near Me</span>
            </label>

            {/* Radius */}
            {filters.nearMe && (
              <div>
                <label className="text-xs text-secondary-content mb-1 block">
                  Radius: {filters.radius} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  step="10"
                  value={filters.radius}
                  onChange={(e) => onFilterChange({ ...filters, radius: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            )}

            {/* Follow-up Pending */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.followUpPending}
                onChange={(e) => onFilterChange({ ...filters, followUpPending: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs text-primary-content">Follow-up Pending</span>
            </label>

            {/* High Value */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.highValue}
                onChange={(e) => onFilterChange({ ...filters, highValue: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-xs text-primary-content">High Value Leads</span>
            </label>
          </div>
        </motion.div>
      )}

      {/* Selected Lead Card */}
      {selectedLead && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-30 glass-effect rounded-xl p-4 shadow-xl"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-primary-content font-semibold text-sm">{selectedLead.name}</h3>
              <p className="text-xs text-secondary-content mt-0.5">{selectedLead.address}</p>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              className="w-6 h-6 rounded-full hover:bg-dark-hover flex items-center justify-center flex-shrink-0"
            >
              <X size={14} className="text-secondary-content" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{
                backgroundColor: `${getTemperatureColor(selectedLead.temperature)}20`,
                color: getTemperatureColor(selectedLead.temperature),
              }}
            >
              {selectedLead.temperature.toUpperCase()}
            </span>
            <span className="text-xs text-secondary-content">{selectedLead.phone}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.open(`tel:${selectedLead.phone}`)}
              className="flex-1 py-2 bg-semantic-success hover:bg-semantic-success/90 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Call
            </button>
            <button
              onClick={() => window.open(`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`)}
              className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-medium transition-colors"
            >
              WhatsApp
            </button>
            <button
              onClick={() => {
                // Open navigation
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedLead.lat},${selectedLead.lng}`);
              }}
              className="flex-1 py-2 glass-effect text-primary-content rounded-lg text-xs font-medium transition-colors hover:border-primary/50 flex items-center justify-center gap-1"
            >
              <Navigation size={12} />
              <span>Navigate</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-20 glass-effect rounded-lg p-2 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-semantic-error"></div>
            <span className="text-[10px] text-secondary-content">Hot</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-semantic-warning"></div>
            <span className="text-[10px] text-secondary-content">Warm</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-semantic-info"></div>
            <span className="text-[10px] text-secondary-content">Cold</span>
          </div>
        </div>
      </div>
    </div>
  );
}
