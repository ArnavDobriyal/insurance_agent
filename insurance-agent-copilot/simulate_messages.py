#!/usr/bin/env python3
"""
Simple Message Simulator for Insurance Agent App
This script simulates incoming messages from leads for testing purposes.
"""

import json
import time
import random
from datetime import datetime
from typing import List, Dict

class MessageSimulator:
    def __init__(self):
        self.leads = [
            {"id": "lead-1", "name": "Priya Sharma"},
            {"id": "lead-2", "name": "Rajesh Kumar"},
            {"id": "lead-3", "name": "Anita Singh"},
            {"id": "lead-4", "name": "Vikram Patel"},
            {"id": "lead-5", "name": "Sunita Gupta"}
        ]
        
        self.message_templates = [
            "Hi, I'm interested in term life insurance. Can you help me?",
            "Please send me details about your endowment plans.",
            "I want to increase my life cover. What are my options?",
            "Can you call me back? I have some questions about premiums.",
            "I received your quote. Can we discuss the terms?",
            "What documents do I need for the policy application?",
            "Is there any discount available on annual premium payment?",
            "I'm 35 years old, what's the best policy for me?",
            "Can you explain the difference between term and endowment plans?",
            "I want to buy insurance for my family. Please advise."
        ]
        
        self.message_types = ["whatsapp", "email"]
        
    def generate_message(self, lead_id: str = None, custom_content: str = None) -> Dict:
        """Generate a single message"""
        if lead_id:
            lead = next((l for l in self.leads if l["id"] == lead_id), None)
            if not lead:
                raise ValueError(f"Lead {lead_id} not found")
        else:
            lead = random.choice(self.leads)
            
        message = {
            "id": f"msg-{int(time.time() * 1000)}",
            "leadId": lead["id"],
            "leadName": lead["name"],
            "type": random.choice(self.message_types),
            "content": custom_content or random.choice(self.message_templates),
            "timestamp": datetime.now().isoformat() + "Z",
            "sender": "lead",
            "isNew": True
        }
        
        return message
    
    def simulate_conversation(self, lead_id: str, num_messages: int = 3) -> List[Dict]:
        """Simulate a conversation with multiple messages"""
        messages = []
        
        conversation_flows = {
            "interest": [
                "Hi, I'm interested in life insurance. Can you help?",
                "What's the premium for ₹50 lakh coverage?",
                "That sounds good. What documents do I need?"
            ],
            "quote_follow": [
                "I received your quote yesterday.",
                "The premium seems a bit high. Any discounts available?",
                "Okay, let's proceed. When can we meet?"
            ],
            "complaint": [
                "I haven't heard back from you in a week.",
                "This is not acceptable service.",
                "Please call me immediately to resolve this."
            ]
        }
        
        flow = random.choice(list(conversation_flows.values()))
        
        for i in range(min(num_messages, len(flow))):
            time.sleep(0.1)  # Small delay between messages
            message = self.generate_message(lead_id, flow[i])
            messages.append(message)
            
        return messages
    
    def save_to_interactions(self, messages: List[Dict], filename: str = "src/data/mock/interactions.json"):
        """Save messages to interactions file"""
        try:
            # Read existing interactions
            try:
                with open(filename, 'r') as f:
                    interactions = json.load(f)
            except FileNotFoundError:
                interactions = []
            
            # Convert messages to interactions format
            for msg in messages:
                interaction = {
                    "id": msg["id"],
                    "leadId": msg["leadId"],
                    "type": msg["type"],
                    "summary": msg["content"],
                    "createdAt": msg["timestamp"],
                    "isNew": True
                }
                interactions.insert(0, interaction)  # Add to beginning
            
            # Save back to file
            with open(filename, 'w') as f:
                json.dump(interactions, f, indent=2)
                
            print(f"✅ Saved {len(messages)} messages to {filename}")
            
        except Exception as e:
            print(f"❌ Error saving to file: {e}")
    
    def print_message(self, message: Dict):
        """Pretty print a message"""
        print(f"""
📱 New {message['type'].upper()} Message
👤 From: {message['leadName']} ({message['leadId']})
💬 Content: "{message['content']}"
🕒 Time: {message['timestamp']}
""")

def main():
    """Main function with interactive menu"""
    simulator = MessageSimulator()
    
    print("🏢 Insurance Agent Message Simulator")
    print("=" * 40)
    
    while True:
        print("\nOptions:")
        print("1. Send single random message")
        print("2. Send message to specific lead")
        print("3. Simulate conversation")
        print("4. Send custom message")
        print("5. Bulk simulate (10 random messages)")
        print("6. List available leads")
        print("0. Exit")
        
        choice = input("\nEnter your choice (0-6): ").strip()
        
        if choice == "0":
            print("👋 Goodbye!")
            break
            
        elif choice == "1":
            message = simulator.generate_message()
            simulator.print_message(message)
            simulator.save_to_interactions([message])
            
        elif choice == "2":
            print("\nAvailable leads:")
            for lead in simulator.leads:
                print(f"  {lead['id']} - {lead['name']}")
            
            lead_id = input("\nEnter lead ID: ").strip()
            try:
                message = simulator.generate_message(lead_id)
                simulator.print_message(message)
                simulator.save_to_interactions([message])
            except ValueError as e:
                print(f"❌ {e}")
                
        elif choice == "3":
            print("\nAvailable leads:")
            for lead in simulator.leads:
                print(f"  {lead['id']} - {lead['name']}")
            
            lead_id = input("\nEnter lead ID: ").strip()
            num_messages = int(input("Number of messages (1-5): ") or "3")
            
            try:
                messages = simulator.simulate_conversation(lead_id, num_messages)
                print(f"\n📱 Simulated conversation with {num_messages} messages:")
                for msg in messages:
                    simulator.print_message(msg)
                simulator.save_to_interactions(messages)
            except ValueError as e:
                print(f"❌ {e}")
                
        elif choice == "4":
            print("\nAvailable leads:")
            for lead in simulator.leads:
                print(f"  {lead['id']} - {lead['name']}")
            
            lead_id = input("\nEnter lead ID: ").strip()
            content = input("Enter message content: ").strip()
            
            if content:
                try:
                    message = simulator.generate_message(lead_id, content)
                    simulator.print_message(message)
                    simulator.save_to_interactions([message])
                except ValueError as e:
                    print(f"❌ {e}")
            else:
                print("❌ Message content cannot be empty")
                
        elif choice == "5":
            print("🚀 Generating 10 random messages...")
            messages = []
            for i in range(10):
                message = simulator.generate_message()
                messages.append(message)
                print(f"  {i+1}. {message['leadName']}: {message['content'][:50]}...")
                time.sleep(0.1)
            
            simulator.save_to_interactions(messages)
            print(f"✅ Generated {len(messages)} messages")
            
        elif choice == "6":
            print("\n👥 Available Leads:")
            for lead in simulator.leads:
                print(f"  📋 {lead['id']} - {lead['name']}")
                
        else:
            print("❌ Invalid choice. Please try again.")

if __name__ == "__main__":
    main()