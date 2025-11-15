import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import LeadCard from '../components/LeadCard';
import BottomNavigation from '../components/BottomNavigation';
import leadsData from '../data/mock/leads.json';

type FilterType = 'all' | 'hot' | 'warm' | 'cold' | 'followup' | 'renewal' | 'high-value';

export default function LeadListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = (searchParams.get('filter') as FilterType) || 'all';
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const filters: { id: FilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All Leads' },
    { id: 'hot', label: 'Hot', count: leadsData.filter(l => l.temperature === 'hot').length },
    { id: 'warm', label: 'Warm', count: leadsData.filter(l => l.temperature === 'warm').length },
    { id: 'cold', label: 'Cold', count: leadsData.filter(l => l.temperature === 'cold').length },
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

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(query) ||
        lead.location.toLowerCase().includes(query) ||
        lead.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

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
          <div>
            <h1 className="text-xl font-bold text-primary-content">Leads</h1>
            <p className="text-xs text-secondary-content mt-0.5">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
            </p>
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
                px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5
                ${activeFilter === filter.id
                  ? 'bg-primary text-white'
                  : 'glass-effect text-secondary-content hover:border-primary/50'
                }
              `}
            >
              <span>{filter.label}</span>
              {filter.count !== undefined && (
                <span className={`
                  px-1.5 py-0.5 rounded-full text-[10px]
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

        {/* Leads List */}
        {filteredLeads.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
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
