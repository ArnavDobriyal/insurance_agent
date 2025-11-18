// Message service to handle new message detection and AI integration
export interface NewMessage {
  id: string;
  leadId: string;
  type: 'whatsapp' | 'email' | 'sms' | 'call';
  content: string;
  timestamp: string;
  sender: 'lead' | 'agent';
  isNew?: boolean;
}

export interface AIMessageDraft {
  id: string;
  type: 'whatsapp' | 'email' | 'sms';
  subject?: string;
  content: string;
  tone: 'professional' | 'friendly' | 'urgent' | 'follow-up';
  confidence: number;
  reasoning: string;
}

class MessageService {
  private newMessages: NewMessage[] = [];
  private messageListeners: ((message: NewMessage) => void)[] = [];

  // Simulate receiving a new message (this would be replaced with actual API calls)
  simulateNewMessage(leadId: string, content: string, type: 'whatsapp' | 'email' | 'sms' = 'whatsapp') {
    const newMessage: NewMessage = {
      id: `msg-${Date.now()}`,
      leadId,
      type,
      content,
      timestamp: new Date().toISOString(),
      sender: 'lead',
      isNew: true
    };

    this.newMessages.push(newMessage);
    this.notifyListeners(newMessage);
    
    // Add to interactions data
    this.addToInteractions(newMessage);
    
    return newMessage;
  }

  // Add message listener
  addMessageListener(callback: (message: NewMessage) => void) {
    this.messageListeners.push(callback);
  }

  // Remove message listener
  removeMessageListener(callback: (message: NewMessage) => void) {
    this.messageListeners = this.messageListeners.filter(listener => listener !== callback);
  }

  // Notify all listeners
  private notifyListeners(message: NewMessage) {
    this.messageListeners.forEach(listener => listener(message));
  }

  // Add message to interactions data (simulate database update)
  private addToInteractions(message: NewMessage) {
    const interaction = {
      id: message.id,
      leadId: message.leadId,
      type: message.type,
      summary: message.content,
      createdAt: message.timestamp,
      duration: message.type === 'call' ? 300 : undefined, // 5 min for calls
      isNew: true
    };

    // In a real app, this would be an API call
    console.log('New interaction added:', interaction);
  }

  // Generate AI message drafts based on new message
  async generateAIDrafts(newMessage: NewMessage, leadInfo: any): Promise<AIMessageDraft[]> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const drafts: AIMessageDraft[] = [];

    // Generate WhatsApp draft
    if (newMessage.type === 'whatsapp' || newMessage.type === 'sms') {
      drafts.push({
        id: `draft-wa-${Date.now()}`,
        type: 'whatsapp',
        content: this.generateWhatsAppDraft(newMessage, leadInfo),
        tone: 'friendly',
        confidence: 0.85,
        reasoning: 'Based on the lead\'s recent message and their interest in term insurance, this response addresses their query while maintaining engagement.'
      });
    }

    // Generate Email draft
    drafts.push({
      id: `draft-email-${Date.now()}`,
      type: 'email',
      subject: this.generateEmailSubject(newMessage, leadInfo),
      content: this.generateEmailDraft(newMessage, leadInfo),
      tone: 'professional',
      confidence: 0.90,
      reasoning: 'Professional email response that provides detailed information while encouraging next steps.'
    });

    return drafts;
  }

  private generateWhatsAppDraft(message: NewMessage, leadInfo: any): string {
    const templates = [
      `Hi ${leadInfo.name}! Thanks for your message. I understand you're interested in ${leadInfo.productInterest?.[0] || 'life insurance'}. Let me help you with that. When would be a good time for a quick call to discuss your requirements? 😊`,
      `Hello ${leadInfo.name}! I received your message about ${this.extractKeywords(message.content)}. Based on your profile, I think our ${leadInfo.productInterest?.[0] || 'Term Assurance Plan'} would be perfect for you. Can we schedule a 15-minute call today?`,
      `Hi ${leadInfo.name}! Great to hear from you! I see you're asking about ${this.extractKeywords(message.content)}. I have some excellent options that match your needs. Would you prefer a call or should I send you the details via WhatsApp?`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generateEmailDraft(message: NewMessage, leadInfo: any): string {
    return `Dear ${leadInfo.name},

Thank you for reaching out to us regarding ${this.extractKeywords(message.content)}.

Based on our previous conversations and your interest in ${leadInfo.productInterest?.join(', ') || 'life insurance'}, I believe we have some excellent options that would suit your needs perfectly.

Here's what I recommend for your consideration:

1. ${leadInfo.productInterest?.[0] || 'LIC\'s Term Assurance Plan'} - Provides comprehensive coverage with affordable premiums
2. Flexible premium payment options to suit your budget
3. Additional riders for enhanced protection

I would love to discuss these options with you in detail. Could we schedule a brief call at your convenience? I'm available:
- Today: 2:00 PM - 6:00 PM
- Tomorrow: 10:00 AM - 4:00 PM

Please let me know what works best for you.

Best regards,
[Your Name]
LIC Agent
Phone: [Your Phone]
Email: [Your Email]`;
  }

  private generateEmailSubject(message: NewMessage, leadInfo: any): string {
    const subjects = [
      `Re: Your inquiry about ${leadInfo.productInterest?.[0] || 'Life Insurance'}`,
      `Perfect insurance solutions for ${leadInfo.name}`,
      `Following up on your ${this.extractKeywords(message.content)} query`,
      `Customized insurance options for your needs`
    ];
    
    return subjects[Math.floor(Math.random() * subjects.length)];
  }

  private extractKeywords(content: string): string {
    const keywords = ['insurance', 'policy', 'premium', 'coverage', 'term', 'endowment', 'money back'];
    const found = keywords.find(keyword => content.toLowerCase().includes(keyword));
    return found || 'insurance inquiry';
  }

  // Get new messages for a lead
  getNewMessages(leadId: string): NewMessage[] {
    return this.newMessages.filter(msg => msg.leadId === leadId && msg.isNew);
  }

  // Mark messages as read
  markAsRead(messageIds: string[]) {
    this.newMessages = this.newMessages.map(msg => 
      messageIds.includes(msg.id) ? { ...msg, isNew: false } : msg
    );
  }

  // Simulate external message via API (for testing with Postman)
  static async receiveExternalMessage(leadId: string, content: string, type: 'whatsapp' | 'email' | 'sms' = 'whatsapp') {
    const messageService = new MessageService();
    return messageService.simulateNewMessage(leadId, content, type);
  }
}

export const messageService = new MessageService();
export default MessageService;