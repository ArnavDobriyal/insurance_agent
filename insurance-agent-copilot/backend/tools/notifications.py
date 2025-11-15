"""
Notification Tools
Functions to manage notifications
"""

from typing import Dict, List, Optional

# Mock notifications data
NOTIFICATIONS_DATA = [
    {
        "id": "notif-1",
        "type": "renewal",
        "title": "Policy Renewal Due",
        "message": "Amit Patel's health insurance policy expires in 7 days",
        "leadId": "lead-2",
        "leadName": "Amit Patel",
        "timestamp": "2024-11-15T09:00:00Z",
        "isRead": False,
        "priority": "high",
    },
    {
        "id": "notif-2",
        "type": "followup",
        "title": "Follow-up Reminder",
        "message": "Time to follow up with Priya Sharma about term life quote",
        "leadId": "lead-1",
        "leadName": "Priya Sharma",
        "timestamp": "2024-11-15T10:30:00Z",
        "isRead": False,
        "priority": "high",
    },
    {
        "id": "notif-3",
        "type": "missed-call",
        "title": "Missed Call",
        "message": "Rahul Mehta tried to reach you at 2:30 PM",
        "leadId": "lead-4",
        "leadName": "Rahul Mehta",
        "timestamp": "2024-11-15T14:30:00Z",
        "isRead": False,
        "priority": "medium",
    },
    {
        "id": "notif-4",
        "type": "compliance",
        "title": "Compliance Alert",
        "message": "New IRDAI guidelines published - Review required",
        "timestamp": "2024-11-14T16:00:00Z",
        "isRead": True,
        "priority": "high",
    },
]

def get_all_notifications(filter_type: Optional[str] = None) -> List[Dict]:
    """
    Get all notifications, optionally filtered by type
    
    Args:
        filter_type: Filter by type (renewal, followup, compliance, missed-call)
        
    Returns:
        List of notifications
    """
    notifications = NOTIFICATIONS_DATA.copy()
    
    if filter_type:
        notifications = [n for n in notifications if n.get('type') == filter_type]
    
    return notifications

def get_unread_notifications() -> List[Dict]:
    """
    Get unread notifications
    
    Returns:
        List of unread notifications
    """
    return [n for n in NOTIFICATIONS_DATA if not n.get('isRead', False)]

def get_unread_count() -> int:
    """
    Get count of unread notifications
    
    Returns:
        Number of unread notifications
    """
    return len(get_unread_notifications())

def get_notifications_by_lead(lead_id: str) -> List[Dict]:
    """
    Get notifications for a specific lead
    
    Args:
        lead_id: Lead ID
        
    Returns:
        List of notifications for the lead
    """
    return [n for n in NOTIFICATIONS_DATA if n.get('leadId') == lead_id]

def get_high_priority_notifications() -> List[Dict]:
    """
    Get high priority notifications
    
    Returns:
        List of high priority notifications
    """
    return [n for n in NOTIFICATIONS_DATA if n.get('priority') == 'high' and not n.get('isRead', False)]
