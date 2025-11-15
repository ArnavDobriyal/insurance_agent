"""
Insurance Agent Copilot - LangChain Backend
Single autonomous agent with tool-based architecture using LangChain + Gemini
"""

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# ------------------------------
# Load environment
# ------------------------------
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# ------------------------------
# Import LangChain & LangGraph
# ------------------------------
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from langgraph.prebuilt import create_react_agent

# ------------------------------
# Import your tool functions
# ------------------------------
from tools.leads import (
    get_lead, search_leads, update_lead, create_lead, get_all_leads,
    filter_leads_by_tag, get_renewal_leads, get_followup_leads, get_high_value_leads,
    get_leads_by_assigned_user, get_leads_by_location, get_leads_with_policy
)
from tools.compliance import check_compliance, get_safe_alternative, validate_message
from tools.templates import get_all_templates, get_template, search_templates
from tools.interactions import get_lead_interactions, add_interaction, analyze_sentiment
from tools.tasks import (
    get_all_tasks, get_task, get_tasks_by_lead, search_tasks,
    get_tasks_due_today, get_overdue_tasks, get_urgent_tasks
)
from tools.actions import (
    open_lead_profile, open_maps_for_lead, send_message_to_lead, confirm_send_message,
    call_lead, schedule_meeting, create_task_for_lead, send_template_to_lead,
    show_create_lead_form, show_create_task_form, show_edit_lead_form
)
from tools.notifications import (
    get_all_notifications, get_unread_notifications, get_unread_count,
    get_notifications_by_lead, get_high_priority_notifications
)
from tools.audit import (
    get_all_audit_logs, get_audit_logs_by_lead, get_audit_logs_by_action, get_ai_actions
)
from tools.analytics import (
    get_conversion_stats, get_revenue_forecast, get_lead_distribution,
    get_top_leads, get_performance_metrics
)
from tools.daily_summary import get_daily_summary, get_todays_briefing, create_tasks_from_action_items
from tools.formatting import format_response, format_leads_list, format_compliance_result

# ------------------------------
# Configure FastAPI
# ------------------------------
app = FastAPI(title="Insurance Agent Copilot", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------
# Define LangChain Tools using @tool decorator
# ------------------------------
@tool
def tool_get_lead(lead_id: str) -> dict:
    """Get a lead by ID. Use this when user asks for a specific lead."""
    return get_lead(lead_id)

@tool
def tool_search_leads(temperature: str = None, search_term: str = None) -> list:
    """Search leads by temperature (hot/warm/cold) or search term. Use this when user asks to find or show leads."""
    return search_leads(temperature=temperature, search_term=search_term)

@tool
def tool_get_all_leads() -> list:
    """Get all leads. Use this when user asks to see all leads."""
    return get_all_leads()

@tool
def tool_check_compliance(content: str) -> dict:
    """Check if content is IRDAI compliant. Use this when user asks about compliance."""
    return check_compliance(content)

@tool
def tool_get_all_templates() -> list:
    """Get all message templates. Use this when user asks for templates."""
    return get_all_templates()

@tool
def tool_get_template(template_id: str) -> dict:
    """Get a specific template by ID."""
    return get_template(template_id)

@tool
def tool_search_templates(category: str = None, keyword: str = None) -> list:
    """Search templates by category or keyword."""
    return search_templates(category=category, keyword=keyword)

@tool
def tool_get_lead_interactions(lead_id: str) -> list:
    """Get all interactions for a lead."""
    return get_lead_interactions(lead_id)

@tool
def tool_analyze_sentiment(lead_id: str) -> dict:
    """Analyze sentiment of a lead's interactions."""
    return analyze_sentiment(lead_id)

@tool
def tool_get_lead_fields() -> dict:
    """
    Get information about what fields are needed to create a new lead.
    Use this when user asks "what do I need to add a lead" or wants to create a lead.
    """
    return {
        "required_fields": {
            "name": "Lead's full name",
            "phone": "Phone number with country code (e.g., +91-9876543210)"
        },
        "optional_fields": {
            "email": "Email address",
            "location": "City, State (e.g., Mumbai, Maharashtra)",
            "age": "Age in years",
            "address": "Full address",
            "product_interest": "Comma-separated products (e.g., Term Life, Health, Investment)",
            "premium": "Expected premium amount in rupees",
            "notes": "Initial notes or comments about the lead"
        },
        "example": "name='Rajesh Kumar', phone='+91-9876543210', email='rajesh@example.com', location='Mumbai, Maharashtra', product_interest='Term Life, Health', premium=25000"
    }

@tool
def tool_create_lead(
    name: str, 
    phone: str, 
    email: str = "", 
    location: str = "",
    age: int = None,
    address: str = "",
    product_interest: str = "",
    premium: int = 0,
    notes: str = ""
) -> dict:
    """
    Create a new lead. Ask user for required fields if not provided.
    
    REQUIRED: name, phone
    OPTIONAL: email, location, age, address, product_interest (comma-separated), premium, notes
    
    Example: name="John Doe", phone="+91-9876543210", location="Mumbai", product_interest="Term Life, Health"
    """
    return create_lead(name, phone, email, location, age, address, product_interest, premium, notes)

@tool
def tool_update_lead(lead_id: str, **updates) -> dict:
    """
    Update a lead's information. Can update: temperature, tags, notes, productInterest, premium, email, phone, location.
    
    Example: tool_update_lead(lead_id="lead-1", temperature="hot", notes="Very interested")
    """
    return update_lead(lead_id, **updates)

@tool
def tool_get_task_fields() -> dict:
    """
    Get information about what fields are needed to create a new task.
    Use this when user asks about creating a task.
    """
    return {
        "required_fields": {
            "title": "Task title/description",
            "lead_id": "ID of the lead this task is for",
            "lead_name": "Name of the lead"
        },
        "optional_fields": {
            "description": "Detailed task description",
            "priority": "Priority level: low, medium, high, urgent (default: medium)",
            "due_date": "Due date in YYYY-MM-DD format",
            "tags": "Comma-separated tags (e.g., follow-up, documentation)"
        },
        "example": "title='Follow up with lead', lead_id='lead-1', lead_name='Priya Sharma', priority='high', due_date='2024-11-20'"
    }

@tool
def tool_format_data(data: str, format_type: str = "auto") -> str:
    """
    Format data into a clean, presentable text format.
    Use this tool AFTER getting data to make it readable.
    
    Args:
        data: JSON string of data to format
        format_type: Type of formatting (auto, table, list, card)
    
    Returns:
        Formatted, human-readable text
    """
    import json
    try:
        parsed_data = json.loads(data) if isinstance(data, str) else data
        return format_response(parsed_data, format_type)
    except:
        return str(data)

@tool
def tool_summarize_content(content: str, summary_type: str = "brief") -> str:
    """
    Use LLM to summarize content intelligently.
    
    Args:
        content: Content to summarize
        summary_type: Type of summary (brief, detailed, bullet_points)
    
    Returns:
        Summarized content
    """
    from langchain_google_genai import ChatGoogleGenerativeAI
    
    summarizer = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    
    if summary_type == "brief":
        prompt = f"Provide a brief 2-3 sentence summary of this content:\n\n{content}"
    elif summary_type == "detailed":
        prompt = f"Provide a detailed summary with key points of this content:\n\n{content}"
    else:  # bullet_points
        prompt = f"Summarize this content as bullet points:\n\n{content}"
    
    response = summarizer.invoke(prompt)
    return response.content

@tool
def tool_get_all_tasks(status: str = None, priority: str = None) -> list:
    """Get all tasks, optionally filtered by status (pending/in-progress/completed) or priority (low/medium/high/urgent)."""
    return get_all_tasks(status=status, priority=priority)

@tool
def tool_get_task(task_id: str) -> dict:
    """Get a specific task by ID."""
    return get_task(task_id)

@tool
def tool_get_tasks_by_lead(lead_id: str) -> list:
    """Get all tasks for a specific lead."""
    return get_tasks_by_lead(lead_id)

@tool
def tool_search_tasks(search_term: str) -> list:
    """Search tasks by title, description, or lead name."""
    return search_tasks(search_term)

@tool
def tool_get_tasks_due_today() -> list:
    """Get tasks due today."""
    return get_tasks_due_today()

@tool
def tool_get_overdue_tasks() -> list:
    """Get overdue tasks."""
    return get_overdue_tasks()

@tool
def tool_get_urgent_tasks() -> list:
    """Get urgent priority tasks."""
    return get_urgent_tasks()

@tool
def tool_open_lead_profile(lead_id: str) -> dict:
    """Open a lead's profile page to view full details."""
    return open_lead_profile(lead_id)

@tool
def tool_open_maps(lead_id: str, lead_name: str, location: str) -> dict:
    """
    Open maps/navigation to a lead's location.
    Use this when user asks "where does X live", "show me X's location", "X location", etc.
    """
    return open_maps_for_lead(lead_id, lead_name, location)

@tool
def tool_send_message(lead_id: str, lead_name: str, phone: str, message_type: str = "whatsapp", lead_data: str = None) -> str:
    """
    Generate a draft message for a lead via WhatsApp, SMS, or Email.
    This shows the user a draft message and asks for confirmation.
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        phone: Lead phone number
        message_type: Type of message (whatsapp, sms, email)
        lead_data: JSON string of full lead data for generating contextual message
    
    IMPORTANT: 
    - Always pass lead_data as JSON string to generate contextual messages
    - This returns a DRAFT message for user to review
    - User must confirm with "yes" before message is "sent"
    
    Example: lead_data='{"productInterest": ["Term Life"], "temperature": "hot", "tags": ["follow-up"]}'
    """
    import json
    data = json.loads(lead_data) if lead_data else None
    return send_message_to_lead(lead_id, lead_name, phone, message_type, data)

@tool
def tool_confirm_send_message(lead_id: str, lead_name: str, message_type: str = "whatsapp") -> str:
    """
    Confirm that a message has been sent to a lead.
    Use this ONLY after user confirms "yes" to send the draft message.
    
    Args:
        lead_id: Lead ID
        lead_name: Lead name
        message_type: Type of message (whatsapp, sms, email)
    
    Returns:
        Confirmation that message was sent
    """
    return confirm_send_message(lead_id, lead_name, message_type)

@tool
def tool_call_lead(lead_id: str, lead_name: str, phone: str) -> dict:
    """Initiate a phone call to a lead."""
    return call_lead(lead_id, lead_name, phone)

@tool
def tool_schedule_meeting(lead_id: str, lead_name: str, date: str = None) -> dict:
    """Schedule a meeting with a lead."""
    return schedule_meeting(lead_id, lead_name, date)

@tool
def tool_create_task(lead_id: str, lead_name: str, task_title: str, priority: str = "medium") -> dict:
    """Create a task for a lead."""
    return create_task_for_lead(lead_id, lead_name, task_title, priority)

@tool
def tool_send_template(lead_id: str, lead_name: str, template_id: str, template_name: str) -> dict:
    """Send a template message to a lead."""
    return send_template_to_lead(lead_id, lead_name, template_id, template_name)

@tool
def tool_show_create_lead_form(prefilled_data: str = None) -> dict:
    """
    Show a form to create a new lead. Use this when user wants to add a lead through UI.
    Pass prefilled_data as JSON string if you have some info already.
    """
    import json
    data = json.loads(prefilled_data) if prefilled_data else None
    return show_create_lead_form(data)

@tool
def tool_show_create_task_form(lead_id: str = None, lead_name: str = None) -> dict:
    """
    Show a form to create a new task. Use this when user wants to create a task through UI.
    """
    return show_create_task_form(lead_id, lead_name)

@tool
def tool_show_edit_lead_form(lead_id: str, lead_data: str) -> dict:
    """
    Show a form to edit a lead. Pass lead_data as JSON string.
    """
    import json
    data = json.loads(lead_data)
    return show_edit_lead_form(lead_id, data)

# Enhanced Lead Tools
@tool
def tool_filter_leads_by_tag(tag: str) -> list:
    """Filter leads by tag (follow-up, renewal-due, high-value, interested, urgent, etc.)."""
    return filter_leads_by_tag(tag)

@tool
def tool_get_renewal_leads() -> list:
    """Get leads with renewals due. Use this when user asks 'show renewals due'."""
    return get_renewal_leads()

@tool
def tool_get_followup_leads() -> list:
    """Get leads needing follow-up."""
    return get_followup_leads()

@tool
def tool_get_high_value_leads() -> list:
    """Get high-value leads."""
    return get_high_value_leads()

@tool
def tool_get_leads_by_location(location: str) -> list:
    """Get leads in a specific location."""
    return get_leads_by_location(location)

@tool
def tool_get_leads_with_policy() -> list:
    """Get leads with existing policies."""
    return get_leads_with_policy()

# Notification Tools
@tool
def tool_get_notifications(filter_type: str = None) -> list:
    """Get notifications, optionally filtered by type (renewal, followup, compliance, missed-call)."""
    return get_all_notifications(filter_type)

@tool
def tool_get_unread_notifications() -> list:
    """Get unread notifications."""
    return get_unread_notifications()

@tool
def tool_get_unread_count() -> int:
    """Get count of unread notifications."""
    return get_unread_count()

@tool
def tool_get_high_priority_notifications() -> list:
    """Get high priority notifications."""
    return get_high_priority_notifications()

# Audit Log Tools
@tool
def tool_get_audit_logs(limit: int = 50) -> list:
    """Get audit logs."""
    return get_all_audit_logs(limit)

@tool
def tool_get_audit_logs_by_lead(lead_id: str) -> list:
    """Get audit logs for a specific lead."""
    return get_audit_logs_by_lead(lead_id)

# Analytics Tools
@tool
def tool_get_conversion_stats() -> dict:
    """Get conversion probability statistics."""
    return get_conversion_stats()

@tool
def tool_get_revenue_forecast() -> dict:
    """Get revenue forecast based on premiums and conversion probability."""
    return get_revenue_forecast()

@tool
def tool_get_lead_distribution() -> dict:
    """Get lead distribution by location and product interest."""
    return get_lead_distribution()

@tool
def tool_get_top_leads(limit: int = 5) -> list:
    """Get top leads by conversion probability."""
    return get_top_leads(limit)

@tool
def tool_get_performance_metrics() -> dict:
    """Get overall performance metrics."""
    return get_performance_metrics()

@tool
def tool_get_daily_summary() -> dict:
    """
    Get comprehensive daily summary with leads, tasks, revenue, and action items.
    Use this when user says 'summarize today', 'daily briefing', 'what's my day like', etc.
    """
    return get_daily_summary()

@tool
def tool_get_todays_briefing() -> str:
    """
    Get formatted daily briefing text.
    Use this when user wants a quick overview of the day.
    """
    return get_todays_briefing()

@tool
def tool_create_tasks_from_action_items() -> dict:
    """
    Automatically create tasks from today's action items.
    Use this when user says 'create tasks', 'create this as task', 'make tasks from action items' after viewing daily summary.
    This will create tasks for all action items from the daily summary.
    """
    return create_tasks_from_action_items()

# Collect all tools
tools = [
    tool_get_lead,
    tool_search_leads,
    tool_get_all_leads,
    tool_get_lead_fields,
    tool_create_lead,
    tool_update_lead,
    tool_get_task_fields,
    tool_check_compliance,
    tool_get_all_templates,
    tool_get_template,
    tool_search_templates,
    tool_get_lead_interactions,
    tool_analyze_sentiment,
    tool_get_all_tasks,
    tool_get_task,
    tool_get_tasks_by_lead,
    tool_search_tasks,
    tool_get_tasks_due_today,
    tool_get_overdue_tasks,
    tool_get_urgent_tasks,
    tool_open_lead_profile,
    tool_open_maps,
    tool_send_message,
    tool_confirm_send_message,
    tool_call_lead,
    tool_schedule_meeting,
    tool_create_task,
    tool_send_template,
    tool_show_create_lead_form,
    tool_show_create_task_form,
    tool_show_edit_lead_form,
    # Enhanced Lead Tools
    tool_filter_leads_by_tag,
    tool_get_renewal_leads,
    tool_get_followup_leads,
    tool_get_high_value_leads,
    tool_get_leads_by_location,
    tool_get_leads_with_policy,
    # Notification Tools
    tool_get_notifications,
    tool_get_unread_notifications,
    tool_get_unread_count,
    tool_get_high_priority_notifications,
    # Audit Tools
    tool_get_audit_logs,
    tool_get_audit_logs_by_lead,
    # Analytics Tools
    tool_get_conversion_stats,
    tool_get_revenue_forecast,
    tool_get_lead_distribution,
    tool_get_top_leads,
    tool_get_performance_metrics,
    tool_get_daily_summary,
    tool_get_todays_briefing,
    tool_create_tasks_from_action_items,
    # Utility Tools
    tool_format_data,
    tool_summarize_content,
]

# ------------------------------
# Create LangGraph Agent
# ------------------------------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0
)

system_message = """
You are an intelligent AI assistant for insurance agents in India.

CRITICAL RULES:
1. Get data using appropriate tool
2. ALWAYS use tool_format_data to format the result into readable text
3. Present ONLY the formatted result (no extra commentary)
4. NEVER return markdown tables or raw JSON
5. NEVER use pipe characters (|) or dashes (---) for tables
6. ALWAYS format data as clean text with bullet points and indentation

TOOLS AVAILABLE:
- Leads: tool_search_leads, tool_get_lead, tool_get_all_leads, tool_filter_leads_by_tag, tool_get_renewal_leads, tool_get_followup_leads, tool_get_high_value_leads, tool_get_leads_by_location, tool_get_leads_with_policy
- Tasks: tool_get_all_tasks, tool_get_task, tool_get_tasks_by_lead, tool_search_tasks, tool_get_tasks_due_today, tool_get_overdue_tasks, tool_get_urgent_tasks
- Notifications: tool_get_notifications, tool_get_unread_notifications, tool_get_unread_count, tool_get_high_priority_notifications
- Audit: tool_get_audit_logs, tool_get_audit_logs_by_lead
- Analytics: tool_get_conversion_stats, tool_get_revenue_forecast, tool_get_lead_distribution, tool_get_top_leads, tool_get_performance_metrics
- Compliance: tool_check_compliance
- Templates: tool_get_all_templates, tool_get_template, tool_search_templates
- Interactions: tool_get_lead_interactions, tool_analyze_sentiment
- Actions: tool_open_lead_profile, tool_open_maps, tool_send_message, tool_call_lead, tool_schedule_meeting, tool_create_task, tool_send_template
- Formatting: tool_format_data (USE ALWAYS after getting data)
- Summarization: tool_summarize_content

SMART QUERY HANDLING:
- "Add new lead" / "Create lead" → tool_show_create_lead_form() OR ask for details and use tool_create_lead()
- "What do I need to add a lead?" → tool_get_lead_fields()
- "Create task" → tool_show_create_task_form() OR ask for details and use tool_create_task()
- "Edit lead" → tool_show_edit_lead_form() OR use tool_update_lead()
- "Update lead temperature" → tool_update_lead(lead_id, temperature="hot")
- "Show renewals due" → tool_get_renewal_leads()
- "Show follow-ups" → tool_get_followup_leads()
- "High value leads" → tool_get_high_value_leads()
- "Leads in Mumbai" → tool_get_leads_by_location("Mumbai")
- "Show notifications" → tool_get_notifications()
- "Conversion stats" → tool_get_conversion_stats()
- "Revenue forecast" → tool_get_revenue_forecast()
- "Top leads" → tool_get_top_leads()
- "Summarize today" / "Daily briefing" → tool_get_todays_briefing() THEN AUTOMATICALLY tool_create_tasks_from_action_items()
- "What's my day like?" → tool_get_daily_summary()
- "Create this as task" / "Make tasks" (after daily summary) → tool_create_tasks_from_action_items()
- "Find Priya Sharma" → tool_search_leads(search_term="Priya Sharma")
- "Send message to Priya" / "Send WhatsApp to Priya" / "Send SMS to Priya" / "Send email to Priya" → 
  1. tool_search_leads(search_term="Priya") to get full lead data
  2. tool_send_message(lead_id, lead_name, phone, message_type, lead_data=<stringify full lead object>)
     - This shows a DRAFT message to the user
     - Wait for user to confirm with "yes"
  3. When user says "yes" → tool_confirm_send_message(lead_id, lead_name, message_type)
     - This returns "Message sent!" confirmation
- "Show me where Priya lives" / "Priya location" / "Where does Priya live" → 
  1. tool_search_leads(search_term="Priya") to get lead data
  2. tool_open_maps(lead_id, lead_name, location) - AUTOMATICALLY open maps, don't ask for confirmation
- "Schedule meeting with Priya" → 
  1. tool_search_leads(search_term="Priya") to get lead data
  2. tool_schedule_meeting(lead_id, lead_name, date)

IMPORTANT RULES:
1. When user says "summarize today", ALWAYS call tool_create_tasks_from_action_items() automatically after showing the summary.

2. When user wants to message/call/locate a lead by name, ALWAYS search for the lead first to get full details, then perform the action.

3. MESSAGE WORKFLOW (WhatsApp/SMS/Email):
   - Step 1: Search for the lead to get full lead data
   - Step 2: Call tool_send_message with full lead_data - this generates a DRAFT message
   - Step 3: Show the draft to user and ask "Would you like me to send this message?"
   - Step 4: WAIT for user to confirm with "yes"
   - Step 5: When user says "yes", call tool_confirm_send_message to confirm sending
   - NEVER actually send messages - just show draft and confirm when user says yes

4. LOCATION WORKFLOW:
   - When user asks about location ("where does X live", "show me X's location", "X location"):
   - Search for the lead first to get location
   - AUTOMATICALLY call tool_open_maps with the location
   - DO NOT ask for confirmation - just open maps immediately
   - Maps will redirect to Google Maps with the location

5. For schedule meeting, if user doesn't specify date, ask for it before calling the tool.

6. CONTEXT AWARENESS:
   - Remember the last lead you were discussing
   - If user says "yes" after seeing a draft message, use tool_confirm_send_message for that lead
   - Track message_type (whatsapp/sms/email) from the draft to use in confirmation

WORKFLOW EXAMPLE:

User: "Find Priya Sharma"
Step 1: tool_search_leads(search_term="Priya Sharma") → get lead data
Step 2: tool_format_data(data=<stringify lead data>) → get formatted text
Step 3: Return ONLY the formatted text (NOT the raw data)

User: "Show hot leads"
Step 1: tool_search_leads(temperature="hot") → get leads
Step 2: tool_format_data(data=<stringify leads>) → get formatted text
Step 3: Return ONLY the formatted text (NOT a table)

CORRECT OUTPUT FORMAT:
Found 2 lead(s):

1. Priya Sharma (HOT)
   Phone: +91-9876543211
   Email: priya.sharma@example.com
   Location: Mumbai, Maharashtra
   Interest: Term Life, Health
   Premium: ₹25,000

2. Rahul Mehta (HOT)
   Phone: +91-9876543214
   ...

WRONG OUTPUT (NEVER DO THIS):
Lead Name | Contact | Location
--------- | ------- | --------
Priya     | +91-... | Mumbai

RULES:
- NO emojis in responses
- NO markdown tables (no pipes |, no dashes ---)
- ALWAYS use tool_format_data after getting data
- Return ONLY the formatted output, no extra text
- Be concise and professional
- Never mention tool names to users
- Use conversation history to understand context
  Lead Name | Contact | Status
  --------- | ------- | ------
  John Doe  | 9876543210 | Hot

User: "Check if this message is compliant"
Agent:
- Use `check_compliance(content)` and `get_safe_alternative(content)` if needed
- Present a summary: "Message is compliant" or "Message is not compliant. Suggested alternative: ..."

User: "Analyze sentiment of interactions for lead 123"
Agent:
- Use `analyze_sentiment(lead_id=123)`
- Present a summary: Positive / Neutral / Negative, with key highlights.
"""


# Create the agent using LangGraph
agent_executor = create_react_agent(llm, tools, prompt=system_message)

# ------------------------------
# Request Models
# ------------------------------
class AgentRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}

# ------------------------------
# API Endpoints
# ------------------------------
@app.get("/")
def root():
    return {
        "name": "Insurance Agent Copilot",
        "version": "1.0.0",
        "powered_by": "LangChain + Gemini",
        "mode": "Single Autonomous Agent",
        "tools": len(tools)
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": True,
        "agent": "insurance_agent",
        "tools_available": len(tools),
        "autonomous": True
    }

@app.post("/api/agent/stream")
async def agent_stream_endpoint(request: AgentRequest):
    """
    Streaming agent endpoint - Returns response as Server-Sent Events
    """
    from fastapi.responses import StreamingResponse
    import json
    
    async def generate():
        try:
            # Build message history
            message_history = []
            if request.context and 'history' in request.context:
                history = request.context['history'][-5:]
                for msg in history:
                    if msg['role'] == 'user':
                        message_history.append(HumanMessage(content=msg['content']))
                    else:
                        from langchain_core.messages import AIMessage
                        message_history.append(AIMessage(content=msg['content']))
            
            message_history.append(HumanMessage(content=request.message))
            
            # Collect actions from tool responses
            actions = []
            
            # Stream the response
            async for event in agent_executor.astream_events(
                {"messages": message_history},
                version="v1"
            ):
                # Send tool calls and responses
                if event["event"] == "on_chat_model_stream":
                    content = event["data"]["chunk"].content
                    if content:
                        yield f"data: {json.dumps({'type': 'content', 'data': content})}\n\n"
                
                elif event["event"] == "on_tool_start":
                    tool_name = event["name"]
                    yield f"data: {json.dumps({'type': 'tool_start', 'data': tool_name})}\n\n"
                
                elif event["event"] == "on_tool_end":
                    # Check if tool returned an action
                    output = event.get("data", {}).get("output")
                    print(f"🔧 Tool output: {output}")  # Debug logging
                    if output and isinstance(output, dict) and "action" in output:
                        print(f"✅ Action detected: {output['action']}")  # Debug logging
                        actions.append(output)
                        yield f"data: {json.dumps({'type': 'action', 'data': output})}\n\n"
                    yield f"data: {json.dumps({'type': 'tool_end', 'data': 'complete'})}\n\n"
            
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@app.post("/api/agent")
async def agent_endpoint(request: AgentRequest):
    """
    Main agent endpoint - LangGraph agent that autonomously uses tools
    """
    try:
        # Build message history from context (last 5 messages)
        message_history = []
        if request.context and 'history' in request.context:
            history = request.context['history'][-5:]  # Last 5 messages
            for msg in history:
                if msg['role'] == 'user':
                    message_history.append(HumanMessage(content=msg['content']))
                else:
                    from langchain_core.messages import AIMessage
                    message_history.append(AIMessage(content=msg['content']))
        
        # Add current message
        message_history.append(HumanMessage(content=request.message))
        
        # Invoke the agent with message history
        result = await agent_executor.ainvoke(
            {"messages": message_history}
        )
        
        # Extract the last message from the agent
        messages = result.get("messages", [])
        output = "No response from agent"
        
        table_data = None
        actions = []
        
        if messages:
            # Get the final text response
            last_message = messages[-1]
            raw_output = last_message.content if hasattr(last_message, 'content') else str(last_message)
            
            # Check for tool calls in message history to extract structured data and actions
            for msg in messages:
                if hasattr(msg, 'tool_calls') and msg.tool_calls:
                    # This was a tool call, check if it returned structured data
                    pass
                elif hasattr(msg, 'content'):
                    content = msg.content
                    # Try to find JSON data in tool responses
                    if isinstance(content, str):
                        try:
                            import json
                            # Check for action objects
                            if '"action":' in content:
                                start = content.find('{')
                                end = content.rfind('}') + 1
                                if start >= 0 and end > start:
                                    json_str = content[start:end]
                                    parsed = json.loads(json_str)
                                    if 'action' in parsed:
                                        actions.append(parsed)
                            # Check for list data
                            elif '[{' in content or content.strip().startswith('['):
                                start = content.find('[')
                                end = content.rfind(']') + 1
                                if start >= 0 and end > start:
                                    json_str = content[start:end]
                                    parsed_data = json.loads(json_str)
                                    if isinstance(parsed_data, list) and len(parsed_data) > 0:
                                        # Determine data type
                                        first_item = parsed_data[0]
                                        if 'name' in first_item and 'temperature' in first_item:
                                            table_data = {"type": "leads", "data": parsed_data}
                                        elif 'title' in first_item and 'status' in first_item:
                                            table_data = {"type": "tasks", "data": parsed_data}
                                        elif 'content' in first_item and 'category' in first_item:
                                            table_data = {"type": "templates", "data": parsed_data}
                        except:
                            pass
            
            # Format the text output
            output = format_response(raw_output) if raw_output else "No response from agent"
        
        return {
            "response": output,
            "table": table_data,
            "actions": actions if actions else None,
            "agent": "insurance_agent"
        }
        
    except Exception as e:
        print(f"❌ Agent error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ------------------------------
# Legacy endpoints for frontend compatibility
# ------------------------------
@app.get("/api/leads")
def get_leads_endpoint(filter: Optional[str] = None, search: Optional[str] = None):
    result = search_leads(search_term=search) if search else get_all_leads()
    return {"leads": result, "total": len(result)}

@app.get("/api/leads/{lead_id}")
def get_lead_endpoint(lead_id: str):
    lead = get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    interactions = get_lead_interactions(lead_id)
    sentiment = analyze_sentiment(lead_id)
    return {"lead": lead, "interactions": interactions, "sentiment": sentiment}

@app.get("/api/templates")
def get_templates_endpoint():
    return {"templates": get_all_templates()}

@app.post("/api/compliance/validate")
def validate_compliance_endpoint(request: Dict[str, Any]):
    content = request.get("content", "")
    return check_compliance(content)

# ------------------------------
# Startup
# ------------------------------
@app.on_event("startup")
def startup():
    print("🚀 Insurance Agent Copilot API started")
    print(f"🤖 LangChain Agent initialized with {len(tools)} tools")
    print(f"🔑 Gemini API Key: {'✓ Configured' if GEMINI_API_KEY else '✗ Not configured'}")
    print(f"✨ Mode: Autonomous Tool-Calling Agent")

# ------------------------------
# Run the app
# ------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
