"""
Action Tools
Functions to perform actions like navigation, messaging, etc.
"""

from typing import Dict, Optional

def open_lead_profile(lead_id: str) -> Dict:
    """
    Open a lead's profile page
    
    Args:
        lead_id: Lead ID
        
    Returns:
        Action instruction
    """
    return {
        "action": "navigate",
        "type": "lead_profile",
        "target": f"/leads/{lead_id}",
        "leadId": lead_id,
        "message": f"Opening profile for lead {lead_id}"
    }

def open_maps_for_lead(lead_id: str, lead_name: str, location: str) -> Dict:
    """
    Open maps/navigation to a lead's location
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        location: Lead location
        
    Returns:
        Action instruction
    """
    return {
        "action": "open_maps",
        "type": "navigation",
        "leadId": lead_id,
        "leadName": lead_name,
        "location": location,
        "message": f"Opening maps for {lead_name} at {location}"
    }

def send_message_to_lead(lead_id: str, lead_name: str, phone: str, message_type: str = "whatsapp", lead_data: Dict = None) -> str:
    """
    Generate a draft message for a lead (WhatsApp, SMS, Email)
    Returns the draft message as text for user to review and confirm
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        phone: Lead phone number
        message_type: Type of message (whatsapp, sms, email)
        lead_data: Full lead data for context
        
    Returns:
        Draft message text for user to review
    """
    # Generate contextual message based on lead profile
    if lead_data:
        product_interest = lead_data.get('productInterest', [])
        temperature = lead_data.get('temperature', 'warm')
        last_interaction = lead_data.get('lastInteractionSummary', '')
        
        # Generate appropriate message
        if 'renewal-due' in lead_data.get('tags', []):
            message_content = f"Hi {lead_name}, your policy is due for renewal. Would you like to discuss your options? - Your Insurance Agent"
        elif temperature == 'hot' and product_interest:
            products = ', '.join(product_interest[:2])
            message_content = f"Hi {lead_name}, following up on your interest in {products}. When would be a good time to discuss? - Your Insurance Agent"
        elif 'follow-up' in lead_data.get('tags', []):
            message_content = f"Hi {lead_name}, just checking in. Do you have any questions about the policy options we discussed? - Your Insurance Agent"
        else:
            message_content = f"Hi {lead_name}, hope you're doing well. I wanted to reach out regarding insurance options that might interest you. - Your Insurance Agent"
    else:
        message_content = f"Hi {lead_name}, reaching out to discuss insurance options. - Your Insurance Agent"
    
    # Return draft message for user to review
    message_type_label = message_type.upper() if message_type != "whatsapp" else "WhatsApp"
    return f"""Draft {message_type_label} message for {lead_name} ({phone}):

"{message_content}"

Would you like me to send this message? (Reply 'yes' to confirm)"""

def confirm_send_message(lead_id: str, lead_name: str, message_type: str = "whatsapp") -> str:
    """
    Confirm that a message has been sent (dummy confirmation)
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        message_type: Type of message (whatsapp, sms, email)
        
    Returns:
        Confirmation message
    """
    message_type_label = message_type.upper() if message_type != "whatsapp" else "WhatsApp"
    return f"✓ {message_type_label} message sent to {lead_name}!"

def call_lead(lead_id: str, lead_name: str, phone: str) -> Dict:
    """
    Initiate a call to a lead
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        phone: Lead phone number
        
    Returns:
        Action instruction
    """
    return {
        "action": "call",
        "type": "phone_call",
        "leadId": lead_id,
        "leadName": lead_name,
        "phone": phone,
        "message": f"Initiating call to {lead_name} at {phone}"
    }

def schedule_meeting(lead_id: str, lead_name: str, date: Optional[str] = None) -> Dict:
    """
    Schedule a meeting with a lead
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        date: Preferred date (optional)
        
    Returns:
        Action instruction
    """
    return {
        "action": "schedule_meeting",
        "type": "calendar",
        "leadId": lead_id,
        "leadName": lead_name,
        "date": date,
        "message": f"Opening calendar to schedule meeting with {lead_name}"
    }

def create_task_for_lead(lead_id: str, lead_name: str, task_title: str, priority: str = "medium") -> Dict:
    """
    Create a task for a lead
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        task_title: Task title
        priority: Task priority (low, medium, high, urgent)
        
    Returns:
        Action instruction
    """
    return {
        "action": "create_task",
        "type": "task",
        "leadId": lead_id,
        "leadName": lead_name,
        "taskTitle": task_title,
        "priority": priority,
        "message": f"Creating {priority} priority task: {task_title} for {lead_name}"
    }

def send_template_to_lead(lead_id: str, lead_name: str, template_id: str, template_name: str) -> Dict:
    """
    Send a template message to a lead
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        template_id: Template ID
        template_name: Template name
        
    Returns:
        Action instruction
    """
    return {
        "action": "send_template",
        "type": "template_message",
        "leadId": lead_id,
        "leadName": lead_name,
        "templateId": template_id,
        "templateName": template_name,
        "message": f"Sending '{template_name}' template to {lead_name}"
    }

def show_create_lead_form(prefilled_data: Optional[Dict] = None) -> Dict:
    """
    Show the create lead form
    
    Args:
        prefilled_data: Optional pre-filled data for the form
        
    Returns:
        Action instruction to show form
    """
    return {
        "action": "show_form",
        "type": "create_lead",
        "formType": "lead",
        "prefilledData": prefilled_data or {},
        "message": "Opening form to create a new lead"
    }

def show_create_task_form(lead_id: str = None, lead_name: str = None, prefilled_data: Optional[Dict] = None) -> Dict:
    """
    Show the create task form
    
    Args:
        lead_id: Optional lead ID to associate task with
        lead_name: Optional lead name
        prefilled_data: Optional pre-filled data for the form
        
    Returns:
        Action instruction to show form
    """
    data = prefilled_data or {}
    if lead_id:
        data['leadId'] = lead_id
    if lead_name:
        data['leadName'] = lead_name
    
    return {
        "action": "show_form",
        "type": "create_task",
        "formType": "task",
        "prefilledData": data,
        "message": f"Opening form to create a new task{' for ' + lead_name if lead_name else ''}"
    }

def show_edit_lead_form(lead_id: str, lead_data: Dict) -> Dict:
    """
    Show the edit lead form
    
    Args:
        lead_id: Lead ID
        lead_data: Current lead data
        
    Returns:
        Action instruction to show form
    """
    return {
        "action": "show_form",
        "type": "edit_lead",
        "formType": "lead",
        "leadId": lead_id,
        "prefilledData": lead_data,
        "message": f"Opening form to edit lead {lead_data.get('name', lead_id)}"
    }
