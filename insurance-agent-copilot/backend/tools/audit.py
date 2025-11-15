"""
Audit Log Tools
Functions to access audit logs
"""

from typing import Dict, List, Optional
import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/auditLog.json')

def _load_audit_logs() -> List[Dict]:
    """Load audit logs from JSON file"""
    try:
        with open(DATA_PATH, 'r') as f:
            return json.load(f)
    except:
        return []

def get_all_audit_logs(limit: int = 50) -> List[Dict]:
    """
    Get audit logs
    
    Args:
        limit: Maximum number of logs to return
        
    Returns:
        List of audit log entries
    """
    logs = _load_audit_logs()
    return logs[:limit]

def get_audit_logs_by_lead(lead_id: str) -> List[Dict]:
    """
    Get audit logs for a specific lead
    
    Args:
        lead_id: Lead ID
        
    Returns:
        List of audit logs for the lead
    """
    logs = _load_audit_logs()
    return [log for log in logs if log.get('entityId') == lead_id]

def get_audit_logs_by_action(action_type: str) -> List[Dict]:
    """
    Get audit logs by action type
    
    Args:
        action_type: Action type (update_lead, send_message, etc.)
        
    Returns:
        List of audit logs for that action
    """
    logs = _load_audit_logs()
    return [log for log in logs if log.get('actionType') == action_type]

def get_ai_actions() -> List[Dict]:
    """
    Get AI-suggested actions from audit log
    
    Returns:
        List of AI actions
    """
    logs = _load_audit_logs()
    return [log for log in logs if log.get('source') == 'autopilot']
