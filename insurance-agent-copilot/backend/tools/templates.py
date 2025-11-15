"""
Template Management Tools
Simple functions to manage message templates
"""

import json
import os
from typing import Dict, List, Optional

DATA_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/templates.json')

def _load_templates() -> List[Dict]:
    """Load templates from JSON file"""
    try:
        with open(DATA_PATH, 'r') as f:
            return json.load(f)
    except:
        return []

def get_all_templates() -> List[Dict]:
    """
    Get all message templates
    
    Returns:
        List of all templates
    """
    return _load_templates()

def get_template(template_id: str) -> Optional[Dict]:
    """
    Get a specific template by ID
    
    Args:
        template_id: Template ID
        
    Returns:
        Template data or None
    """
    templates = _load_templates()
    for template in templates:
        if template.get('id') == template_id:
            return template
    return None

def search_templates(category: Optional[str] = None, keyword: Optional[str] = None) -> List[Dict]:
    """
    Search templates by category or keyword
    
    Args:
        category: Filter by category
        keyword: Search in content
        
    Returns:
        Matching templates
    """
    templates = _load_templates()
    results = templates
    
    if category:
        results = [t for t in results if t.get('category') == category]
    
    if keyword:
        kw = keyword.lower()
        results = [t for t in results if kw in t.get('content', '').lower()]
    
    return results
