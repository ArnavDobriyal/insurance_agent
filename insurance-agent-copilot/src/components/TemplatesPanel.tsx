import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Send, Copy, Check } from 'lucide-react';

interface MessageTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  dynamicFields: string[];
  channel: 'whatsapp' | 'sms' | 'email';
  isApproved: boolean;
}

interface TemplatesPanelProps {
  templates: MessageTemplate[];
  leadData: Record<string, any>;
  onSelectTemplate: (id: string) => void;
}

export default function TemplatesPanel({ templates, leadData, onSelectTemplate }: TemplatesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fillTemplate = (content: string) => {
    let filled = content;
    Object.keys(leadData).forEach(key => {
      const placeholder = `{{${key}}}`;
      if (filled.includes(placeholder)) {
        filled = filled.replace(new RegExp(placeholder, 'g'), leadData[key] || `[${key}]`);
      }
    });
    return filled;
  };

  const handleCopy = (template: MessageTemplate) => {
    const filledContent = fillTemplate(template.content);
    navigator.clipboard.writeText(filledContent);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelect = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    onSelectTemplate(template.id);
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return '💬';
      case 'sms':
        return '📱';
      case 'email':
        return '📧';
      default:
        return '📄';
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'whatsapp':
        return 'bg-semantic-success/20 text-semantic-success';
      case 'sms':
        return 'bg-semantic-info/20 text-semantic-info';
      case 'email':
        return 'bg-primary/20 text-primary';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="glass-effect rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="text-primary-content font-semibold text-sm">Message Templates</h3>
          <p className="text-[10px] text-secondary-content">IRDAI Pre-Approved</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-content" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full pl-9 pr-3 py-2 dark:bg-dark-hover light:bg-gray-100 rounded-lg text-xs text-primary-content placeholder-gray-500 outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Templates List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              border rounded-lg p-3 cursor-pointer transition-all
              ${selectedTemplate?.id === template.id
                ? 'border-primary bg-primary/5'
                : 'border-dark-border hover:border-primary/50'
              }
            `}
            onClick={() => handleSelect(template)}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-medium text-primary-content truncate">{template.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getChannelColor(template.channel)}`}>
                    {getChannelIcon(template.channel)} {template.channel.toUpperCase()}
                  </span>
                  <span className="px-2 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded-full text-[10px] text-secondary-content">
                    {template.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Template Preview */}
            <p className="text-xs text-secondary-content line-clamp-2 mb-2">
              {fillTemplate(template.content)}
            </p>

            {/* Dynamic Fields */}
            {template.dynamicFields.length > 0 && (
              <div className="mb-2">
                <div className="text-[10px] text-secondary-content mb-1">Auto-filled:</div>
                <div className="flex flex-wrap gap-1">
                  {template.dynamicFields.map((field, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 dark:bg-dark-hover light:bg-gray-200 rounded text-[10px] text-secondary-content"
                    >
                      {field}: {leadData[field] || 'N/A'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(template);
                }}
                className="flex-1 py-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedId === template.id ? (
                  <>
                    <Check size={12} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Open send dialog
                }}
                className="flex-1 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Send size={12} />
                <span>Send</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-xs text-secondary-content">
            {searchQuery ? 'No templates found' : 'No templates available'}
          </p>
        </div>
      )}
    </div>
  );
}
