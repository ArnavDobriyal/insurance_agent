"""
Insurance Agent Copilot - CrewAI Backend
Multi-agent orchestration using CrewAI with specialized insurance agents
"""

import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

# CrewAI imports
from crewai import Agent, Task, Crew, Process
from crewai.tools import BaseTool
from langchain_google_genai import ChatGoogleGenerativeAI
import asyncio
from concurrent.futures import ThreadPoolExecutor

# Import your existing tool functions
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
from tools.analytics import (
    get_conversion_stats, get_revenue_forecast, get_lead_distribution,
    get_top_leads, get_performance_metrics
)
from tools.daily_summary import get_daily_summary, get_todays_briefing, create_tasks_from_action_items
from tools.notifications import (
    get_all_notifications, get_unread_notifications, get_unread_count,
    get_notifications_by_lead, get_high_priority_notifications
)
from tools.audit import (
    get_all_audit_logs, get_audit_logs_by_lead, get_audit_logs_by_action, get_ai_actions
)
from tools.formatting import format_response, format_leads_list, format_compliance_result
from tools.policies import (
    upload_policy_document, get_lead_policies, get_policy_by_id, get_all_policies,
    get_policies_by_type, get_expiring_policies, create_policy
)

# Configure FastAPI
app = FastAPI(title="Insurance Agent Copilot - CrewAI", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CLIENT_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.1,
    google_api_key=GEMINI_API_KEY,
    convert_system_message_to_human=True
)

# ================================
# CrewAI Tools (Wrapper Classes)
# ================================

class LeadSearchTool(BaseTool):
    name: str = "Lead Search Tool"
    description: str = "Search and retrieve lead information by various criteria"
    
    def _run(self, query: str, temperature: str = None, search_term: str = None) -> str:
        if temperature:
            results = search_leads(temperature=temperature)
        elif search_term:
            results = search_leads(search_term=search_term)
        else:
            results = get_all_leads()
        return json.dumps(results, indent=2)

class LeadManagementTool(BaseTool):
    name: str = "Lead Management Tool"
    description: str = "Create, update, and manage lead information"
    
    def _run(self, action: str, lead_id: str = None, **kwargs) -> str:
        if action == "get" and lead_id:
            result = get_lead(lead_id)
        elif action == "create":
            result = create_lead(**kwargs)
        elif action == "update" and lead_id:
            result = update_lead(lead_id, **kwargs)
        else:
            result = {"error": "Invalid action or missing parameters"}
        return json.dumps(result, indent=2)

class ComplianceTool(BaseTool):
    name: str = "IRDAI Compliance Tool"
    description: str = "Check IRDAI compliance and provide safe alternatives"
    
    def _run(self, content: str) -> str:
        result = check_compliance(content)
        if not result.get("is_compliant"):
            safe_alt = get_safe_alternative(content)
            result["safe_alternative"] = safe_alt
        return json.dumps(result, indent=2)

class TaskManagementTool(BaseTool):
    name: str = "Task Management Tool"
    description: str = "Manage tasks, deadlines, and follow-ups"
    
    def _run(self, action: str, **kwargs) -> str:
        if action == "get_all":
            result = get_all_tasks()
        elif action == "get_due_today":
            result = get_tasks_due_today()
        elif action == "get_overdue":
            result = get_overdue_tasks()
        elif action == "get_urgent":
            result = get_urgent_tasks()
        elif action == "create":
            result = create_task_for_lead(**kwargs)
        else:
            result = {"error": "Invalid action"}
        return json.dumps(result, indent=2)

class CommunicationTool(BaseTool):
    name: str = "Communication Tool"
    description: str = "Handle messaging, calls, and communication with leads"
    
    def _run(self, action: str, lead_id: str, **kwargs) -> str:
        if action == "send_message":
            result = send_message_to_lead(lead_id, **kwargs)
        elif action == "call":
            result = call_lead(lead_id, **kwargs)
        elif action == "schedule_meeting":
            result = schedule_meeting(lead_id, **kwargs)
        else:
            result = {"error": "Invalid communication action"}
        return json.dumps(result, indent=2)

class AnalyticsTool(BaseTool):
    name: str = "Analytics Tool"
    description: str = "Generate insights, forecasts, and performance metrics"
    
    def _run(self, metric_type: str) -> str:
        if metric_type == "conversion":
            result = get_conversion_stats()
        elif metric_type == "revenue_forecast":
            result = get_revenue_forecast()
        elif metric_type == "lead_distribution":
            result = get_lead_distribution()
        elif metric_type == "top_leads":
            result = get_top_leads()
        elif metric_type == "performance":
            result = get_performance_metrics()
        elif metric_type == "daily_summary":
            result = get_daily_summary()
        elif metric_type == "todays_briefing":
            result = get_todays_briefing()
        elif metric_type == "create_tasks_from_action_items":
            result = create_tasks_from_action_items()
        else:
            result = {"error": "Invalid metric type"}
        return json.dumps(result, indent=2)

class NotificationTool(BaseTool):
    name: str = "Notification Tool"
    description: str = "Manage notifications and alerts"
    
    def _run(self, action: str, **kwargs) -> str:
        if action == "get_all":
            filter_type = kwargs.get("filter_type")
            result = get_all_notifications(filter_type)
        elif action == "get_unread":
            result = get_unread_notifications()
        elif action == "get_unread_count":
            result = get_unread_count()
        elif action == "get_by_lead":
            lead_id = kwargs.get("lead_id")
            result = get_notifications_by_lead(lead_id)
        elif action == "get_high_priority":
            result = get_high_priority_notifications()
        else:
            result = {"error": "Invalid notification action"}
        return json.dumps(result, indent=2)

class AuditTool(BaseTool):
    name: str = "Audit Tool"
    description: str = "Access audit logs and track system activities"
    
    def _run(self, action: str, **kwargs) -> str:
        if action == "get_all":
            limit = kwargs.get("limit", 50)
            result = get_all_audit_logs(limit)
        elif action == "get_by_lead":
            lead_id = kwargs.get("lead_id")
            result = get_audit_logs_by_lead(lead_id)
        elif action == "get_by_action":
            action_type = kwargs.get("action_type")
            result = get_audit_logs_by_action(action_type)
        elif action == "get_ai_actions":
            result = get_ai_actions()
        else:
            result = {"error": "Invalid audit action"}
        return json.dumps(result, indent=2)

class FormattingTool(BaseTool):
    name: str = "Formatting Tool"
    description: str = "Format data for better presentation"
    
    def _run(self, data: str, format_type: str = "auto") -> str:
        try:
            parsed_data = json.loads(data) if isinstance(data, str) else data
            if format_type == "leads":
                result = format_leads_list(parsed_data)
            elif format_type == "compliance":
                result = format_compliance_result(parsed_data)
            else:
                result = format_response(parsed_data, format_type)
            return result
        except Exception as e:
            return f"Formatting error: {str(e)}"

class InteractionTool(BaseTool):
    name: str = "Interaction Tool"
    description: str = "Manage lead interactions and sentiment analysis"
    
    def _run(self, action: str, lead_id: str = None, **kwargs) -> str:
        if action == "get_interactions" and lead_id:
            result = get_lead_interactions(lead_id)
        elif action == "add_interaction" and lead_id:
            interaction_data = kwargs.get("interaction_data", {})
            result = add_interaction(lead_id, interaction_data)
        elif action == "analyze_sentiment" and lead_id:
            result = analyze_sentiment(lead_id)
        else:
            result = {"error": "Invalid interaction action or missing lead_id"}
        return json.dumps(result, indent=2)

class UIActionTool(BaseTool):
    name: str = "UI Action Tool"
    description: str = "Trigger UI actions and form displays"
    
    def _run(self, action: str, **kwargs) -> str:
        if action == "show_create_lead_form":
            prefilled_data = kwargs.get("prefilled_data")
            result = show_create_lead_form(prefilled_data)
        elif action == "show_create_task_form":
            lead_id = kwargs.get("lead_id")
            lead_name = kwargs.get("lead_name")
            result = show_create_task_form(lead_id, lead_name)
        elif action == "show_edit_lead_form":
            lead_id = kwargs.get("lead_id")
            lead_data = kwargs.get("lead_data")
            result = show_edit_lead_form(lead_id, lead_data)
        elif action == "open_lead_profile":
            lead_id = kwargs.get("lead_id")
            result = open_lead_profile(lead_id)
        else:
            result = {"error": "Invalid UI action"}
        return json.dumps(result, indent=2)

class PolicyTool(BaseTool):
    name: str = "Policy Tool"
    description: str = "Manage insurance policies and policy documents"
    
    def _run(self, action: str, **kwargs) -> str:
        if action == "upload_document":
            lead_id = kwargs.get("lead_id")
            document_data = kwargs.get("document_data", {})
            result = upload_policy_document(lead_id, document_data)
        elif action == "get_lead_policies":
            lead_id = kwargs.get("lead_id")
            result = get_lead_policies(lead_id)
        elif action == "get_policy":
            policy_id = kwargs.get("policy_id")
            result = get_policy_by_id(policy_id)
        elif action == "get_all_policies":
            result = get_all_policies()
        elif action == "get_by_type":
            policy_type = kwargs.get("policy_type")
            result = get_policies_by_type(policy_type)
        elif action == "get_expiring":
            days = kwargs.get("days", 30)
            result = get_expiring_policies(days)
        elif action == "create_policy":
            lead_id = kwargs.get("lead_id")
            policy_data = kwargs.get("policy_data", {})
            result = create_policy(lead_id, policy_data)
        else:
            result = {"error": "Invalid policy action"}
        return json.dumps(result, indent=2)

class RouterTool(BaseTool):
    name: str = "Router Tool"
    description: str = "Intelligent routing and intent classification for user requests"
    
    def _run(self, user_message: str) -> str:
        """Classify user intent using LLM for better routing"""
        classification_prompt = f"""
        Classify this user message into primary intent categories:
        Message: "{user_message}"
        
        Categories:
        - lead_management: Finding, creating, updating leads
        - communication: Sending messages, calls, scheduling
        - task_management: Tasks, deadlines, follow-ups
        - analytics: Reports, summaries, insights
        - compliance: IRDAI validation, safety checks
        - policy_management: Policy operations, documents
        
        Return only the primary category name.
        """
        
        try:
            response = llm.invoke(classification_prompt)
            intent = response.content.strip().lower()
            return intent
        except:
            return "lead_management"  # Default fallback

# ================================
# CrewAI Agents
# ================================

# Root Agent - Main Orchestrator
root_agent = Agent(
    role='Insurance Agent Supervisor',
    goal='Act as the main point of contact for users, understand their needs, and delegate tasks to specialized agents to provide comprehensive insurance support',
    backstory="""You are the primary AI assistant for insurance agents - a knowledgeable supervisor who understands 
    the entire insurance workflow. You have a team of specialized agents under your supervision, each expert in their domain. 
    Your role is to understand user requests, break them down into actionable tasks, and delegate to the right specialists. 
    You coordinate responses and ensure users get comprehensive, accurate assistance. You're the friendly face of the system 
    who makes complex insurance operations feel simple and intuitive.""",
    verbose=True,
    allow_delegation=True,  # Key: This agent can delegate to others
    llm=llm,
    tools=[RouterTool(), FormattingTool()]  # Minimal tools for routing and formatting
)

# Lead Manager Agent
lead_manager = Agent(
    role='Lead Manager',
    goal='Efficiently manage and organize lead information, track lead progression, and identify high-value opportunities',
    backstory="""You are an experienced lead management specialist with deep knowledge of insurance sales processes. 
    You excel at organizing lead data, tracking customer journeys, and identifying the most promising opportunities. 
    You understand lead scoring, temperature classification, and conversion optimization. You report to the Insurance Agent Supervisor.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[LeadSearchTool(), LeadManagementTool(), InteractionTool(), UIActionTool(), PolicyTool(), FormattingTool()]
)

# Communication Specialist Agent
communicator = Agent(
    role='Communication Specialist',
    goal='Handle all customer communications professionally and effectively, ensuring IRDAI compliance',
    backstory="""You are a skilled communication expert specializing in insurance industry interactions. 
    You craft compelling, compliant messages that build trust and drive engagement. You understand the nuances 
    of different communication channels (WhatsApp, SMS, Email) and tailor messages accordingly. You work under 
    the Insurance Agent Supervisor's guidance.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[CommunicationTool(), ComplianceTool(), NotificationTool(), FormattingTool()]
)

# Task Coordinator Agent
task_coordinator = Agent(
    role='Task Coordinator',
    goal='Organize and prioritize tasks, manage deadlines, and ensure nothing falls through the cracks',
    backstory="""You are a meticulous task management expert who ensures optimal workflow efficiency. 
    You excel at prioritizing activities, managing deadlines, and coordinating follow-up actions. 
    You understand the importance of timely follow-ups in insurance sales. You coordinate with the 
    Insurance Agent Supervisor to ensure all tasks align with business priorities.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[TaskManagementTool(), NotificationTool(), UIActionTool(), FormattingTool()]
)

# Analytics Expert Agent
analyst = Agent(
    role='Analytics Expert',
    goal='Provide data-driven insights, forecasts, and recommendations to optimize performance',
    backstory="""You are a data analytics specialist with expertise in insurance sales metrics. 
    You transform raw data into actionable insights, identify trends, and provide strategic recommendations. 
    You understand conversion funnels, revenue forecasting, and performance optimization. You provide 
    strategic insights to the Insurance Agent Supervisor for decision-making.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[AnalyticsTool(), AuditTool(), FormattingTool()]
)

# Compliance Officer Agent
compliance_officer = Agent(
    role='Compliance Officer',
    goal='Ensure all communications and actions comply with IRDAI regulations and industry standards',
    backstory="""You are a compliance expert with deep knowledge of IRDAI regulations and insurance industry standards. 
    You review all communications for compliance issues, suggest safe alternatives, and ensure regulatory adherence. 
    You prioritize customer protection and regulatory compliance above all else. You work closely with the 
    Insurance Agent Supervisor to maintain the highest compliance standards.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[ComplianceTool(), AuditTool(), FormattingTool()]
)

# Text Analysis Agent
text_analysis_agent = Agent(
    role='Text Analysis Specialist',
    goal='Generate personalized messages, analyze lead profiles, update interactions, ensure IRDAI compliance, and improve lead scoring based on interactions',
    backstory="""You are an advanced text analysis and communication specialist with expertise in insurance industry communications. 
    You excel at generating personalized WhatsApp messages, emails, and call scripts based on lead profiles and context. 
    You can analyze lead information to provide comprehensive insights, update interaction summaries, ensure IRDAI compliance, 
    and improve lead scoring based on new interactions. You understand the nuances of different communication channels and 
    can adapt your analysis and generation accordingly. You work under the Insurance Agent Supervisor's guidance to provide 
    contextual, compliant, and effective communication solutions.""",
    verbose=True,
    allow_delegation=False,
    llm=llm,
    tools=[LeadSearchTool(), ComplianceTool(), InteractionTool(), CommunicationTool(), FormattingTool()]
)

# ================================
# Root Agent Task Creation
# ================================

def create_root_orchestration_task(user_message: str) -> Task:
    """Create the main orchestration task for the root agent"""
    return Task(
        description=f"""
        Process user request: "{user_message}"
        
        As Insurance Agent Supervisor:
        1. Analyze user intent
        2. Delegate to appropriate specialists
        3. Coordinate team responses
        4. Provide comprehensive answer
        
        Keep response professional and helpful.
        """,
        agent=root_agent,
        expected_output="Clear, comprehensive response addressing user's needs"
    )

# ================================
# Specialized Agent Task Functions
# ================================

def create_lead_management_task(user_message: str) -> Task:
    """Create a task for lead-related queries"""
    return Task(
        description=f"""
        Process this lead-related request: "{user_message}"
        
        Analyze the request and:
        1. Determine what lead information is needed
        2. Search or retrieve the appropriate lead data
        3. If it's an update request, modify the lead information
        4. If it's a creation request, gather required details
        5. Format the response in a user-friendly manner
        
        Provide clear, actionable information about the leads.
        """,
        agent=lead_manager,
        expected_output="Formatted lead information or confirmation of lead management action"
    )

def create_communication_task(user_message: str) -> Task:
    """Create a task for communication-related queries"""
    return Task(
        description=f"""
        Handle this communication request: "{user_message}"
        
        Process the request by:
        1. Identifying the communication type (WhatsApp, SMS, Email, Call)
        2. Determining the target lead/customer
        3. Crafting appropriate, compliant messaging
        4. Ensuring IRDAI compliance for all communications
        5. Executing or preparing the communication action
        
        Always check compliance before finalizing any message.
        """,
        agent=communicator,
        expected_output="Communication action result or compliant message draft"
    )

def create_task_management_task(user_message: str) -> Task:
    """Create a task for task-related queries"""
    return Task(
        description=f"""
        Manage this task-related request: "{user_message}"
        
        Handle the request by:
        1. Understanding the task management need
        2. Retrieving relevant task information
        3. Creating, updating, or organizing tasks as needed
        4. Prioritizing tasks based on urgency and importance
        5. Providing clear task status and next actions
        
        Focus on actionable task management outcomes.
        """,
        agent=task_coordinator,
        expected_output="Task management result with clear next actions"
    )

def create_analytics_task(user_message: str) -> Task:
    """Create a task for analytics and insights"""
    return Task(
        description=f"""
        Provide analytics for this request: "{user_message}"
        
        Generate insights by:
        1. Identifying the type of analytics needed
        2. Gathering relevant data and metrics
        3. Analyzing trends and patterns
        4. Providing actionable recommendations
        5. Formatting insights in an easy-to-understand manner
        
        Focus on data-driven insights that drive business decisions.
        """,
        agent=analyst,
        expected_output="Analytics insights with actionable recommendations"
    )

def create_compliance_task(user_message: str) -> Task:
    """Create a task for compliance checking"""
    return Task(
        description=f"""
        Review this content for compliance: "{user_message}"
        
        Perform compliance review by:
        1. Analyzing the content for IRDAI violations
        2. Identifying risky phrases or claims
        3. Providing safe alternatives where needed
        4. Ensuring regulatory adherence
        5. Offering compliant messaging suggestions
        
        Prioritize customer protection and regulatory compliance.
        """,
        agent=compliance_officer,
        expected_output="Compliance assessment with safe alternatives if needed"
    )

def create_text_analysis_task(user_message: str, action_type: str = None, lead_info: str = None) -> Task:
    """Create a task for text analysis and message generation"""
    return Task(
        description=f"""
        Process this text analysis request: "{user_message}"
        Action Type: {action_type or 'general'}
        Lead Information: {lead_info or 'Not provided'}
        
        Based on the action type, perform the appropriate analysis:
        
        If action is 'whatsapp':
        1. Analyze the lead profile and context
        2. Generate a personalized WhatsApp message
        3. Ensure IRDAI compliance
        4. Include relevant product recommendations
        5. Use appropriate tone and timing
        
        If action is 'email':
        1. Analyze the lead profile and context
        2. Generate a professional email with subject line
        3. Include detailed product information
        4. Ensure IRDAI compliance and disclaimers
        5. Structure with proper email format
        
        If action is 'call':
        1. Analyze the lead profile and context
        2. Generate a call script with key talking points
        3. Include objection handling suggestions
        4. Provide next best action recommendations
        5. Ensure compliance in verbal communication
        
        If action is 'analyze':
        1. Provide comprehensive lead analysis
        2. Highlight key insights and opportunities
        3. Suggest improvement strategies
        4. Identify risk factors and mitigation
        5. Recommend next best actions
        
        For interaction updates:
        1. Summarize the interaction professionally
        2. Update lead scoring based on interaction
        3. Identify sentiment changes
        4. Recommend follow-up actions
        5. Ensure compliance in documentation
        
        Always ensure IRDAI compliance and provide actionable insights.
        """,
        agent=text_analysis_agent,
        expected_output="Personalized, compliant communication or comprehensive lead analysis based on action type"
    )

# ================================
# Root Agent Orchestration
# ================================

def classify_intent(user_message: str) -> str:
    """Use LLM to classify user intent more accurately"""
    classification_prompt = f"""
    Classify this insurance agent query into ONE primary category:
    
    Query: "{user_message}"
    
    Categories:
    1. lead_management - Finding, creating, updating leads, customer info
    2. communication - Sending messages, calls, scheduling meetings
    3. task_management - Tasks, deadlines, follow-ups, reminders
    4. analytics - Reports, summaries, insights, performance metrics
    5. compliance - IRDAI validation, safety checks, regulatory
    6. policy_management - Policy operations, documents, renewals
    7. text_analysis - Message generation, lead analysis, interaction updates, scoring improvements
    
    Return ONLY the category name (e.g., "lead_management").
    """
    
    try:
        response = llm.invoke(classification_prompt)
        intent = response.content.strip().lower()
        
        # Validate intent
        valid_intents = ['lead_management', 'communication', 'task_management', 'analytics', 'compliance', 'policy_management', 'text_analysis']
        if intent in valid_intents:
            return intent
        else:
            return 'lead_management'  # Default fallback
    except:
        return 'lead_management'  # Default fallback

def create_hierarchical_crew(user_message: str) -> Crew:
    """Create a hierarchical crew with root agent as manager"""
    
    # Create the main orchestration task for root agent
    root_task = create_root_orchestration_task(user_message)
    
    # Use LLM-based intent classification instead of keyword matching
    primary_intent = classify_intent(user_message)
    
    # Create supporting tasks based on classified intent
    supporting_tasks = []
    
    if primary_intent == 'lead_management':
        supporting_tasks.append(create_lead_management_task(user_message))
    elif primary_intent == 'communication':
        supporting_tasks.append(create_communication_task(user_message))
    elif primary_intent == 'task_management':
        supporting_tasks.append(create_task_management_task(user_message))
    elif primary_intent == 'analytics':
        supporting_tasks.append(create_analytics_task(user_message))
    elif primary_intent == 'compliance':
        supporting_tasks.append(create_compliance_task(user_message))
    elif primary_intent == 'policy_management':
        # Create a policy management task
        supporting_tasks.append(create_lead_management_task(user_message))  # Reuse for now
    elif primary_intent == 'text_analysis':
        supporting_tasks.append(create_text_analysis_task(user_message))
    else:
        # Default fallback
        supporting_tasks.append(create_lead_management_task(user_message))
    
    # For complex queries, add secondary tasks if needed
    message_lower = user_message.lower()
    if len(user_message.split()) > 10:  # Complex query heuristic
        if 'compliant' in message_lower or 'irdai' in message_lower:
            if primary_intent != 'compliance':
                supporting_tasks.append(create_compliance_task(user_message))
    
    # Combine all tasks with root task first
    all_tasks = [root_task] + supporting_tasks
    
    # Create hierarchical crew with root agent as manager
    try:
        crew = Crew(
            agents=[root_agent, lead_manager, communicator, task_coordinator, analyst, compliance_officer, text_analysis_agent],
            tasks=all_tasks,
            process=Process.hierarchical,  # Hierarchical process with manager
            manager_agent=root_agent,  # Use root agent as manager instead of LLM
            verbose=True
        )
        return crew
    except Exception as e:
        print(f"❌ Error creating crew: {e}")
        # Fallback to simple crew
        simple_task = create_lead_management_task(user_message)
        crew = Crew(
            agents=[lead_manager],
            tasks=[simple_task],
            process=Process.sequential,
            verbose=True
        )
        return crew

def route_request(user_message: str) -> Crew:
    """Route user requests through the root agent orchestration"""
    try:
        # Validate input
        if not user_message or len(user_message.strip()) == 0:
            raise ValueError("Empty message provided")
        
        if len(user_message) > 5000:  # Reasonable limit
            user_message = user_message[:5000] + "..."
        
        return create_hierarchical_crew(user_message)
    except Exception as e:
        print(f"❌ Routing error: {e}")
        # Return simple fallback crew
        simple_task = Task(
            description=f"Handle user request: {user_message}",
            agent=lead_manager,
            expected_output="Basic response to user query"
        )
        return Crew(
            agents=[lead_manager],
            tasks=[simple_task],
            process=Process.sequential,
            verbose=True
        )

# ================================
# Request Models
# ================================

class AgentRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = {}

# ================================
# API Endpoints
# ================================

@app.get("/")
def root():
    return {
        "name": "Insurance Agent Copilot - CrewAI Hierarchical",
        "version": "2.1.0",
        "powered_by": "CrewAI + Gemini",
        "architecture": "hierarchical",
        "root_agent": "Insurance Agent Supervisor",
        "specialized_agents": 5,
        "mode": "Root Agent Delegation"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "gemini_configured": True,
        "framework": "CrewAI",
        "architecture": "hierarchical",
        "total_tools_implemented": "52+",
        "tool_classes": 12,
        "root_agent": {
            "name": "Insurance Agent Supervisor",
            "role": "Main orchestrator and user interface",
            "delegation_enabled": True,
            "status": "active",
            "tools": 0  # Root agent focuses on delegation
        },
        "specialized_agents": {
            "lead_manager": {
                "status": "active",
                "tools": 6,
                "specialization": "Lead operations, interactions, policies"
            },
            "communicator": {
                "status": "active", 
                "tools": 4,
                "specialization": "Communications, compliance, notifications"
            },
            "task_coordinator": {
                "status": "active",
                "tools": 4,
                "specialization": "Task management, notifications, UI forms"
            },
            "analyst": {
                "status": "active",
                "tools": 3,
                "specialization": "Analytics, insights, audit logs"
            },
            "compliance_officer": {
                "status": "active",
                "tools": 3,
                "specialization": "IRDAI compliance, audit, safety"
            },
            "text_analysis_agent": {
                "status": "active",
                "tools": 5,
                "specialization": "Message generation, lead analysis, interaction updates, scoring improvements"
            }
        }
    }

async def run_crew_async(crew):
    """Run crew in thread pool to avoid blocking"""
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor() as executor:
        result = await loop.run_in_executor(executor, crew.kickoff)
    return result

@app.post("/api/agent")
async def agent_endpoint(request: AgentRequest):
    """
    CrewAI Root Agent endpoint - All requests go through the Insurance Agent Supervisor
    """
    try:
        # Create hierarchical crew with root agent as orchestrator
        crew = route_request(request.message)
        
        # Execute the crew with root agent managing the process (async)
        result = await run_crew_async(crew)
        
        # Format the response
        if isinstance(result, str):
            response = result
        else:
            response = str(result)
        
        return {
            "response": response,
            "orchestrator": "Insurance Agent Supervisor",
            "framework": "CrewAI",
            "process": "hierarchical",
            "delegation_enabled": True,
            "intent_classification": "enabled"
        }
        
    except Exception as e:
        print(f"❌ CrewAI Root Agent error: {e}")
        import traceback
        traceback.print_exc()
        
        # Fallback response
        return {
            "response": f"I apologize, but I encountered an error processing your request. Please try again or contact support. Error: {str(e)}",
            "orchestrator": "Insurance Agent Supervisor",
            "framework": "CrewAI",
            "process": "error_fallback",
            "delegation_enabled": False
        }

@app.post("/api/agent/stream")
async def agent_stream_endpoint(request: AgentRequest):
    """
    Streaming endpoint for CrewAI Root Agent responses
    """
    from fastapi.responses import StreamingResponse
    import json
    
    async def generate():
        try:
            yield f"data: {json.dumps({'type': 'start', 'data': 'Insurance Agent Supervisor starting...'})}\n\n"
            
            # Classify intent first
            intent = classify_intent(request.message)
            yield f"data: {json.dumps({'type': 'intent', 'data': f'Classified as: {intent}'})}\n\n"
            
            # Create hierarchical crew
            crew = route_request(request.message)
            
            yield f"data: {json.dumps({'type': 'orchestrator', 'data': 'Root agent delegating to specialists...'})}\n\n"
            
            # Run crew asynchronously
            result = await run_crew_async(crew)
            
            yield f"data: {json.dumps({'type': 'content', 'data': str(result)})}\n\n"
            yield f"data: {json.dumps({'type': 'done'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")

# ================================
# Legacy Compatibility Endpoints
# ================================

@app.get("/api/leads")
def get_leads_endpoint(filter: Optional[str] = None, search: Optional[str] = None):
    """Legacy endpoint - Get all leads with optional filtering"""
    try:
        if search:
            result = search_leads(search_term=search)
        elif filter:
            if filter.lower() == "hot":
                result = search_leads(temperature="hot")
            elif filter.lower() == "warm":
                result = search_leads(temperature="warm")
            elif filter.lower() == "cold":
                result = search_leads(temperature="cold")
            else:
                result = get_all_leads()
        else:
            result = get_all_leads()
        return {"leads": result, "total": len(result)}
    except Exception as e:
        print(f"❌ Legacy leads endpoint error: {e}")
        return {"leads": [], "total": 0, "error": str(e)}

@app.get("/api/leads/{lead_id}")
def get_lead_endpoint(lead_id: str):
    """Legacy endpoint - Get specific lead with interactions"""
    try:
        lead = get_lead(lead_id)
        if not lead:
            raise HTTPException(status_code=404, detail="Lead not found")
        
        interactions = get_lead_interactions(lead_id)
        sentiment = analyze_sentiment(lead_id)
        
        return {
            "lead": lead,
            "interactions": interactions,
            "sentiment": sentiment
        }
    except Exception as e:
        print(f"❌ Legacy lead detail endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/leads/{lead_id}")
def update_lead_endpoint(lead_id: str, request: Dict[str, Any]):
    """Legacy endpoint - Update lead"""
    try:
        fields = request.get("fields", {})
        result = update_lead(lead_id, **fields)
        return result
    except Exception as e:
        print(f"❌ Legacy lead update endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/leads")
def create_lead_endpoint(request: Dict[str, Any]):
    """Legacy endpoint - Create new lead"""
    try:
        result = create_lead(**request)
        return result
    except Exception as e:
        print(f"❌ Legacy lead create endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/templates")
def get_templates_endpoint():
    """Legacy endpoint - Get all templates"""
    try:
        templates = get_all_templates()
        return {"templates": templates}
    except Exception as e:
        print(f"❌ Legacy templates endpoint error: {e}")
        return {"templates": [], "error": str(e)}

@app.get("/api/templates/{template_id}")
def get_template_endpoint(template_id: str):
    """Legacy endpoint - Get specific template"""
    try:
        template = get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        return template
    except Exception as e:
        print(f"❌ Legacy template endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tasks")
def get_tasks_endpoint(status: Optional[str] = None, priority: Optional[str] = None, lead_id: Optional[str] = None):
    """Legacy endpoint - Get tasks with optional filtering"""
    try:
        if lead_id:
            result = get_tasks_by_lead(lead_id)
        elif status == "due_today":
            result = get_tasks_due_today()
        elif status == "overdue":
            result = get_overdue_tasks()
        elif priority == "urgent":
            result = get_urgent_tasks()
        else:
            result = get_all_tasks(status=status, priority=priority)
        
        return {"tasks": result, "total": len(result)}
    except Exception as e:
        print(f"❌ Legacy tasks endpoint error: {e}")
        return {"tasks": [], "total": 0, "error": str(e)}

@app.get("/api/notifications")
def get_notifications_endpoint(filter_type: Optional[str] = None, unread_only: Optional[bool] = False):
    """Legacy endpoint - Get notifications"""
    try:
        if unread_only:
            result = get_unread_notifications()
        else:
            result = get_all_notifications(filter_type)
        
        return {"notifications": result, "total": len(result)}
    except Exception as e:
        print(f"❌ Legacy notifications endpoint error: {e}")
        return {"notifications": [], "total": 0, "error": str(e)}

@app.get("/api/analytics/summary")
def get_analytics_summary_endpoint():
    """Legacy endpoint - Get analytics summary"""
    try:
        summary = get_daily_summary()
        return summary
    except Exception as e:
        print(f"❌ Legacy analytics endpoint error: {e}")
        return {"error": str(e)}

@app.post("/api/compliance/validate")
def validate_compliance_endpoint(request: Dict[str, Any]):
    """Legacy endpoint - Validate compliance"""
    try:
        content = request.get("content", "")
        result = check_compliance(content)
        return result
    except Exception as e:
        print(f"❌ Legacy compliance endpoint error: {e}")
        return {"is_compliant": False, "error": str(e)}

@app.post("/api/text-analysis")
async def text_analysis_endpoint(request: Dict[str, Any]):
    """Text Analysis endpoint for AI page requests"""
    try:
        action = request.get("action", "analyze")
        lead_id = request.get("leadId", "")
        lead_name = request.get("leadName", "")
        lead_info = request.get("leadInfo", {})
        user_query = request.get("query", "")
        
        # Construct message for text analysis agent
        if action == "whatsapp":
            message = f"Generate a personalized WhatsApp message for lead {lead_name} (ID: {lead_id}). Lead info: {json.dumps(lead_info)}. User query: {user_query}"
        elif action == "email":
            message = f"Generate a professional email for lead {lead_name} (ID: {lead_id}). Lead info: {json.dumps(lead_info)}. User query: {user_query}"
        elif action == "call":
            message = f"Generate a call script and talking points for lead {lead_name} (ID: {lead_id}). Lead info: {json.dumps(lead_info)}. User query: {user_query}"
        elif action == "analyze":
            message = f"Provide comprehensive analysis for lead {lead_name} (ID: {lead_id}). Lead info: {json.dumps(lead_info)}. User query: {user_query}"
        else:
            message = f"Handle request for lead {lead_name} (ID: {lead_id}). Action: {action}. Lead info: {json.dumps(lead_info)}. User query: {user_query}"
        
        # Create text analysis task
        task = create_text_analysis_task(message, action, json.dumps(lead_info))
        
        # Create crew with text analysis agent
        crew = Crew(
            agents=[text_analysis_agent],
            tasks=[task],
            process=Process.sequential,
            verbose=True
        )
        
        # Execute the crew
        result = await run_crew_async(crew)
        
        return {
            "response": str(result),
            "action": action,
            "leadId": lead_id,
            "leadName": lead_name,
            "agent": "Text Analysis Specialist",
            "framework": "CrewAI"
        }
        
    except Exception as e:
        print(f"❌ Text analysis endpoint error: {e}")
        import traceback
        traceback.print_exc()
        
        return {
            "response": f"I apologize, but I encountered an error processing your request. Please try again. Error: {str(e)}",
            "action": request.get("action", "unknown"),
            "leadId": request.get("leadId", ""),
            "leadName": request.get("leadName", ""),
            "agent": "Text Analysis Specialist",
            "framework": "CrewAI",
            "error": True
        }

@app.get("/api/interactions")
def get_interactions_endpoint(lead_id: Optional[str] = None):
    """Legacy endpoint - Get interactions"""
    try:
        if lead_id:
            result = get_lead_interactions(lead_id)
        else:
            result = []  # Could implement get_all_interactions if needed
        
        return {"interactions": result, "total": len(result)}
    except Exception as e:
        print(f"❌ Legacy interactions endpoint error: {e}")
        return {"interactions": [], "total": 0, "error": str(e)}

# ================================
# Startup
# ================================

@app.on_event("startup")
def startup():
    print("🚀 Insurance Agent Copilot - CrewAI Hierarchical Edition")
    print("🎯 Root Agent: Insurance Agent Supervisor (Main Interface)")
    print("   └── Delegates to specialized team:")
    print("       🎯 Lead Manager - Lead management & organization")
    print("       💬 Communication Specialist - Customer communications & compliance")
    print("       📋 Task Coordinator - Task management & follow-ups")
    print("       � Anialytics Expert - Analytics & insights")
    print("       🛡️ Compliance Officer - IRDAI compliance & safety")
    print("       🔤 Text Analysis Specialist - Message generation & lead analysis")
    print(f"🔑 Gemini API: {'✓ Configured' if GEMINI_API_KEY else '✗ Missing'}")
    print("✨ Hierarchical CrewAI orchestration with root agent delegation ready!")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))  # Different port to avoid conflicts
    uvicorn.run(app, host="0.0.0.0", port=port)