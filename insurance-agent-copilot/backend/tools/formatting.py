"""
Formatting Tools
Functions to format and structure LLM responses
"""

from typing import Dict, List, Any

def format_response(data: Any, format_type: str = "auto") -> str:
    """
    Format data into a presentable text format
    
    Args:
        data: Data to format (dict, list, or string)
        format_type: Type of formatting (auto, table, list, card)
        
    Returns:
        Formatted string
    """
    if isinstance(data, str):
        return data
    
    if isinstance(data, list):
        if not data:
            return "No items found."
        
        # Check if it's a list of leads
        if all(isinstance(item, dict) and 'name' in item and 'temperature' in item for item in data):
            return format_leads_list(data)
        
        # Check if it's a list of tasks
        if all(isinstance(item, dict) and 'title' in item and 'status' in item for item in data):
            return format_tasks_list(data)
        
        # Check if it's a list of templates
        if all(isinstance(item, dict) and 'content' in item for item in data):
            return format_templates_list(data)
        
        # Generic list formatting
        result = []
        for i, item in enumerate(data, 1):
            result.append(f"{i}. {format_response(item, format_type)}")
        return "\n".join(result)
    
    if isinstance(data, dict):
        # Check if it's a task
        if 'title' in data and 'status' in data and 'priority' in data:
            return format_task_card(data)
        
        # Check if it's a lead
        if 'name' in data and 'temperature' in data:
            return format_lead_card(data)
        
        # Check if it's a compliance result
        if 'is_compliant' in data:
            return format_compliance_result(data)
        
        # Generic dict formatting
        result = []
        for key, value in data.items():
            result.append(f"{key.replace('_', ' ').title()}: {value}")
        return "\n".join(result)
    
    return str(data)

def format_leads_list(leads: List[Dict]) -> str:
    """Format a list of leads"""
    if not leads:
        return "No leads found."
    
    result = [f"Found {len(leads)} lead(s):\n"]
    
    for i, lead in enumerate(leads, 1):
        temp_label = lead.get('temperature', 'unknown').upper()
        result.append(f"{i}. {lead.get('name', 'Unknown')} ({temp_label})")
        result.append(f"   Phone: {lead.get('phone', 'N/A')}")
        result.append(f"   Email: {lead.get('email', 'N/A')}")
        result.append(f"   Location: {lead.get('location', 'N/A')}")
        
        if lead.get('productInterest'):
            interests = lead['productInterest']
            if isinstance(interests, list):
                result.append(f"   Interest: {', '.join(interests)}")
            else:
                result.append(f"   Interest: {interests}")
        
        if lead.get('premium'):
            result.append(f"   Premium: ₹{lead['premium']:,}")
        
        if lead.get('conversionProbability'):
            result.append(f"   Conversion: {lead['conversionProbability']}%")
        
        result.append("")
    
    return "\n".join(result)

def format_lead_card(lead: Dict) -> str:
    """Format a single lead"""
    name = lead.get('name', 'Unknown')
    temp = lead.get('temperature', 'unknown').upper()
    
    result = [f"{name} - {temp} LEAD\n"]
    result.append(f"Contact:")
    result.append(f"  Phone: {lead.get('phone', 'N/A')}")
    result.append(f"  Email: {lead.get('email', 'N/A')}")
    result.append(f"  Location: {lead.get('location', 'N/A')}")
    
    if lead.get('age'):
        result.append(f"  Age: {lead['age']}")
    
    result.append(f"\nDetails:")
    
    if lead.get('productInterest'):
        interests = lead['productInterest']
        if isinstance(interests, list):
            result.append(f"  Interest: {', '.join(interests)}")
        else:
            result.append(f"  Interest: {interests}")
    
    if lead.get('premium'):
        result.append(f"  Premium: ₹{lead['premium']:,}")
    
    if lead.get('conversionProbability'):
        result.append(f"  Conversion Probability: {lead['conversionProbability']}%")
    
    if lead.get('policyNumber'):
        result.append(f"  Policy Number: {lead['policyNumber']}")
    
    if lead.get('lastInteractionSummary'):
        result.append(f"\nLast Interaction ({lead.get('lastInteractionDate', 'N/A')}):")
        result.append(f"  {lead['lastInteractionSummary']}")
    
    if lead.get('tags'):
        tags = lead['tags']
        if isinstance(tags, list):
            result.append(f"\nTags: {', '.join(tags)}")
        else:
            result.append(f"\nTags: {tags}")
    
    return "\n".join(result)

def format_templates_list(templates: List[Dict]) -> str:
    """Format a list of templates"""
    if not templates:
        return "No templates found."
    
    result = [f"Found {len(templates)} template(s):\n"]
    
    for template in templates:
        result.append(f"• {template.get('name', 'Unnamed Template')}")
        result.append(f"  Category: {template.get('category', 'General')}")
        result.append(f"  Language: {template.get('language', 'English')}")
        
        content = template.get('content', '')
        if len(content) > 100:
            result.append(f"  Preview: {content[:100]}...")
        else:
            result.append(f"  Content: {content}")
        result.append("")
    
    return "\n".join(result)

def format_compliance_result(result: Dict) -> str:
    """Format compliance check result"""
    output = []
    
    if result.get('is_compliant'):
        output.append("COMPLIANT: This content follows IRDAI guidelines.")
    else:
        output.append("NON-COMPLIANT: This content violates IRDAI guidelines.\n")
        output.append("Issues found:")
        
        for violation in result.get('violations', []):
            output.append(f"\n  Problem: \"{violation.get('phrase', '')}\"")
            output.append(f"  Use instead: \"{violation.get('alternative', '')}\"")
        
        if result.get('safe_alternative'):
            output.append(f"\nSuggested compliant version:")
            output.append(result['safe_alternative'])
    
    return "\n".join(output)

def format_interactions_list(interactions: List[Dict]) -> str:
    """Format a list of interactions"""
    if not interactions:
        return "No interactions found."
    
    result = [f"Found {len(interactions)} interaction(s):\n"]
    
    for interaction in interactions:
        result.append(f"• {interaction.get('type', 'Unknown').title()}")
        result.append(f"  Date: {interaction.get('createdAt', 'N/A')}")
        result.append(f"  Content: {interaction.get('content', 'N/A')}")
        if 'sentiment' in interaction:
            sentiment_label = "Positive" if interaction['sentiment'] > 0.6 else "Negative" if interaction['sentiment'] < 0.4 else "Neutral"
            result.append(f"  Sentiment: {sentiment_label}")
        result.append("")
    
    return "\n".join(result)

def format_tasks_list(tasks: List[Dict]) -> str:
    """Format a list of tasks"""
    if not tasks:
        return "No tasks found."
    
    result = [f"Found {len(tasks)} task(s):\n"]
    
    for i, task in enumerate(tasks, 1):
        priority = task.get('priority', 'medium').upper()
        status = task.get('status', 'pending').upper()
        
        result.append(f"{i}. {task.get('title', 'Untitled Task')}")
        result.append(f"   Priority: {priority} | Status: {status}")
        result.append(f"   Lead: {task.get('leadName', 'N/A')}")
        result.append(f"   Due: {task.get('dueDate', 'N/A')}")
        
        if task.get('description'):
            result.append(f"   Description: {task['description']}")
        
        if task.get('tags'):
            tags = task['tags']
            if isinstance(tags, list):
                result.append(f"   Tags: {', '.join(tags)}")
        
        result.append("")
    
    return "\n".join(result)

def format_task_card(task: Dict) -> str:
    """Format a single task"""
    result = [f"TASK: {task.get('title', 'Untitled')}\n"]
    
    result.append(f"Status: {task.get('status', 'pending').upper()}")
    result.append(f"Priority: {task.get('priority', 'medium').upper()}")
    result.append(f"Due Date: {task.get('dueDate', 'N/A')}")
    
    if task.get('leadName'):
        result.append(f"Related Lead: {task['leadName']} (ID: {task.get('leadId', 'N/A')})")
    
    if task.get('description'):
        result.append(f"\nDescription:")
        result.append(f"  {task['description']}")
    
    if task.get('assignedTo'):
        result.append(f"\nAssigned To: {task['assignedTo']}")
    
    if task.get('completedAt'):
        result.append(f"Completed At: {task['completedAt']}")
    
    if task.get('tags'):
        tags = task['tags']
        if isinstance(tags, list):
            result.append(f"\nTags: {', '.join(tags)}")
    
    return "\n".join(result)
