"""
Lead Management Tools
Simple functions to manage leads
"""

import json
import os
from typing import Dict, List, Optional

# Load mock data
DATA_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/leads.json')

def _load_leads() -> List[Dict]:
    """Load leads from JSON file"""
    try:
        with open(DATA_PATH, 'r') as f:
            return json.load(f)
    except:
        return []

def _save_leads(leads: List[Dict]):
    """Save leads to JSON file"""
    try:
        with open(DATA_PATH, 'w') as f:
            json.dump(leads, f, indent=2)
    except Exception as e:
        print(f"Error saving leads: {e}")

def get_lead(lead_id: str) -> Optional[Dict]:
    """
    Get a single lead by ID
    
    Args:
        lead_id: The ID of the lead
        
    Returns:
        Lead data or None if not found
    """
    leads = _load_leads()
    for lead in leads:
        if lead.get('id') == lead_id:
            return lead
    return None

def search_leads(temperature: Optional[str] = None, search_term: Optional[str] = None) -> List[Dict]:
    """
    Search for leads by temperature or search term
    
    Args:
        temperature: Filter by temperature (hot, warm, cold)
        search_term: Search in name or email
        
    Returns:
        List of matching leads
    """
    leads = _load_leads()
    results = leads
    
    if temperature:
        results = [l for l in results if l.get('temperature') == temperature]
    
    if search_term:
        term = search_term.lower()
        results = [l for l in results if 
                  term in l.get('name', '').lower() or 
                  term in l.get('email', '').lower()]
    
    return results

def update_lead(lead_id: str, **updates) -> Dict:
    """
    Update a lead's information
    
    Args:
        lead_id: The ID of the lead
        **updates: Fields to update (temperature, tags, notes, etc.)
        
    Returns:
        Updated lead data or error
    """
    leads = _load_leads()
    
    for i, lead in enumerate(leads):
        if lead.get('id') == lead_id:
            # Update fields
            for key, value in updates.items():
                if key in ['temperature', 'tags', 'notes', 'productInterest', 'premium']:
                    lead[key] = value
            
            leads[i] = lead
            _save_leads(leads)
            return {"success": True, "lead": lead}
    
    return {"success": False, "error": "Lead not found"}

def create_lead(
    name: str, 
    phone: str, 
    email: str = "", 
    location: str = "",
    age: int = None,
    address: str = "",
    product_interest: str = "",
    premium: int = 0,
    notes: str = ""
) -> Dict:
    """
    Create a new lead
    
    Required fields:
        name: Lead's full name (required)
        phone: Phone number with country code (required)
    
    Optional fields:
        email: Email address
        location: City/State (e.g., "Mumbai, Maharashtra")
        age: Age in years
        address: Full address
        product_interest: Comma-separated products (e.g., "Term Life, Health")
        premium: Expected premium amount
        notes: Initial notes about the lead
        
    Returns:
        Created lead data with success status
    """
    leads = _load_leads()
    
    from datetime import datetime
    
    # Parse product interest
    products = []
    if product_interest:
        products = [p.strip() for p in product_interest.split(',')]
    
    new_lead = {
        "id": f"lead-{int(datetime.now().timestamp())}",
        "name": name,
        "phone": phone,
        "email": email,
        "location": location,
        "address": address,
        "age": age,
        "temperature": "cold",
        "tags": ["new-lead"],
        "productInterest": products,
        "premium": premium,
        "conversionProbability": 0,
        "lastInteractionSummary": notes or "New lead created",
        "lastInteractionDate": datetime.now().isoformat(),
        "assignedTo": "user-1"
    }
    
    leads.append(new_lead)
    _save_leads(leads)
    
    return {"success": True, "lead": new_lead, "message": f"Lead {name} created successfully"}

def get_all_leads() -> List[Dict]:
    """
    Get all leads
    
    Returns:
        List of all leads
    """
    return _load_leads()

def filter_leads_by_tag(tag: str) -> List[Dict]:
    """
    Filter leads by tag
    
    Args:
        tag: Tag to filter by (follow-up, renewal-due, high-value, etc.)
        
    Returns:
        List of leads with the tag
    """
    leads = _load_leads()
    return [l for l in leads if tag in l.get('tags', [])]

def get_renewal_leads() -> List[Dict]:
    """
    Get leads with renewals due
    
    Returns:
        List of leads with renewal-due tag
    """
    return filter_leads_by_tag('renewal-due')

def get_followup_leads() -> List[Dict]:
    """
    Get leads needing follow-up
    
    Returns:
        List of leads with follow-up tag
    """
    return filter_leads_by_tag('follow-up')

def get_high_value_leads() -> List[Dict]:
    """
    Get high-value leads
    
    Returns:
        List of leads with high-value tag
    """
    return filter_leads_by_tag('high-value')

def get_leads_by_assigned_user(user_id: str) -> List[Dict]:
    """
    Get leads assigned to a specific user
    
    Args:
        user_id: User ID
        
    Returns:
        List of leads assigned to the user
    """
    leads = _load_leads()
    return [l for l in leads if l.get('assignedTo') == user_id]

def get_leads_by_location(location: str) -> List[Dict]:
    """
    Get leads in a specific location
    
    Args:
        location: Location to search for
        
    Returns:
        List of leads in that location
    """
    leads = _load_leads()
    location_lower = location.lower()
    return [l for l in leads if location_lower in l.get('location', '').lower()]

def get_leads_with_policy() -> List[Dict]:
    """
    Get leads with existing policies
    
    Returns:
        List of leads with policy numbers
    """
    leads = _load_leads()
    return [l for l in leads if l.get('policyNumber')]
