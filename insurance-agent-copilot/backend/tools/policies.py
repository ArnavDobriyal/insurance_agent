"""
Policy Management Tools
Functions to handle policy documents and policy-related operations
"""

import json
import os
from typing import Dict, List, Optional

# Mock policy data path
POLICIES_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/policies.json')

def _load_policies() -> List[Dict]:
    """Load policies from JSON file"""
    try:
        with open(POLICIES_PATH, 'r') as f:
            return json.load(f)
    except:
        # Return mock data if file doesn't exist
        return [
            {
                "id": "policy-1",
                "leadId": "lead-1",
                "leadName": "Priya Sharma",
                "policyNumber": "LIC001234567",
                "policyType": "Term Life Insurance",
                "premium": 25000,
                "coverageAmount": 1000000,
                "startDate": "2024-01-15",
                "endDate": "2044-01-15",
                "status": "active",
                "documents": [
                    {
                        "id": "doc-1",
                        "name": "Policy Certificate",
                        "type": "pdf",
                        "uploadDate": "2024-01-15",
                        "size": "245KB"
                    }
                ]
            },
            {
                "id": "policy-2",
                "leadId": "lead-2",
                "leadName": "Amit Patel",
                "policyNumber": "HDFC987654321",
                "policyType": "Health Insurance",
                "premium": 15000,
                "coverageAmount": 500000,
                "startDate": "2024-02-01",
                "endDate": "2025-02-01",
                "status": "active",
                "documents": [
                    {
                        "id": "doc-2",
                        "name": "Health Policy Document",
                        "type": "pdf",
                        "uploadDate": "2024-02-01",
                        "size": "180KB"
                    }
                ]
            }
        ]

def upload_policy_document(lead_id: str, document_data: Dict) -> Dict:
    """
    Upload a policy document for a lead
    
    Args:
        lead_id: ID of the lead
        document_data: Document information (name, type, etc.)
        
    Returns:
        Upload result with document ID
    """
    import uuid
    from datetime import datetime
    
    document_id = f"doc-{uuid.uuid4().hex[:8]}"
    
    # Mock upload process
    uploaded_doc = {
        "id": document_id,
        "leadId": lead_id,
        "name": document_data.get("name", "Untitled Document"),
        "type": document_data.get("type", "pdf"),
        "uploadDate": datetime.now().strftime("%Y-%m-%d"),
        "size": document_data.get("size", "Unknown"),
        "status": "uploaded"
    }
    
    return {
        "success": True,
        "document": uploaded_doc,
        "message": f"Document '{uploaded_doc['name']}' uploaded successfully"
    }

def get_lead_policies(lead_id: str) -> List[Dict]:
    """
    Get all policies for a specific lead
    
    Args:
        lead_id: ID of the lead
        
    Returns:
        List of policies for the lead
    """
    policies = _load_policies()
    lead_policies = [policy for policy in policies if policy.get("leadId") == lead_id]
    
    return lead_policies

def get_policy_by_id(policy_id: str) -> Optional[Dict]:
    """
    Get a specific policy by ID
    
    Args:
        policy_id: ID of the policy
        
    Returns:
        Policy data or None if not found
    """
    policies = _load_policies()
    for policy in policies:
        if policy.get("id") == policy_id:
            return policy
    return None

def get_all_policies() -> List[Dict]:
    """
    Get all policies in the system
    
    Returns:
        List of all policies
    """
    return _load_policies()

def get_policies_by_type(policy_type: str) -> List[Dict]:
    """
    Get policies by type (Term Life, Health, etc.)
    
    Args:
        policy_type: Type of policy to filter by
        
    Returns:
        List of policies of the specified type
    """
    policies = _load_policies()
    return [policy for policy in policies if policy.get("policyType", "").lower() == policy_type.lower()]

def get_expiring_policies(days: int = 30) -> List[Dict]:
    """
    Get policies expiring within specified days
    
    Args:
        days: Number of days to look ahead
        
    Returns:
        List of expiring policies
    """
    from datetime import datetime, timedelta
    
    policies = _load_policies()
    cutoff_date = datetime.now() + timedelta(days=days)
    
    expiring_policies = []
    for policy in policies:
        try:
            end_date = datetime.strptime(policy.get("endDate", ""), "%Y-%m-%d")
            if end_date <= cutoff_date and policy.get("status") == "active":
                expiring_policies.append(policy)
        except:
            continue
    
    return expiring_policies

def create_policy(lead_id: str, policy_data: Dict) -> Dict:
    """
    Create a new policy for a lead
    
    Args:
        lead_id: ID of the lead
        policy_data: Policy information
        
    Returns:
        Created policy data
    """
    import uuid
    from datetime import datetime
    
    policy_id = f"policy-{uuid.uuid4().hex[:8]}"
    
    new_policy = {
        "id": policy_id,
        "leadId": lead_id,
        "leadName": policy_data.get("leadName", ""),
        "policyNumber": policy_data.get("policyNumber", f"POL{policy_id.upper()}"),
        "policyType": policy_data.get("policyType", ""),
        "premium": policy_data.get("premium", 0),
        "coverageAmount": policy_data.get("coverageAmount", 0),
        "startDate": policy_data.get("startDate", datetime.now().strftime("%Y-%m-%d")),
        "endDate": policy_data.get("endDate", ""),
        "status": "active",
        "documents": []
    }
    
    return {
        "success": True,
        "policy": new_policy,
        "message": f"Policy {new_policy['policyNumber']} created successfully"
    }