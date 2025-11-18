// API endpoints for message handling
import { messageService, NewMessage } from '../services/messageService';

export interface MessageRequest {
  leadId: string;
  content: string;
  type?: 'whatsapp' | 'email' | 'sms';
  sender?: 'lead' | 'agent';
}

export interface MessageResponse {
  success: boolean;
  message?: NewMessage;
  error?: string;
}

// Simulate API endpoint for receiving new messages
export const receiveMessage = async (request: MessageRequest): Promise<MessageResponse> => {
  try {
    if (!request.leadId || !request.content) {
      return {
        success: false,
        error: 'leadId and content are required'
      };
    }

    const newMessage = messageService.simulateNewMessage(
      request.leadId,
      request.content,
      request.type || 'whatsapp'
    );

    return {
      success: true,
      message: newMessage
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Get messages for a lead
export const getMessages = async (leadId: string): Promise<NewMessage[]> => {
  return messageService.getNewMessages(leadId);
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
  messageService.markAsRead(messageIds);
};

// For testing purposes - expose a global function
if (typeof window !== 'undefined') {
  (window as any).testReceiveMessage = receiveMessage;
}