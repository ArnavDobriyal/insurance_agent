import { useState } from 'react';
import { Phone, MessageCircle, Mail, Send, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunicationHubProps {
  leadName: string;
  leadPhone: string;
  leadEmail: string;
  aiSuggestion?: {
    action: 'call' | 'whatsapp' | 'email';
    messageTemplate: string;
    timing: string;
  };
}

const IRDAI_TEMPLATES = {
  whatsapp: [
    {
      id: 'follow-up',
      name: 'Follow-up',
      template: 'Hi {name}, I hope you are doing well. I wanted to follow up on our previous discussion about insurance coverage. Would you like to schedule a call to discuss your requirements? Best regards, [Agent Name]'
    },
    {
      id: 'quote-ready',
      name: 'Quote Ready',
      template: 'Dear {name}, Your personalized insurance quote is ready. The premium starts from ₹{amount}/year with comprehensive coverage. Please note: This is an indicative quote and final premium may vary based on medical underwriting. Would you like to review the details?'
    },
    {
      id: 'policy-benefits',
      name: 'Policy Benefits',
      template: 'Hi {name}, Here are the key benefits of our term life policy: ✓ Life cover up to ₹5 crores ✓ Tax benefits under 80C ✓ Flexible premium payment options. Important: Insurance is subject to risk assessment and acceptance by the company. Shall we discuss further?'
    }
  ],
  email: [
    {
      id: 'detailed-proposal',
      name: 'Detailed Proposal',
      template: 'Subject: Your Insurance Proposal - {name}\n\nDear {name},\n\nThank you for your interest in our insurance products. Please find attached your personalized proposal.\n\nKey Features:\n- Coverage Amount: As discussed\n- Premium: Subject to medical underwriting\n- Policy Term: Flexible options available\n\nIMPORTANT DISCLAIMERS:\n- Insurance is subject to risk assessment\n- Premium rates may vary based on medical reports\n- Please read policy terms and conditions carefully\n\nFor any queries, please feel free to contact me.\n\nBest regards,\n[Agent Name]\n[License Number]\n[Contact Details]'
    },
    {
      id: 'appointment-confirmation',
      name: 'Appointment Confirmation',
      template: 'Subject: Appointment Confirmation - Insurance Consultation\n\nDear {name},\n\nThis is to confirm our appointment scheduled for {date} at {time}.\n\nDiscussion Points:\n- Your insurance requirements\n- Product recommendations\n- Premium calculations\n- Policy terms and conditions\n\nPlease bring:\n- Identity proof\n- Income documents\n- Medical reports (if any)\n\nNote: This meeting is for consultation purposes only. Final policy issuance is subject to company approval and medical underwriting.\n\nLooking forward to meeting you.\n\nBest regards,\n[Agent Name]'
    }
  ],
  sms: [
    {
      id: 'reminder',
      name: 'Appointment Reminder',
      template: 'Hi {name}, Reminder: Insurance consultation tomorrow at {time}. Please bring ID & income docs. Call me if you need to reschedule. Thanks, [Agent Name]'
    },
    {
      id: 'quote-sms',
      name: 'Quick Quote',
      template: 'Hi {name}, Your term life quote: ₹{amount}/year for ₹{coverage} cover. Subject to medical underwriting. Call me to discuss details. [Agent Name]'
    }
  ]
};

const COMPLIANCE_KEYWORDS = [
  'guaranteed returns',
  'investment assurance',
  'assured profit',
  'risk-free',
  'guaranteed income',
  'no risk',
  'sure returns',
  'fixed returns'
];

export default function CommunicationHub({ leadName, leadPhone, leadEmail, aiSuggestion }: CommunicationHubProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [complianceWarnings, setComplianceWarnings] = useState<string[]>([]);

  const checkCompliance = (message: string) => {
    const warnings: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    COMPLIANCE_KEYWORDS.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        warnings.push(`Avoid using "${keyword}" - not IRDAI compliant`);
      }
    });
    
    setComplianceWarnings(warnings);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = IRDAI_TEMPLATES[selectedChannel].find(t => t.id === templateId);
    if (template) {
      const personalizedMessage = template.template
        .replace('{name}', leadName)
        .replace('{amount}', '12,000')
        .replace('{coverage}', '50 lakh')
        .replace('{date}', 'Tomorrow')
        .replace('{time}', '3:00 PM');
      
      setCustomMessage(personalizedMessage);
      setSelectedTemplate(templateId);
      checkCompliance(personalizedMessage);
    }
  };

  const handleMessageChange = (message: string) => {
    setCustomMessage(message);
    checkCompliance(message);
  };

  const handleSend = () => {
    if (complianceWarnings.length > 0) {
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSend = async () => {
    try {
      // Step 1: Send to AI for compliance check
      const aiResponse = await fetch('/api/text-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: selectedChannel,
          leadId: 'current-lead',
          leadName: leadName,
          leadInfo: { phone: leadPhone, email: leadEmail },
          query: `Check compliance and send this ${selectedChannel} message: ${customMessage}`
        })
      });

      const aiResult = await aiResponse.json();
      
      // Step 2: Show AI compliance result
      alert(`AI Compliance Check:\n\n${aiResult.response}\n\nMessage Status: Compliant ✓\nSending via ${selectedChannel.toUpperCase()}...`);
      
      // Step 3: Simulate sending (dummy)
      setTimeout(() => {
        alert(`✅ ${selectedChannel.toUpperCase()} sent successfully to ${leadName}!\n\nMessage: "${customMessage}"\n\nThis is a demo - no actual message was sent.`);
        
        // Step 4: Navigate to AI page for further analysis
        window.location.href = `/ai?action=${selectedChannel}&leadId=current&leadName=${encodeURIComponent(leadName)}&message=${encodeURIComponent(customMessage)}&status=sent`;
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
    
    setShowConfirmation(false);
    setIsOpen(false);
    setCustomMessage('');
    setSelectedTemplate('');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="glass-effect rounded-xl p-4 w-full text-left hover:border-primary/50 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-primary-content font-medium text-sm">Communication Hub</h3>
            <p className="text-xs text-secondary-content">Send IRDAI-compliant messages</p>
          </div>
        </div>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-effect rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-primary-content font-medium text-sm">Communication Hub</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="w-6 h-6 rounded-full bg-dark-hover flex items-center justify-center hover:bg-red-500/20 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && (
        <div className="bg-primary/10 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white text-xs">AI</span>
            </div>
            <span className="text-primary font-medium text-xs">Recommended Action</span>
          </div>
          <p className="text-xs text-primary-content mb-2">
            <strong>{aiSuggestion.action.toUpperCase()}</strong> - {aiSuggestion.timing}
          </p>
          <button
            onClick={() => {
              setSelectedChannel(aiSuggestion.action as any);
              setCustomMessage(aiSuggestion.messageTemplate);
              checkCompliance(aiSuggestion.messageTemplate);
            }}
            className="text-xs text-primary hover:underline"
          >
            Use AI suggested message
          </button>
        </div>
      )}

      {/* Channel Selection */}
      <div className="flex gap-2 mb-4">
        {(['whatsapp', 'email', 'sms'] as const).map((channel) => (
          <button
            key={channel}
            onClick={() => setSelectedChannel(channel)}
            className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all ${
              selectedChannel === channel
                ? 'bg-primary text-white'
                : 'glass-effect text-secondary-content hover:border-primary/50'
            }`}
          >
            {channel === 'whatsapp' && <MessageCircle className="w-4 h-4 mx-auto mb-1" />}
            {channel === 'email' && <Mail className="w-4 h-4 mx-auto mb-1" />}
            {channel === 'sms' && <Phone className="w-4 h-4 mx-auto mb-1" />}
            {channel.charAt(0).toUpperCase() + channel.slice(1)}
          </button>
        ))}
      </div>

      {/* Template Selection */}
      <div className="mb-4">
        <label className="text-xs text-secondary-content mb-2 block">Pre-approved Templates</label>
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="w-full glass-effect rounded-lg px-3 py-2 text-xs text-primary-content outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">Select a template...</option>
          {IRDAI_TEMPLATES[selectedChannel].map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message Composer */}
      <div className="mb-4">
        <label className="text-xs text-secondary-content mb-2 block">Message</label>
        <textarea
          value={customMessage}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="w-full glass-effect rounded-lg px-3 py-2 text-xs text-primary-content outline-none focus:ring-2 focus:ring-primary/50 resize-none"
        />
      </div>

      {/* Compliance Warnings */}
      {complianceWarnings.length > 0 && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Compliance Issues</span>
          </div>
          {complianceWarnings.map((warning, index) => (
            <p key={index} className="text-xs text-red-300 mb-1">• {warning}</p>
          ))}
        </div>
      )}

      {/* Send Button */}
      <button
        onClick={handleSend}
        disabled={!customMessage.trim() || complianceWarnings.length > 0}
        className={`w-full p-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
          !customMessage.trim() || complianceWarnings.length > 0
            ? 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        <Send className="w-4 h-4" />
        Send Message
      </button>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-xl p-6 max-w-sm w-full"
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-primary-content font-medium mb-2">Confirm Send</h3>
                <p className="text-xs text-secondary-content mb-4">
                  Are you sure you want to send this {selectedChannel} message to {leadName}?
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Contact: {selectedChannel === 'email' ? leadEmail : leadPhone}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 glass-effect rounded-lg py-2 text-xs text-secondary-content hover:border-gray-400/50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmSend}
                    className="flex-1 bg-primary text-white rounded-lg py-2 text-xs hover:bg-primary-dark transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}