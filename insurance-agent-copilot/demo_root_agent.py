#!/usr/bin/env python3
"""
Root Agent Demo Script
Demonstrates the hierarchical CrewAI architecture with intelligent delegation
"""

import requests
import json
import time
from typing import Dict, Any

BASE_URL = "http://localhost:5001"

class RootAgentDemo:
    def __init__(self):
        self.session = requests.Session()
        
    def send_request(self, message: str) -> Dict[str, Any]:
        """Send request to root agent"""
        try:
            response = self.session.post(
                f"{BASE_URL}/api/agent",
                json={"message": message},
                timeout=60
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"HTTP {response.status_code}: {response.text}"}
                
        except Exception as e:
            return {"error": str(e)}
    
    def demo_simple_delegation(self):
        """Demo: Simple single-agent delegation"""
        print("\n" + "="*60)
        print("🎯 DEMO 1: Simple Single-Agent Delegation")
        print("="*60)
        
        queries = [
            ("Lead Search", "Show me all hot leads"),
            ("Task Management", "What tasks are due today?"),
            ("Analytics", "Give me today's performance metrics"),
            ("Compliance Check", "Is 'guaranteed returns' compliant?")
        ]
        
        for category, query in queries:
            print(f"\n📝 {category}: {query}")
            print("-" * 50)
            
            result = self.send_request(query)
            
            if "error" in result:
                print(f"❌ Error: {result['error']}")
            else:
                print(f"✅ Orchestrator: {result.get('orchestrator', 'N/A')}")
                print(f"🔄 Process: {result.get('process', 'N/A')}")
                print(f"📄 Response: {result.get('response', 'No response')[:200]}...")
            
            time.sleep(2)
    
    def demo_complex_delegation(self):
        """Demo: Complex multi-agent delegation"""
        print("\n" + "="*60)
        print("🎯 DEMO 2: Complex Multi-Agent Delegation")
        print("="*60)
        
        complex_queries = [
            "Find Priya Sharma, check if my message is compliant, and schedule a call",
            "Show me hot leads and send WhatsApp to the top prospect",
            "Generate daily summary and create follow-up tasks for overdue items",
            "I need help with leads, tasks, and compliance - give me a complete overview"
        ]
        
        for i, query in enumerate(complex_queries, 1):
            print(f"\n🔥 Complex Query {i}: {query}")
            print("-" * 60)
            
            result = self.send_request(query)
            
            if "error" in result:
                print(f"❌ Error: {result['error']}")
            else:
                print(f"✅ Root Agent Response:")
                print(f"   Orchestrator: {result.get('orchestrator', 'N/A')}")
                print(f"   Delegation: {result.get('delegation_enabled', 'N/A')}")
                print(f"   Framework: {result.get('framework', 'N/A')}")
                print(f"\n📋 Coordinated Response:")
                response = result.get('response', 'No response')
                # Print first 300 characters for demo
                print(f"   {response[:300]}{'...' if len(response) > 300 else ''}")
            
            time.sleep(3)
    
    def demo_conversational_flow(self):
        """Demo: Multi-turn conversational flow"""
        print("\n" + "="*60)
        print("🎯 DEMO 3: Conversational Flow with Context")
        print("="*60)
        
        conversation = [
            "Hello, I'm new to the system. Can you help me understand what you can do?",
            "Show me my hot leads",
            "Can you send a WhatsApp message to the first lead?",
            "Is that message compliant with IRDAI regulations?",
            "Create a follow-up task for tomorrow",
            "Give me a summary of what we just accomplished"
        ]
        
        for i, message in enumerate(conversation, 1):
            print(f"\n💬 Turn {i}: {message}")
            print("-" * 50)
            
            result = self.send_request(message)
            
            if "error" in result:
                print(f"❌ Error: {result['error']}")
            else:
                response = result.get('response', 'No response')
                print(f"🤖 Root Agent: {response[:250]}{'...' if len(response) > 250 else ''}")
            
            time.sleep(2)
    
    def demo_performance_comparison(self):
        """Demo: Performance metrics"""
        print("\n" + "="*60)
        print("🎯 DEMO 4: Performance Analysis")
        print("="*60)
        
        test_query = "Show me hot leads and generate analytics"
        iterations = 3
        
        print(f"📊 Testing query: '{test_query}'")
        print(f"🔄 Running {iterations} iterations...")
        
        times = []
        
        for i in range(iterations):
            print(f"\n⏱️  Iteration {i+1}:")
            
            start_time = time.time()
            result = self.send_request(test_query)
            end_time = time.time()
            
            response_time = end_time - start_time
            times.append(response_time)
            
            if "error" in result:
                print(f"   ❌ Error: {result['error']}")
            else:
                print(f"   ✅ Success in {response_time:.2f}s")
                print(f"   📄 Response length: {len(result.get('response', ''))}")
        
        if times:
            avg_time = sum(times) / len(times)
            print(f"\n📈 Performance Summary:")
            print(f"   Average response time: {avg_time:.2f}s")
            print(f"   Min response time: {min(times):.2f}s")
            print(f"   Max response time: {max(times):.2f}s")
    
    def check_system_health(self):
        """Check if the root agent system is healthy"""
        print("🔍 Checking Root Agent System Health...")
        
        try:
            response = self.session.get(f"{BASE_URL}/health")
            
            if response.status_code == 200:
                health_data = response.json()
                print("✅ System Health Check Passed")
                print(f"   Architecture: {health_data.get('architecture', 'N/A')}")
                print(f"   Root Agent: {health_data.get('root_agent', {}).get('name', 'N/A')}")
                print(f"   Delegation: {health_data.get('root_agent', {}).get('delegation_enabled', 'N/A')}")
                print(f"   Specialists: {len(health_data.get('specialized_agents', {}))}")
                return True
            else:
                print(f"❌ Health check failed: {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Health check error: {e}")
            return False
    
    def run_full_demo(self):
        """Run the complete demo suite"""
        print("🎯 ROOT AGENT DEMONSTRATION")
        print("🤖 Hierarchical CrewAI with Intelligent Delegation")
        print("=" * 70)
        
        # Check system health first
        if not self.check_system_health():
            print("❌ System not ready. Please start the root agent system first:")
            print("   python start_crewai.py")
            return
        
        print("\n⏳ Starting demonstration in 3 seconds...")
        time.sleep(3)
        
        try:
            # Run all demos
            self.demo_simple_delegation()
            self.demo_complex_delegation()
            self.demo_conversational_flow()
            self.demo_performance_comparison()
            
            print("\n" + "="*70)
            print("🎉 ROOT AGENT DEMONSTRATION COMPLETE!")
            print("="*70)
            print("✅ Key Features Demonstrated:")
            print("   🎯 Intelligent request routing")
            print("   🤝 Multi-agent coordination")
            print("   💬 Natural conversation flow")
            print("   🔄 Complex task delegation")
            print("   📊 Performance optimization")
            print("\n🚀 The Root Agent successfully orchestrated all interactions!")
            
        except KeyboardInterrupt:
            print("\n\n⏹️  Demo interrupted by user")
        except Exception as e:
            print(f"\n❌ Demo error: {e}")

def main():
    """Main demo function"""
    demo = RootAgentDemo()
    demo.run_full_demo()

if __name__ == "__main__":
    main()