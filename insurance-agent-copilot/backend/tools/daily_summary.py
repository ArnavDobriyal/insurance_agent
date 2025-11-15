"""
Daily Summary Tools
Functions to generate daily summaries and briefings
"""

from typing import Dict, List
from datetime import datetime
import json
import os

LEADS_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/leads.json')
TASKS_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/tasks.json')
INTERACTIONS_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/interactions.json')

def _load_json(path: str) -> List[Dict]:
    """Load JSON file"""
    try:
        with open(path, 'r') as f:
            return json.load(f)
    except:
        return []

def get_daily_summary() -> Dict:
    """
    Get comprehensive daily summary including leads, tasks, and recommendations
    
    Returns:
        Daily summary with statistics and action items
    """
    leads = _load_json(LEADS_PATH)
    
    # Mock tasks data
    tasks = [
        {
            "id": "task-1",
            "title": "Follow-up call with Priya Sharma",
            "leadId": "lead-1",
            "leadName": "Priya Sharma",
            "priority": "high",
            "status": "pending",
            "dueDate": "2024-11-15"
        },
        {
            "id": "task-2",
            "title": "Send renewal reminder to Amit Patel",
            "leadId": "lead-2",
            "leadName": "Amit Patel",
            "priority": "high",
            "status": "pending",
            "dueDate": "2024-11-14"
        },
        {
            "id": "task-3",
            "title": "Collect documents from Rahul Mehta",
            "leadId": "lead-4",
            "leadName": "Rahul Mehta",
            "priority": "urgent",
            "status": "in-progress",
            "dueDate": "2024-11-14"
        }
    ]
    
    # Calculate statistics
    hot_leads = [l for l in leads if l.get('temperature') == 'hot']
    warm_leads = [l for l in leads if l.get('temperature') == 'warm']
    renewal_leads = [l for l in leads if 'renewal-due' in l.get('tags', [])]
    followup_leads = [l for l in leads if 'follow-up' in l.get('tags', [])]
    high_value_leads = [l for l in leads if 'high-value' in l.get('tags', [])]
    
    today = datetime.now().strftime("%Y-%m-%d")
    tasks_due_today = [t for t in tasks if t.get('dueDate') == today]
    pending_tasks = [t for t in tasks if t.get('status') == 'pending']
    urgent_tasks = [t for t in tasks if t.get('priority') == 'urgent']
    
    # Calculate potential revenue
    total_potential = sum(l.get('premium', 0) for l in leads)
    hot_potential = sum(l.get('premium', 0) for l in hot_leads)
    
    # Generate action items
    action_items = []
    
    # Urgent tasks
    for task in urgent_tasks:
        action_items.append({
            "priority": "urgent",
            "action": f"Complete: {task['title']}",
            "leadId": task.get('leadId'),
            "leadName": task.get('leadName')
        })
    
    # Hot leads without recent interaction
    for lead in hot_leads:
        if 'follow-up' in lead.get('tags', []):
            action_items.append({
                "priority": "high",
                "action": f"Follow up with {lead['name']} - {lead.get('lastInteractionSummary', 'No recent interaction')}",
                "leadId": lead['id'],
                "leadName": lead['name']
            })
    
    # Renewals due
    for lead in renewal_leads:
        action_items.append({
            "priority": "high",
            "action": f"Send renewal reminder to {lead['name']}",
            "leadId": lead['id'],
            "leadName": lead['name']
        })
    
    return {
        "date": today,
        "summary": {
            "total_leads": len(leads),
            "hot_leads": len(hot_leads),
            "warm_leads": len(warm_leads),
            "cold_leads": len([l for l in leads if l.get('temperature') == 'cold']),
            "renewals_due": len(renewal_leads),
            "follow_ups_needed": len(followup_leads),
            "high_value_leads": len(high_value_leads)
        },
        "tasks": {
            "total": len(tasks),
            "due_today": len(tasks_due_today),
            "pending": len(pending_tasks),
            "urgent": len(urgent_tasks)
        },
        "revenue": {
            "total_potential": total_potential,
            "hot_leads_potential": hot_potential,
            "high_value_potential": sum(l.get('premium', 0) for l in high_value_leads)
        },
        "action_items": action_items[:10],  # Top 10 actions
        "top_priorities": [
            f"{len(urgent_tasks)} urgent tasks need attention",
            f"{len(hot_leads)} hot leads to follow up",
            f"{len(renewal_leads)} renewals due",
            f"₹{hot_potential:,} potential revenue from hot leads"
        ]
    }

def get_todays_briefing() -> str:
    """
    Get a formatted text briefing for today
    
    Returns:
        Formatted briefing text
    """
    summary = get_daily_summary()
    
    briefing = [
        f"DAILY BRIEFING - {summary['date']}",
        "",
        "LEADS OVERVIEW:",
        f"  Total Leads: {summary['summary']['total_leads']}",
        f"  Hot: {summary['summary']['hot_leads']} | Warm: {summary['summary']['warm_leads']} | Cold: {summary['summary']['cold_leads']}",
        f"  Renewals Due: {summary['summary']['renewals_due']}",
        f"  Follow-ups Needed: {summary['summary']['follow_ups_needed']}",
        f"  High Value: {summary['summary']['high_value_leads']}",
        "",
        "TASKS:",
        f"  Total: {summary['tasks']['total']}",
        f"  Due Today: {summary['tasks']['due_today']}",
        f"  Pending: {summary['tasks']['pending']}",
        f"  Urgent: {summary['tasks']['urgent']}",
        "",
        "REVENUE POTENTIAL:",
        f"  Total: ₹{summary['revenue']['total_potential']:,}",
        f"  Hot Leads: ₹{summary['revenue']['hot_leads_potential']:,}",
        f"  High Value: ₹{summary['revenue']['high_value_potential']:,}",
        "",
        "TOP PRIORITIES:",
    ]
    
    for priority in summary['top_priorities']:
        briefing.append(f"  {priority}")
    
    briefing.append("")
    briefing.append("ACTION ITEMS:")
    for i, item in enumerate(summary['action_items'][:5], 1):
        briefing.append(f"  {i}. [{item['priority'].upper()}] {item['action']}")
    
    return "\n".join(briefing)

def create_tasks_from_action_items() -> Dict:
    """
    Automatically create tasks from today's action items.
    This is called when user says "create tasks" or "create this as task" after viewing daily summary.
    
    Returns:
        Dictionary with created tasks count and details
    """
    summary = get_daily_summary()
    action_items = summary.get('action_items', [])
    
    if not action_items:
        return {
            "success": False,
            "message": "No action items found to create tasks from",
            "tasks_created": 0
        }
    
    # Load existing tasks
    try:
        with open(TASKS_PATH, 'r') as f:
            tasks = json.load(f)
    except:
        tasks = []
    
    created_tasks = []
    today = datetime.now().strftime("%Y-%m-%d")
    
    for i, item in enumerate(action_items, 1):
        # Create task from action item
        task_id = f"task-auto-{datetime.now().strftime('%Y%m%d')}-{i}"
        
        # Determine due date based on priority
        if item['priority'] == 'urgent':
            due_date = today
        elif item['priority'] == 'high':
            # Tomorrow
            from datetime import timedelta
            tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
            due_date = tomorrow
        else:
            # 3 days from now
            from datetime import timedelta
            future = (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d")
            due_date = future
        
        new_task = {
            "id": task_id,
            "title": item['action'],
            "leadId": item.get('leadId', ''),
            "leadName": item.get('leadName', 'General'),
            "priority": item['priority'],
            "status": "pending",
            "dueDate": due_date,
            "createdAt": today,
            "createdBy": "AI Assistant",
            "tags": ["auto-generated", "daily-summary"]
        }
        
        tasks.append(new_task)
        created_tasks.append(new_task)
    
    # Save tasks
    try:
        with open(TASKS_PATH, 'w') as f:
            json.dump(tasks, f, indent=2)
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to save tasks: {str(e)}",
            "tasks_created": 0
        }
    
    return {
        "success": True,
        "message": f"Successfully created {len(created_tasks)} tasks from action items",
        "tasks_created": len(created_tasks),
        "tasks": created_tasks
    }
