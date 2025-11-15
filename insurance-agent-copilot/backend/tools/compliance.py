"""
IRDAI Compliance Tools
Simple functions to validate compliance
"""

from typing import Dict, List

# IRDAI risky phrases
RISKY_PHRASES = {
    "guaranteed returns": "potential returns based on market performance",
    "assured profit": "opportunity for growth",
    "100% safe": "designed with risk management features",
    "no risk": "managed risk approach",
    "guaranteed income": "regular income options available",
    "tax free": "tax benefits as per prevailing tax laws",
    "best policy": "suitable policy option",
    "highest returns": "competitive returns",
    "zero risk": "risk-managed investment",
    "guaranteed growth": "growth potential based on market conditions",
}

def check_compliance(content: str) -> Dict:
    """
    Check if content is IRDAI compliant
    
    Args:
        content: Text content to check
        
    Returns:
        Compliance status with violations and safe alternative
    """
    violations = []
    content_lower = content.lower()
    
    # Check for risky phrases
    for phrase, alternative in RISKY_PHRASES.items():
        if phrase in content_lower:
            violations.append({
                "phrase": phrase,
                "alternative": alternative,
                "severity": "error"
            })
    
    is_compliant = len(violations) == 0
    
    # Generate safe alternative if needed
    safe_content = content
    if not is_compliant:
        for violation in violations:
            import re
            pattern = re.compile(re.escape(violation["phrase"]), re.IGNORECASE)
            safe_content = pattern.sub(violation["alternative"], safe_content)
    
    return {
        "is_compliant": is_compliant,
        "violations": violations,
        "safe_alternative": safe_content if not is_compliant else None
    }

def get_safe_alternative(content: str) -> str:
    """
    Get IRDAI-compliant version of content
    
    Args:
        content: Original content
        
    Returns:
        Safe, compliant version
    """
    result = check_compliance(content)
    return result.get("safe_alternative") or content

def validate_message(message: str) -> Dict:
    """
    Validate a message for compliance
    
    Args:
        message: Message to validate
        
    Returns:
        Validation result
    """
    return check_compliance(message)
