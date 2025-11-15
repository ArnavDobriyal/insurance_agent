"""
Interaction Management Tools
Simple functions to manage lead interactions
"""

import json
import os
from typing import Dict, List, Optional
from datetime import datetime

DATA_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/interactions.json')

def _load_interactions() -> List[Dict]:
    """Load interactions from JSON file"""
    try:
        with open(DATA_PATH, 'r') as f:
            return json.load(f)
    except:
        return []

def _save_interactions(interactions: List[Dict]):
    """Save interactions to JSON file"""
    try:
        with open(DATA_PATH, 'w') as f:
            json.dump(interactions, f, indent=2)
    except Exception as e:
        print(f"Error saving interactions: {e}")

def get_lead_interactions(lead_id: str) -> List[Dict]:
    """
    Get all interactions for a lead
    
    Args:
        lead_id: Lead ID
        
    Returns:
        List of interactions
    """
    interactions = _load_interactions()
    return [i for i in interactions if i.get('leadId') == lead_id]

def add_interaction(lead_id: str, interaction_type: str, content: str, sentiment: float = 0.5) -> Dict:
    """
    Add a new interaction for a lead
    
    Args:
        lead_id: Lead ID
        interaction_type: Type (call, email, message, meeting)
        content: Interaction content/notes
        sentiment: Sentiment score (0-1)
        
    Returns:
        Created interaction
    """
    interactions = _load_interactions()
    
    new_interaction = {
        "id": f"interaction-{int(datetime.now().timestamp())}",
        "leadId": lead_id,
        "type": interaction_type,
        "content": content,
        "sentiment": sentiment,
        "createdAt": datetime.now().isoformat(),
        "userId": "user-1"
    }
    
    interactions.append(new_interaction)
    _save_interactions(interactions)
    
    return {"success": True, "interaction": new_interaction}

def analyze_sentiment(lead_id: str) -> Dict:
    """
    Analyze sentiment from lead interactions
    
    Args:
        lead_id: Lead ID
        
    Returns:
        Sentiment analysis
    """
    interactions = get_lead_interactions(lead_id)
    
    if not interactions:
        return {
            "average_sentiment": 0.5,
            "total_interactions": 0,
            "trend": "neutral"
        }
    
    sentiments = [i.get('sentiment', 0.5) for i in interactions]
    avg = sum(sentiments) / len(sentiments)
    
    trend = "positive" if avg > 0.6 else "negative" if avg < 0.4 else "neutral"
    
    return {
        "average_sentiment": avg,
        "total_interactions": len(interactions),
        "trend": trend,
        "recent_sentiments": sentiments[-5:]  # Last 5
    }
