from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Store messages in memory (in production, use a database)
messages = []
interactions_file = '../src/data/mock/interactions.json'

@app.route('/api/messages/receive', methods=['POST'])
def receive_message():
    """
    Endpoint to receive new messages from leads
    Test with Postman:
    POST http://localhost:5001/api/messages/receive
    Body: {
        "leadId": "lead-1",
        "content": "Hi, I'm interested in term insurance. Can you help me?",
        "type": "whatsapp"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'leadId' not in data or 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'leadId and content are required'
            }), 400
        
        # Create new message
        new_message = {
            'id': f"msg-{int(datetime.now().timestamp() * 1000)}",
            'leadId': data['leadId'],
            'type': data.get('type', 'whatsapp'),
            'content': data['content'],
            'timestamp': datetime.now().isoformat() + 'Z',
            'sender': data.get('sender', 'lead'),
            'isNew': True
        }
        
        messages.append(new_message)
        
        # Add to interactions file
        add_to_interactions(new_message)
        
        return jsonify({
            'success': True,
            'message': new_message,
            'aiDrafts': generate_ai_drafts(new_message)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/messages/<lead_id>', methods=['GET'])
def get_messages(lead_id):
    """Get messages for a specific lead"""
    lead_messages = [msg for msg in messages if msg['leadId'] == lead_id]
    return jsonify({
        'success': True,
        'messages': lead_messages
    })

@app.route('/api/messages/mark-read', methods=['POST'])
def mark_messages_read():
    """Mark messages as read"""
    try:
        data = request.get_json()
        message_ids = data.get('messageIds', [])
        
        for msg in messages:
            if msg['id'] in message_ids:
                msg['isNew'] = False
        
        return jsonify({'success': True})
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def add_to_interactions(message):
    """Add message to interactions.json file"""
    try:
        # Read existing interactions
        interactions = []
        if os.path.exists(interactions_file):
            with open(interactions_file, 'r') as f:
                interactions = json.load(f)
        
        # Create new interaction
        new_interaction = {
            'id': message['id'],
            'leadId': message['leadId'],
            'type': message['type'],
            'summary': message['content'],
            'createdAt': message['timestamp'],
            'isNew': True
        }
        
        if message['type'] == 'call':
            new_interaction['duration'] = 300  # 5 minutes
        
        interactions.append(new_interaction)
        
        # Write back to file
        with open(interactions_file, 'w') as f:
            json.dump(interactions, f, indent=2)
            
    except Exception as e:
        print(f"Error adding to interactions: {e}")

def generate_ai_drafts(message):
    """Generate AI draft responses"""
    drafts = []
    
    # WhatsApp draft
    if message['type'] in ['whatsapp', 'sms']:
        drafts.append({
            'id': f"draft-wa-{int(datetime.now().timestamp() * 1000)}",
            'type': 'whatsapp',
            'content': f"Hi! Thanks for your message about insurance. I'd love to help you find the perfect policy. When would be a good time for a quick call? 😊",
            'tone': 'friendly',
            'confidence': 0.85,
            'reasoning': 'Friendly response that acknowledges their interest and suggests next steps.'
        })
    
    # Email draft
    drafts.append({
        'id': f"draft-email-{int(datetime.now().timestamp() * 1000)}",
        'type': 'email',
        'subject': 'Re: Your insurance inquiry',
        'content': f"""Dear Valued Customer,

Thank you for reaching out to us regarding your insurance needs.

Based on your inquiry, I believe we have excellent options that would suit your requirements perfectly. I would love to discuss these with you in detail.

Could we schedule a brief call at your convenience? I'm available today between 2:00 PM - 6:00 PM.

Best regards,
Your LIC Agent""",
        'tone': 'professional',
        'confidence': 0.90,
        'reasoning': 'Professional email response that provides structure while encouraging engagement.'
    })
    
    return drafts

@app.route('/api/ai/drafts', methods=['POST'])
def generate_drafts():
    """Generate AI drafts for communication"""
    try:
        data = request.get_json()
        lead_info = data.get('leadInfo', {})
        message_context = data.get('messageContext', '')
        
        drafts = []
        
        # Generate WhatsApp draft
        whatsapp_draft = {
            'id': f"draft-wa-{int(datetime.now().timestamp() * 1000)}",
            'type': 'whatsapp',
            'content': generate_whatsapp_content(lead_info, message_context),
            'tone': 'friendly',
            'confidence': 0.88,
            'reasoning': 'Personalized WhatsApp message based on lead profile and recent interactions.'
        }
        drafts.append(whatsapp_draft)
        
        # Generate Email draft
        email_draft = {
            'id': f"draft-email-{int(datetime.now().timestamp() * 1000)}",
            'type': 'email',
            'subject': generate_email_subject(lead_info, message_context),
            'content': generate_email_content(lead_info, message_context),
            'tone': 'professional',
            'confidence': 0.92,
            'reasoning': 'Comprehensive email with product recommendations based on lead analysis.'
        }
        drafts.append(email_draft)
        
        return jsonify({
            'success': True,
            'drafts': drafts
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def generate_whatsapp_content(lead_info, context):
    name = lead_info.get('name', 'there')
    products = lead_info.get('productInterest', ['life insurance'])
    
    templates = [
        f"Hi {name}! Hope you're doing well. I wanted to follow up on our discussion about {products[0] if products else 'insurance'}. I have some great options that might interest you. When would be a good time to chat? 😊",
        f"Hello {name}! I've been thinking about your insurance needs. Based on what we discussed, I think our {products[0] if products else 'Term Plan'} would be perfect for you. Can we schedule a quick 15-minute call?",
        f"Hi {name}! I have some exciting updates on the {products[0] if products else 'insurance plans'} we talked about. The rates are really competitive right now. Would you like me to send you a quick comparison?"
    ]
    
    return templates[0]  # Return first template for consistency

def generate_email_content(lead_info, context):
    name = lead_info.get('name', 'Valued Customer')
    products = lead_info.get('productInterest', ['Life Insurance'])
    age = lead_info.get('age', 35)
    
    return f"""Dear {name},

I hope this email finds you in good health and spirits.

Following our recent interactions, I wanted to share some personalized insurance recommendations that align perfectly with your needs:

**Recommended for You:**
1. {products[0] if products else 'LIC Term Assurance Plan'} - Ideal for your age group ({age} years)
2. Flexible premium payment options
3. Comprehensive coverage with additional riders

**Why This Works for You:**
- Affordable premiums starting from ₹500/month
- Tax benefits under Section 80C
- Financial security for your family

I would love to discuss these options in detail and answer any questions you might have. 

**Available for Call:**
- Today: 2:00 PM - 6:00 PM  
- Tomorrow: 10:00 AM - 4:00 PM

Please let me know what time works best for you.

Best regards,
[Your Name]
LIC Insurance Agent
📞 +91-XXXXXXXXXX
📧 agent@lic.co.in"""

def generate_email_subject(lead_info, context):
    name = lead_info.get('name', '')
    products = lead_info.get('productInterest', ['insurance'])
    
    subjects = [
        f"Perfect {products[0] if products else 'Insurance'} Plan for {name}",
        f"Exclusive {products[0] if products else 'Insurance'} Offers - Just for You!",
        f"Your Personalized Insurance Recommendations",
        f"Great News About Your {products[0] if products else 'Insurance'} Inquiry"
    ]
    
    return subjects[0]

if __name__ == '__main__':
    app.run(debug=True, port=5001)