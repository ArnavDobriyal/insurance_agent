"""
Task Management Tools
Functions to manage tasks and to-dos
"""

import json
import os
from typing import Dict, List, Optional
from datetime import datetime

# Mock tasks data (in a real app, this would be in a database)
TASKS_DATA = [
    {
        "id": "task-1",
        "title": "Follow-up call with Priya Sharma",
        "description": "Discuss term life policy options and send proposal",
        "leadId": "lead-1",
        "leadName": "Priya Sharma",
        "priority": "high",
        "status": "pending",
        "dueDate": "2024-11-15",
        "assignedTo": "user-1",
        "createdAt": "2024-11-13T10:30:00Z",
        "tags": ["follow-up", "hot-lead"]
    },
    {
        "id": "task-2",
        "title": "Send renewal reminder to Amit Patel",
        "description": "Policy renewal due next month. Send reminder and upgrade options",
        "leadId": "lead-2",
        "leadName": "Amit Patel",
        "priority": "high",
        "status": "pending",
        "dueDate": "2024-11-14",
        "assignedTo": "user-1",
        "createdAt": "2024-11-10T14:20:00Z",
        "tags": ["renewal", "existing-customer"]
    },
    {
        "id": "task-3",
        "title": "Collect documents from Rahul Mehta",
        "description": "Need KYC documents and medical reports for policy processing",
        "leadId": "lead-4",
        "leadName": "Rahul Mehta",
        "priority": "urgent",
        "status": "in-progress",
        "dueDate": "2024-11-14",
        "assignedTo": "user-1",
        "createdAt": "2024-11-13T16:45:00Z",
        "tags": ["documentation", "urgent"]
    },
    {
        "id": "task-4",
        "title": "Schedule meeting with Sneha Reddy",
        "description": "Initial consultation to discuss insurance needs",
        "leadId": "lead-3",
        "leadName": "Sneha Reddy",
        "priority": "medium",
        "status": "completed",
        "dueDate": "2024-11-12",
        "completedAt": "2024-11-12T15:30:00Z",
        "assignedTo": "user-2",
        "createdAt": "2024-11-08T09:15:00Z",
        "tags": ["meeting", "new-lead"]
    },
    {
        "id": "task-5",
        "title": "Send policy documents to Priya Sharma",
        "description": "Email final policy documents and payment link",
        "leadId": "lead-1",
        "leadName": "Priya Sharma",
        "priority": "high",
        "status": "pending",
        "dueDate": "2024-11-16",
        "assignedTo": "user-1",
        "createdAt": "2024-11-13T11:00:00Z",
        "tags": ["documentation", "follow-up"]
    }
]

def get_all_tasks(status: Optional[str] = None, priority: Optional[str] = None) -> List[Dict]:
    """
    Get all tasks, optionally filtered by status or priority
    
    Args:
        status: Filter by status (pending, in-progress, completed)
        priority: Filter by priority (low, medium, high, urgent)
        
    Returns:
        List of tasks
    """
    tasks = TASKS_DATA.copy()
    
    if status:
        tasks = [t for t in tasks if t.get('status') == status]
    
    if priority:
        tasks = [t for t in tasks if t.get('priority') == priority]
    
    return tasks

def get_task(task_id: str) -> Optional[Dict]:
    """
    Get a specific task by ID
    
    Args:
        task_id: Task ID
        
    Returns:
        Task data or None
    """
    for task in TASKS_DATA:
        if task.get('id') == task_id:
            return task
    return None

def get_tasks_by_lead(lead_id: str) -> List[Dict]:
    """
    Get all tasks for a specific lead
    
    Args:
        lead_id: Lead ID
        
    Returns:
        List of tasks for the lead
    """
    return [t for t in TASKS_DATA if t.get('leadId') == lead_id]

def search_tasks(search_term: str) -> List[Dict]:
    """
    Search tasks by title, description, or lead name
    
    Args:
        search_term: Search term
        
    Returns:
        List of matching tasks
    """
    term = search_term.lower()
    results = []
    
    for task in TASKS_DATA:
        if (term in task.get('title', '').lower() or
            term in task.get('description', '').lower() or
            term in task.get('leadName', '').lower()):
            results.append(task)
    
    return results

def get_tasks_due_today() -> List[Dict]:
    """
    Get tasks due today
    
    Returns:
        List of tasks due today
    """
    today = datetime.now().strftime("%Y-%m-%d")
    return [t for t in TASKS_DATA if t.get('dueDate') == today and t.get('status') != 'completed']

def get_overdue_tasks() -> List[Dict]:
    """
    Get overdue tasks
    
    Returns:
        List of overdue tasks
    """
    today = datetime.now().strftime("%Y-%m-%d")
    return [t for t in TASKS_DATA if t.get('dueDate', '') < today and t.get('status') != 'completed']

def get_urgent_tasks() -> List[Dict]:
    """
    Get urgent tasks
    
    Returns:
        List of urgent priority tasks
    """
    return [t for t in TASKS_DATA if t.get('priority') == 'urgent' and t.get('status') != 'completed']
