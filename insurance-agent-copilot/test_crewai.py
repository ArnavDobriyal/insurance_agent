#!/usr/bin/env python3
"""
Test script for CrewAI Insurance Agent Implementation
"""

import requests
import json
import time

BASE_URL = "http://localhost:5001"

def test_health():
    """Test health endpoint"""
    print("🔍 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Framework: {data.get('framework')}")
            print(f"   Agents: {len(data.get('agents', {}))}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_agent_endpoint():
    """Test root agent endpoint"""
    print("\n🎯 Testing Root Agent (Insurance Agent Supervisor)...")
    
    test_queries = [
        "Show me all hot leads",
        "What tasks are due today?", 
        "Generate daily summary and create follow-up tasks",
        "Is 'guaranteed returns' compliant? Suggest alternatives",
        "Find Priya Sharma and send her a WhatsApp message",
        "I need help with leads, tasks, and compliance - give me an overview"
    ]
    
    for query in test_queries:
        print(f"\n📝 Query: {query}")
        try:
            response = requests.post(
                f"{BASE_URL}/api/agent",
                json={"message": query},
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Response received")
                print(f"   Orchestrator: {data.get('orchestrator', 'N/A')}")
                print(f"   Framework: {data.get('framework', 'N/A')}")
                print(f"   Process: {data.get('process', 'N/A')}")
                print(f"   Delegation: {data.get('delegation_enabled', 'N/A')}")
                print(f"   Response length: {len(data.get('response', ''))}")
            else:
                print(f"❌ Request failed: {response.status_code}")
                print(f"   Error: {response.text}")
                
        except Exception as e:
            print(f"❌ Request error: {e}")

def test_legacy_endpoints():
    """Test legacy compatibility endpoints"""
    print("\n🔄 Testing legacy endpoints...")
    
    endpoints = [
        "/api/leads",
        "/api/templates"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint} - {len(data.get(list(data.keys())[0], []))} items")
            else:
                print(f"❌ {endpoint} failed: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint} error: {e}")

def main():
    """Run all tests"""
    print("🧪 Root Agent Insurance Copilot Tests")
    print("🎯 Testing hierarchical CrewAI with delegation")
    print("=" * 50)
    
    # Wait for server to be ready
    print("⏳ Waiting for server to start...")
    time.sleep(2)
    
    # Run tests
    if test_health():
        test_agent_endpoint()
        test_legacy_endpoints()
    else:
        print("❌ Server not ready. Make sure to run: python start_crewai.py")
    
    print("\n" + "=" * 40)
    print("🎯 Test completed!")

if __name__ == "__main__":
    main()