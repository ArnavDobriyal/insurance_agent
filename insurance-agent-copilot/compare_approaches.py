#!/usr/bin/env python3
"""
Comparison Script: LangChain vs Root Agent CrewAI
Shows the differences between the two approaches
"""

import requests
import json
import time
from typing import Dict, Any

LANGCHAIN_URL = "http://localhost:5000"  # Original LangChain version
CREWAI_URL = "http://localhost:5001"     # New Root Agent CrewAI version

class ApproachComparison:
    def __init__(self):
        self.session = requests.Session()
    
    def test_endpoint(self, url: str, query: str) -> Dict[str, Any]:
        """Test an endpoint with a query"""
        try:
            start_time = time.time()
            response = self.session.post(
                f"{url}/api/agent",
                json={"message": query},
                timeout=30
            )
            end_time = time.time()
            
            if response.status_code == 200:
                data = response.json()
                data['response_time'] = end_time - start_time
                return data
            else:
                return {
                    "error": f"HTTP {response.status_code}",
                    "response_time": end_time - start_time
                }
        except Exception as e:
            return {
                "error": str(e),
                "response_time": 0
            }
    
    def check_service_availability(self):
        """Check which services are available"""
        print("🔍 Checking Service Availability...")
        
        langchain_available = False
        crewai_available = False
        
        try:
            response = requests.get(f"{LANGCHAIN_URL}/health", timeout=5)
            if response.status_code == 200:
                langchain_available = True
                print("✅ LangChain service (port 5000): Available")
            else:
                print("❌ LangChain service (port 5000): Not responding")
        except:
            print("❌ LangChain service (port 5000): Not available")
        
        try:
            response = requests.get(f"{CREWAI_URL}/health", timeout=5)
            if response.status_code == 200:
                crewai_available = True
                print("✅ Root Agent CrewAI (port 5001): Available")
            else:
                print("❌ Root Agent CrewAI (port 5001): Not responding")
        except:
            print("❌ Root Agent CrewAI (port 5001): Not available")
        
        return langchain_available, crewai_available
    
    def compare_architectures(self):
        """Compare the architectural differences"""
        print("\n" + "="*70)
        print("🏗️  ARCHITECTURAL COMPARISON")
        print("="*70)
        
        print("\n📊 LangChain Approach (Original):")
        print("   🔧 Architecture: Single Agent + 52+ Tools")
        print("   🎯 Processing: Sequential tool calling")
        print("   🧠 Intelligence: Tool-based reasoning")
        print("   📝 Complexity: High (many tools to manage)")
        print("   🔄 Scalability: Add more tools")
        print("   🎪 Orchestration: Single agent decides everything")
        
        print("\n🎯 Root Agent CrewAI (New):")
        print("   🔧 Architecture: Hierarchical (1 Root + 5 Specialists)")
        print("   🎯 Processing: Intelligent delegation")
        print("   🧠 Intelligence: Domain expertise + coordination")
        print("   📝 Complexity: Moderate (specialized agents)")
        print("   🔄 Scalability: Add more specialist agents")
        print("   🎪 Orchestration: Root agent delegates to experts")
    
    def compare_responses(self, query: str):
        """Compare responses from both approaches"""
        print(f"\n📝 Testing Query: '{query}'")
        print("-" * 60)
        
        # Test LangChain
        print("🔧 LangChain Response:")
        langchain_result = self.test_endpoint(LANGCHAIN_URL, query)
        
        if "error" in langchain_result:
            print(f"   ❌ Error: {langchain_result['error']}")
        else:
            print(f"   ⏱️  Response Time: {langchain_result.get('response_time', 0):.2f}s")
            print(f"   🤖 Agent: {langchain_result.get('agent', 'N/A')}")
            print(f"   📄 Response Length: {len(langchain_result.get('response', ''))}")
            response = langchain_result.get('response', 'No response')
            print(f"   📝 Preview: {response[:150]}{'...' if len(response) > 150 else ''}")
        
        print()
        
        # Test CrewAI Root Agent
        print("🎯 Root Agent CrewAI Response:")
        crewai_result = self.test_endpoint(CREWAI_URL, query)
        
        if "error" in crewai_result:
            print(f"   ❌ Error: {crewai_result['error']}")
        else:
            print(f"   ⏱️  Response Time: {crewai_result.get('response_time', 0):.2f}s")
            print(f"   🎯 Orchestrator: {crewai_result.get('orchestrator', 'N/A')}")
            print(f"   🔄 Process: {crewai_result.get('process', 'N/A')}")
            print(f"   🤝 Delegation: {crewai_result.get('delegation_enabled', 'N/A')}")
            print(f"   📄 Response Length: {len(crewai_result.get('response', ''))}")
            response = crewai_result.get('response', 'No response')
            print(f"   📝 Preview: {response[:150]}{'...' if len(response) > 150 else ''}")
    
    def run_comparison_suite(self):
        """Run a comprehensive comparison"""
        print("🔄 LANGCHAIN vs ROOT AGENT CREWAI COMPARISON")
        print("=" * 70)
        
        # Check availability
        langchain_available, crewai_available = self.check_service_availability()
        
        if not langchain_available and not crewai_available:
            print("\n❌ Neither service is available. Please start them:")
            print("   LangChain: python start.py")
            print("   Root Agent: python start_crewai.py")
            return
        
        if not langchain_available:
            print("\n⚠️  LangChain service not available. Starting Root Agent demo only.")
            print("   To compare both, start: python start.py")
        
        if not crewai_available:
            print("\n⚠️  Root Agent service not available. Starting LangChain demo only.")
            print("   To compare both, start: python start_crewai.py")
        
        # Show architectural differences
        self.compare_architectures()
        
        # Test queries
        test_queries = [
            "Show me hot leads",
            "What tasks are due today?",
            "Generate daily summary",
            "Is 'guaranteed returns' compliant?",
            "Find Priya Sharma and send her a WhatsApp message"
        ]
        
        print(f"\n🧪 RESPONSE COMPARISON")
        print("="*70)
        
        for query in test_queries:
            if langchain_available or crewai_available:
                self.compare_responses(query)
                time.sleep(2)
        
        # Summary
        print("\n" + "="*70)
        print("📊 COMPARISON SUMMARY")
        print("="*70)
        
        print("\n🔧 LangChain Strengths:")
        print("   ✅ Comprehensive tool coverage (52+ tools)")
        print("   ✅ Mature framework with extensive documentation")
        print("   ✅ Direct tool access for specific operations")
        print("   ✅ Lower coordination overhead")
        
        print("\n🎯 Root Agent CrewAI Strengths:")
        print("   ✅ Intelligent delegation and coordination")
        print("   ✅ Domain-specific expertise from specialists")
        print("   ✅ Better handling of complex, multi-domain queries")
        print("   ✅ More natural conversation flow")
        print("   ✅ Easier to maintain and extend")
        
        print("\n🎯 Recommendations:")
        print("   📝 Simple, single-domain queries → LangChain")
        print("   🔥 Complex, multi-domain queries → Root Agent CrewAI")
        print("   💬 Conversational interactions → Root Agent CrewAI")
        print("   🛠️  Direct tool access → LangChain")
        print("   🎪 Coordinated workflows → Root Agent CrewAI")

def main():
    """Main comparison function"""
    comparison = ApproachComparison()
    comparison.run_comparison_suite()

if __name__ == "__main__":
    main()