import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, Mail, MapPin, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import SentimentGraph from '../components/SentimentGraph';
import ConversionGauge from '../components/ConversionGauge';
import BottomNavigation from '../components/BottomNavigation';
import leadsData from '../data/mock/leads.json';
import interactionsData from '../data/mock/interactions.json';

export default function LeadProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'timeline' | 'insights'>('timeline');

  const lead = leadsData.find(l => l.id === id);
  const leadInteractions = interactionsData.filter(i => i.leadId === id);

  if (!lead) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-2">Lead Not Found</h2>
          <button
            onClick={() => navigate('/leads')}
            className="text-primary hover:underline"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  // Mock sentiment data
  const sentimentData = [
    { date: '2024-11-01', score: 0.3, label: 'Nov 1' },
    { date: '2024-11-05', score: 0.5, label: 'Nov 5' },
    { date: '2024-11-08', score: 0.4, label: 'Nov 8' },
    { date: '2024-11-10', score: 0.7, label: 'Nov 10' },
    { date: '2024-11-13', score: 0.8, label: 'Nov 13' },
  ];

  const getTemperatureColor = (temp: string) => {
    switch (temp) {
      case 'hot':
        return 'bg-semantic-error/20 text-semantic-error border-semantic-error/30';
      case 'warm':
        return 'bg-semantic-warning/20 text-semantic-warning border-semantic-warning/30';
      case 'cold':
        return 'bg-semantic-info/20 text-semantic-info border-semantic-info/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={16} />;
      case 'message':
        return <MessageCircle size={16} />;
      case 'email':
        return <Mail size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-page pb-24">
      <div className="max-w-screen-xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 glass-effect border-b border-dark-border px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/leads')}
              className="w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:border-primary/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">{lead.name}</h1>
              <p className="text-sm text-gray-400">{lead.location}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTemperatureColor(lead.temperature)}`}>
              {lead.temperature.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Actions */}
              <div className="glass-effect rounded-xl p-3">
                <div className="grid grid-cols-4 gap-2">
                  <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-dark-hover transition-colors">
                    <div className="w-10 h-10 rounded-full bg-semantic-success/20 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-semantic-success" />
                    </div>
                    <span className="text-[10px] text-gray-400">Call</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-dark-hover transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-[10px] text-gray-400">WhatsApp</span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-dark-hover transition-colors">
                    <div className="w-10 h-10 rounded-full bg-semantic-info/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-semantic-info" />
                    </div>
                    <span className="text-[10px] text-gray-400">Email</span>
                  </button>
                  <button 
                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${lead.lat},${lead.lng}`, '_blank')}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-dark-hover transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-semantic-warning/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-semantic-warning" />
                    </div>
                    <span className="text-[10px] text-gray-400">Map</span>
                  </button>
                </div>
              </div>

              {/* Lead Details */}
              <div className="glass-effect rounded-xl p-4">
                <h3 className="text-primary-content font-medium mb-3 text-sm">Lead Information</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-secondary-content mb-0.5">Age</div>
                    <div className="text-primary-content text-sm">{lead.age} years</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-secondary-content mb-0.5">Phone</div>
                    <div className="text-primary-content text-sm">{lead.phone}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-secondary-content mb-0.5">Email</div>
                    <div className="text-primary-content text-xs truncate">{lead.email}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-secondary-content mb-0.5">Premium</div>
                    <div className="text-primary-content text-sm">₹{lead.premium.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-dark-border">
                  <div className="flex items-center gap-2 text-secondary-content">
                    <MapPin size={14} />
                    <span className="text-xs line-clamp-1">{lead.address}</span>
                  </div>
                </div>

                {/* Tags */}
                {lead.tags && lead.tags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-dark-border">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Tag size={14} className="text-secondary-content" />
                      {lead.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-md text-[10px] text-secondary-content"
                        >
                          {tag}
                        </span>
                      ))}
                      {lead.tags.length > 4 && (
                        <span className="text-[10px] text-secondary-content">+{lead.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Last Interaction Summary */}
              <div className="glass-effect rounded-xl p-4">
                <h3 className="text-primary-content font-medium mb-2 text-sm">Last Interaction</h3>
                <p className="text-secondary-content text-xs leading-relaxed line-clamp-2">
                  {lead.lastInteractionSummary}
                </p>
                <div className="mt-2 text-[10px] text-gray-500">
                  {formatDate(lead.lastInteractionDate)}
                </div>
              </div>

              {/* Tabs */}
              <div className="glass-effect rounded-xl overflow-hidden">
                <div className="flex border-b border-dark-border">
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                      activeTab === 'timeline'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Timeline
                  </button>
                  <button
                    onClick={() => setActiveTab('insights')}
                    className={`flex-1 px-4 py-2.5 text-xs font-medium transition-colors ${
                      activeTab === 'insights'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    Insights
                  </button>
                </div>

                <div className="p-4">
                  {activeTab === 'timeline' && (
                    <div className="space-y-3">
                      {leadInteractions.length > 0 ? (
                        leadInteractions.map((interaction) => (
                          <motion.div
                            key={interaction.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                {getInteractionIcon(interaction.type)}
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="text-primary-content font-medium capitalize text-xs">{interaction.type}</h4>
                                <span className="text-[10px] text-gray-500">
                                  {formatDate(interaction.createdAt)}
                                </span>
                              </div>
                              <p className="text-xs text-secondary-content line-clamp-2">{interaction.summary}</p>
                              {interaction.duration && (
                                <div className="text-[10px] text-gray-500 mt-1">
                                  Duration: {Math.floor(interaction.duration / 60)} min
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          No interactions yet
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'insights' && (
                    <div className="space-y-3">
                      <div className="text-xs text-secondary-content">
                        <h4 className="text-primary-content font-medium mb-2 text-sm">Product Interest</h4>
                        <div className="flex flex-wrap gap-2">
                          {lead.productInterest.map((product, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-dark-border">
                        <h4 className="text-primary-content font-medium mb-2 text-sm">Conversion Insights</h4>
                        <p className="text-xs text-secondary-content">
                          Based on interaction history and engagement patterns, this lead shows{' '}
                          {lead.conversionProbability >= 70 ? 'strong' : lead.conversionProbability >= 40 ? 'moderate' : 'low'}{' '}
                          potential for conversion.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Analytics */}
            <div className="space-y-4">
              <ConversionGauge
                probability={lead.conversionProbability}
                confidence={85}
              />

              <SentimentGraph dataPoints={sentimentData} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation notificationCount={3} />
    </div>
  );
}
