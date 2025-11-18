import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Tag, Phone, MessageCircle, Mail, TrendingUp, TrendingDown, Minus, Clock, Users, IndianRupee, Zap } from 'lucide-react';
import CallPopup from './CallPopup';

interface Lead {
  id: string;
  name: string;
  age: number;
  location: string;
  tags: string[];
  temperature: 'hot' | 'warm' | 'cold';
  lastInteractionSummary: string;
  lastInteractionDate: string;
  conversionProbability: number;
  premium: number;
  productInterest?: string[];
  aiPriority?: {
    score: number;
    reasoning: string[];
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    recommendedAction: string;
  };
  sentiment?: {
    score: number;
    label: 'positive' | 'neutral' | 'negative';
    confidence: number;
    reasoning: string;
    trend: 'improving' | 'declining' | 'stable';
  };
  enrichment?: {
    income: number;
    dependents: number;
    existingPolicies: any[];
    riskProfile: 'low' | 'medium' | 'high';
    source: string;
  };
  engagement?: {
    responseRate: number;
    preferredContactTime: string;
    communicationChannel: 'whatsapp' | 'call' | 'email';
  };
  aiSuggestions?: {
    nextBestAction: {
      action: 'call' | 'whatsapp' | 'email';
      timing: string;
      confidence: number;
      urgency: 'low' | 'medium' | 'high' | 'critical';
    };
  };
}

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export default function LeadCard({ lead, onClick }: LeadCardProps) {
  const [showCallPopup, setShowCallPopup] = useState(false);
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

  const getTemperatureIcon = (temp: string) => {
    switch (temp) {
      case 'hot':
        return '🔥';
      case 'warm':
        return '☀️';
      case 'cold':
        return '❄️';
      default:
        return '•';
    }
  };

  const getSentimentColor = (sentiment?: { label: string; score: number }) => {
    if (!sentiment) return 'bg-gray-500';
    switch (sentiment.label) {
      case 'positive':
        return 'bg-semantic-success';
      case 'negative':
        return 'bg-semantic-error';
      default:
        return 'bg-semantic-warning';
    }
  };

  const getSentimentIcon = (sentiment?: { trend: string }) => {
    if (!sentiment) return <Minus size={12} />;
    switch (sentiment.trend) {
      case 'improving':
        return <TrendingUp size={12} className="text-semantic-success" />;
      case 'declining':
        return <TrendingDown size={12} className="text-semantic-error" />;
      default:
        return <Minus size={12} className="text-gray-400" />;
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'critical':
        return 'bg-red-500 animate-pulse';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getActionIcon = (action?: string) => {
    switch (action) {
      case 'call':
        return <Phone size={12} />;
      case 'whatsapp':
        return <MessageCircle size={12} />;
      case 'email':
        return <Mail size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  const formatIncome = (income?: number) => {
    if (!income) return '';
    if (income >= 1000000) {
      return `₹${(income / 1000000).toFixed(1)}L`;
    }
    return `₹${(income / 100000).toFixed(0)}L`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-effect rounded-xl p-4 cursor-pointer hover:border-primary/50 transition-all relative"
    >
      <div className="flex items-start gap-4">
        {/* Avatar with Sentiment */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          {/* Enhanced Sentiment Indicator */}
          {lead.sentiment && (
            <div 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getSentimentColor(lead.sentiment)} flex items-center justify-center cursor-help`}
              title={`${lead.sentiment.label.toUpperCase()}: ${lead.sentiment.reasoning} (${Math.round(lead.sentiment.confidence * 100)}% confidence)`}
            >
              {getSentimentIcon(lead.sentiment)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-primary-content font-semibold text-base truncate mb-1">
                {lead.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-secondary-content">
                <span>{lead.age} years</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span className="truncate">{lead.location}</span>
                </div>
              </div>
            </div>

            {/* Temperature Badge */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 flex-shrink-0
              ${getTemperatureColor(lead.temperature)}
            `}>
              <span>{getTemperatureIcon(lead.temperature)}</span>
              <span className="capitalize">{lead.temperature}</span>
            </div>
          </div>

          {/* Product Interest */}
          {lead.productInterest && lead.productInterest.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-xs text-secondary-content">Interested in:</span>
                {lead.productInterest.map((product, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-primary/20 text-primary rounded-md text-xs"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* AI Insight */}
          {lead.aiPriority && (
            <div className="bg-primary/10 rounded-lg p-2 mb-3">
              <div className="flex items-center gap-1 mb-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">AI Insight</span>
              </div>
              <p className="text-xs text-primary-content">
                {lead.aiPriority.recommendedAction}
              </p>
            </div>
          )}

          {/* Last Interaction */}
          <p className="text-xs text-secondary-content line-clamp-2 mb-3">
            {lead.lastInteractionSummary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pt-2 border-t border-dark-border">
            <span>Last: {formatDate(lead.lastInteractionDate)}</span>
            <div className="flex items-center gap-1">
              <span>{lead.conversionProbability}%</span>
              <div className="w-6 h-1 bg-dark-hover rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-semantic-error to-semantic-success rounded-full"
                  style={{ width: `${lead.conversionProbability}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                setShowCallPopup(true);
              }}
              className="glass-effect rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 text-xs text-semantic-success hover:border-semantic-success/50 transition-all"
            >
              <Phone size={12} />
              <span>Call</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                onClick();
                setTimeout(() => {
                  const commHub = document.querySelector('[data-communication-hub]');
                  if (commHub) {
                    commHub.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }, 100);
              }}
              className="glass-effect rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 text-xs text-green-400 hover:border-green-400/50 transition-all"
            >
              <MessageCircle size={12} />
              <span>Chat</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                const address = encodeURIComponent(lead.address || lead.location || '');
                window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
              }}
              className="glass-effect rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 text-xs text-orange-400 hover:border-orange-400/50 transition-all"
            >
              <MapPin size={12} />
              <span>Map</span>
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.location.href = `/ai?action=analyze&leadId=${lead.id}&leadName=${encodeURIComponent(lead.name)}&leadInfo=${encodeURIComponent(JSON.stringify({
                  age: lead.age,
                  location: lead.location,
                  productInterest: lead.productInterest,
                  temperature: lead.temperature,
                  lastInteraction: lead.lastInteractionSummary,
                  conversionProbability: lead.conversionProbability,
                  aiPriority: lead.aiPriority,
                  sentiment: lead.sentiment,
                  enrichment: lead.enrichment,
                  engagement: lead.engagement
                }))}`;
              }}
              className="glass-effect rounded-lg px-2 py-1.5 flex items-center justify-center gap-1 text-xs text-purple-400 hover:border-purple-400/50 transition-all"
            >
              <Zap size={12} />
              <span>AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Call Popup */}
      <CallPopup
        isOpen={showCallPopup}
        onClose={() => setShowCallPopup(false)}
        leadName={lead.name}
        leadPhone={lead.phone || ''}
        nextBestAction={lead.aiSuggestions?.nextBestAction}
      />
    </motion.div>
  );
}
