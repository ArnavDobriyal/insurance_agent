import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Grid, List, Zap, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadCard from '../components/LeadCard';
import BottomNavigation from '../components/BottomNavigation';
import leadsData from '../data/mock/leads_enhanced.json';

type FilterType = 'all' | 'hot' | 'warm' | 'cold' | 'followup' | 'renewal' | 'high-value' | 'positive' | 'negative' | 'high-score';
type ViewMode = 'list' | 'heatmap';

export default function LeadListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as FilterType) || 'all';
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All Leads' },
    { id: 'hot', label: 'Hot', count: leadsData.filter(l => l.temperature === 'hot').length },
    { id: 'warm', label: 'Warm', count: leadsData.filter(l => l.temperature === 'warm').length },
    { id: 'cold', label: 'Cold', count: leadsData.filter(l => l.temperature === 'cold').length },
    { id: 'positive', label: 'Positive', count: leadsData.filter(l => l.sentiment?.label === 'positive').length },
    { id: 'negative', label: 'Negative', count: leadsData.filter(l => l.sentiment?.label === 'negative').length },
    { id: 'high-score', label: 'High AI Score', count: leadsData.filter(l => (l.aiPriority?.score || 0) >= 80).length },
    { id: 'followup', label: 'Follow-up', count: leadsData.filter(l => l.tags.includes('follow-up')).length },
    { id: 'renewal', label: 'Renewals', count: leadsData.filter(l => l.tags.includes('renewal-due')).length },
    { id: 'high-value', label: 'High Value', count: leadsData.filter(l => l.tags.includes('high-value')).length },
  ];

  const filteredLeads = useMemo(() => {
    let filtered = [...leadsData];

    // Apply filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(lead => {
        switch (activeFilter) {
          case 'hot':
          case 'warm':
          case 'cold':
            return lead.temperature === activeFilter;
          case 'positive':
            return lead.sentiment?.label === 'positive';
          case 'negative':
            return lead.sentiment?.label === 'negative';
          case 'high-score':
            return (lead.aiPriority?.score || 0) >= 80;
          case 'followup':
            return lead.tags.includes('follow-up');
          case 'renewal':
            return lead.tags.includes('renewal-due');
          case 'high-value':
            return lead.tags.includes('high-value');
          default:
            return true;
        }
      });
    }

    // Sort by AI priority score (highest first)
    filtered.sort((a, b) => {
      const scoreA = a.aiPriority?.score || 0;
      const scoreB = b.aiPriority?.score || 0;
      return scoreB - scoreA;
    });

    // Enhanced Smart Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query) ||
        lead.tags.some(tag => tag.toLowerCase().includes(query)) ||
        lead.sentiment?.label.toLowerCase().includes(query) ||
        lead.productInterest?.some(product => product.toLowerCase().includes(query)) ||
        (query.includes('high') && (lead.aiPriority?.score || 0) >= 80) ||
        (query.includes('low') && (lead.aiPriority?.score || 0) < 50) ||
        (query.includes('urgent') && lead.aiPriority?.urgencyLevel === 'critical')
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-red-500';
    if (score >= 80) return 'bg-orange-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const HeatmapView = () => (
    <div className="grid grid-cols-4 gap-2">
      {filteredLeads.map((lead) => (
        <motion.div
          key={lead.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => navigate(`/leads/${lead.id}`)}
          className={`
            aspect-square rounded-lg p-2 cursor-pointer transition-all hover:scale-105
            ${getHeatmapColor(lead.aiPriority?.score || 0)}
          `}
        >
          <div className="text-white text-xs font-medium truncate mb-1">
            {lead.name}
          </div>
          <div className="text-white/80 text-[10px] mb-1">
            {lead.aiPriority?.score || 0}
          </div>
          <div className="text-white/60 text-[8px] truncate">
            {lead.aiPriority?.urgencyLevel || 'low'}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-page pb-24">
      <div className="px-4 pt-4 pb-4 max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/home')}
              className="w-8 h-8 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-primary-content">Leads</h1>
              <p className="text-[10px] text-secondary-content">
                {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
              </p>
            </div>
          </div>
          
          {/* Compact View Toggle */}
          <div className="flex items-center gap-0.5 glass-effect rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-primary-content'
              }`}
            >
              <List size={14} />
            </button>
            <button
              onClick={() => setViewMode('heatmap')}
              className={`p-1.5 rounded transition-all ${
                viewMode === 'heatmap' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-primary-content'
              }`}
            >
              <Grid size={14} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full glass-effect rounded-xl pl-12 pr-4 py-2.5 text-primary-content placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all flex items-center gap-1
                ${activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'glass-effect text-secondary-content hover:border-primary/50'
                }
              `}
            >
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span className={`
                  px-1 py-0.5 rounded-full text-[8px]
                  ${activeFilter === filter.id
                    ? 'bg-white/20'
                    : 'bg-dark-hover'
                  }
                `}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Leads Content */}
        {filteredLeads.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {viewMode === 'list' ? (
              <div className="space-y-3">
                {filteredLeads.map((lead, index) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <LeadCard
                      lead={lead as any}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <HeatmapView />
            )}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-dark-hover flex items-center justify-center mx-auto mb-3">
              <Filter className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-primary-content font-medium mb-2 text-sm">No leads found</h3>
            <p className="text-secondary-content text-xs">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'No leads match the selected filter'
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
