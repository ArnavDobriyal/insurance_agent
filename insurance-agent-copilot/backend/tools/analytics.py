"""
Analytics Tools
Functions for analytics and insights
"""

from typing import Dict, List
import json
import os

LEADS_PATH = os.path.join(os.path.dirname(__file__), '../../src/data/mock/leads.json')

def _load_leads() -> List[Dict]:
    """Load leads from JSON file"""
    try:
        with open(LEADS_PATH, 'r') as f:
            return json.load(f)
    except:
        return []

def get_conversion_stats() -> Dict:
    """
    Get conversion probability statistics
    
    Returns:
        Conversion statistics
    """
    leads = _load_leads()
    
    if not leads:
        return {"average": 0, "high_probability": 0, "total": 0}
    
    probabilities = [l.get('conversionProbability', 0) for l in leads]
    avg_prob = sum(probabilities) / len(probabilities)
    high_prob_count = len([p for p in probabilities if p >= 70])
    
    return {
        "average_conversion_probability": round(avg_prob, 2),
        "high_probability_leads": high_prob_count,
        "total_leads": len(leads),
        "hot_leads": len([l for l in leads if l.get('temperature') == 'hot']),
        "warm_leads": len([l for l in leads if l.get('temperature') == 'warm']),
        "cold_leads": len([l for l in leads if l.get('temperature') == 'cold'])
    }

def get_revenue_forecast() -> Dict:
    """
    Get revenue forecast based on premiums and conversion probability
    
    Returns:
        Revenue forecast
    """
    leads = _load_leads()
    
    total_potential = sum(l.get('premium', 0) for l in leads)
    weighted_forecast = sum(
        l.get('premium', 0) * (l.get('conversionProbability', 0) / 100)
        for l in leads
    )
    
    return {
        "total_potential_revenue": round(total_potential, 2),
        "forecasted_revenue": round(weighted_forecast, 2),
        "high_value_potential": sum(
            l.get('premium', 0) 
            for l in leads 
            if l.get('conversionProbability', 0) >= 70
        )
    }

def get_lead_distribution() -> Dict:
    """
    Get lead distribution by various factors
    
    Returns:
        Lead distribution statistics
    """
    leads = _load_leads()
    
    # By location
    locations = {}
    for lead in leads:
        loc = lead.get('location', 'Unknown')
        locations[loc] = locations.get(loc, 0) + 1
    
    # By product interest
    products = {}
    for lead in leads:
        for product in lead.get('productInterest', []):
            products[product] = products.get(product, 0) + 1
    
    return {
        "by_location": locations,
        "by_product_interest": products,
        "total_leads": len(leads)
    }

def get_top_leads(limit: int = 5) -> List[Dict]:
    """
    Get top leads by conversion probability
    
    Args:
        limit: Number of top leads to return
        
    Returns:
        List of top leads
    """
    leads = _load_leads()
    sorted_leads = sorted(
        leads, 
        key=lambda x: x.get('conversionProbability', 0), 
        reverse=True
    )
    return sorted_leads[:limit]

def get_performance_metrics() -> Dict:
    """
    Get overall performance metrics
    
    Returns:
        Performance metrics
    """
    leads = _load_leads()
    
    total_premium = sum(l.get('premium', 0) for l in leads)
    avg_premium = total_premium / len(leads) if leads else 0
    
    return {
        "total_leads": len(leads),
        "hot_leads": len([l for l in leads if l.get('temperature') == 'hot']),
        "total_premium_value": round(total_premium, 2),
        "average_premium": round(avg_premium, 2),
        "high_conversion_leads": len([l for l in leads if l.get('conversionProbability', 0) >= 70]),
        "renewal_due": len([l for l in leads if 'renewal-due' in l.get('tags', [])])
    }
