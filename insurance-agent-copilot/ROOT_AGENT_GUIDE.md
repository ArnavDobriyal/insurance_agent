# 🎯 Root Agent Complete Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd insurance_agent/insurance-agent-copilot/backend
pip install -r requirements_crewai.txt
```

### 2. Configure Environment
```bash
# Set up your API key
export GEMINI_API_KEY="your_actual_api_key_here"

# Or add to .env file
echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env
```

### 3. Start Root Agent System
```bash
cd insurance_agent/insurance-agent-copilot
python start_crewai.py
```

### 4. Test the System
```bash
# Basic test
python test_crewai.py

# Full demonstration
python demo_root_agent.py
```

## 🎯 Understanding the Root Agent

### What is the Root Agent?
The **Insurance Agent Supervisor** is your main AI assistant that:
- Acts as a single point of contact
- Understands your requests in natural language
- Intelligently delegates tasks to specialist agents
- Coordinates responses from multiple experts
- Provides comprehensive, unified answers

### How It Works
```
Your Request → Root Agent → Analyzes Intent → Delegates to Specialists → Coordinates Response → Returns Answer
```

## 👥 Meet Your AI Team

### 🎯 Insurance Agent Supervisor (Root Agent)
**Your Main Contact**
- Understands natural language requests
- Routes tasks to appropriate specialists
- Coordinates multi-agent responses
- Maintains conversation context

### 🎯 Lead Manager
**Lead Operations Specialist**
- Searches and manages leads
- Updates lead information
- Classifies lead temperature
- Tracks lead progression

### 💬 Communication Specialist
**Customer Interaction Expert**
- Drafts messages (WhatsApp, SMS, Email)
- Ensures IRDAI compliance
- Handles call scheduling
- Manages communication workflows

### 📋 Task Coordinator
**Workflow Management Expert**
- Creates and manages tasks
- Tracks deadlines and priorities
- Coordinates follow-up activities
- Ensures nothing is missed

### 📊 Analytics Expert
**Data & Insights Specialist**
- Generates performance reports
- Creates revenue forecasts
- Provides daily summaries
- Analyzes trends and patterns

### 🛡️ Compliance Officer
**Regulatory Safety Expert**
- Validates IRDAI compliance
- Suggests safe alternatives
- Reviews all communications
- Ensures regulatory adherence

## 💬 How to Interact with the Root Agent

### Simple Requests
Just ask naturally - the Root Agent will understand and delegate appropriately:

```
"Show me hot leads"
→ Root Agent delegates to Lead Manager

"What tasks are due today?"
→ Root Agent delegates to Task Coordinator

"Generate daily summary"
→ Root Agent delegates to Analytics Expert
```

### Complex Requests
The Root Agent can handle multi-step requests involving multiple specialists:

```
"Find Priya Sharma and send her a compliant WhatsApp message"
→ Root Agent delegates to:
   - Lead Manager (find Priya)
   - Communication Specialist (draft message)
   - Compliance Officer (ensure compliance)
```

### Conversational Flow
The Root Agent maintains context across multiple interactions:

```
You: "Show me hot leads"
Root Agent: [Shows hot leads via Lead Manager]

You: "Send WhatsApp to the first one"
Root Agent: [Remembers context, drafts message via Communication Specialist]

You: "Is that message compliant?"
Root Agent: [Checks compliance via Compliance Officer]
```

## 🎯 Example Use Cases

### Daily Workflow Management
```
"Give me my daily briefing and create tasks for follow-ups"

Root Agent coordinates:
1. Analytics Expert → Generates daily summary
2. Task Coordinator → Creates follow-up tasks
3. Returns comprehensive briefing with action items
```

### Lead Management & Communication
```
"Find high-value leads in Mumbai and draft renewal messages"

Root Agent coordinates:
1. Lead Manager → Searches leads by location and value
2. Communication Specialist → Drafts renewal messages
3. Compliance Officer → Validates message compliance
4. Returns leads with compliant messages ready to send
```

### Compliance & Safety Checks
```
"Check if my marketing message is compliant and suggest improvements"

Root Agent coordinates:
1. Compliance Officer → Reviews message for violations
2. Communication Specialist → Suggests improvements
3. Returns compliance report with safe alternatives
```

### Performance Analysis
```
"Analyze my performance and suggest improvements"

Root Agent coordinates:
1. Analytics Expert → Generates performance metrics
2. Lead Manager → Analyzes lead conversion rates
3. Task Coordinator → Reviews task completion rates
4. Returns comprehensive performance analysis with recommendations
```

## 🔧 Advanced Features

### Context Awareness
The Root Agent remembers:
- Previous requests in the conversation
- Lead information you've accessed
- Tasks you've created
- Messages you've drafted

### Intelligent Routing
The Root Agent automatically determines:
- Which specialists are needed
- The order of operations
- How to combine results
- What context to provide

### Quality Control
The Root Agent ensures:
- Responses are comprehensive
- Information is accurate
- Compliance is maintained
- User needs are fully addressed

## 📊 API Usage

### Single Endpoint
All requests go through one endpoint:
```bash
POST http://localhost:5001/api/agent
Content-Type: application/json

{
    "message": "Your natural language request"
}
```

### Response Format
```json
{
    "response": "Comprehensive answer from coordinated agents",
    "orchestrator": "Insurance Agent Supervisor",
    "framework": "CrewAI",
    "process": "hierarchical",
    "delegation_enabled": true
}
```

### Streaming Support
For real-time responses:
```bash
POST http://localhost:5001/api/agent/stream
```

## 🎯 Best Practices

### 1. Be Natural
- Use conversational language
- Don't worry about specific commands
- Ask for what you need, not how to do it

### 2. Be Specific When Needed
```
Good: "Find leads in Mumbai interested in term life insurance"
Better than: "Find leads"
```

### 3. Combine Related Requests
```
Good: "Show me overdue tasks and create follow-ups for hot leads"
Better than: Two separate requests
```

### 4. Use Context
```
After getting lead info:
"Send them a message" (Root Agent remembers which lead)
```

## 🚦 System Status

### Health Check
```bash
curl http://localhost:5001/health
```

### Expected Response
```json
{
    "status": "healthy",
    "architecture": "hierarchical",
    "root_agent": {
        "name": "Insurance Agent Supervisor",
        "delegation_enabled": true,
        "status": "active"
    },
    "specialized_agents": {
        "lead_manager": "active",
        "communicator": "active",
        "task_coordinator": "active",
        "analyst": "active",
        "compliance_officer": "active"
    }
}
```

## 🛠️ Troubleshooting

### Root Agent Not Responding
1. Check if service is running: `curl http://localhost:5001/health`
2. Verify API key is set: `echo $GEMINI_API_KEY`
3. Check logs in terminal where you started the service

### Slow Responses
- Complex requests take longer (3-10 seconds)
- Multiple agent coordination requires time
- This is normal for comprehensive responses

### Delegation Issues
- Ensure all specialist agents are active (check health endpoint)
- Verify CrewAI dependencies are installed
- Check for any error messages in startup logs

### API Key Issues
```bash
# Check if key is set
echo $GEMINI_API_KEY

# Set temporarily
export GEMINI_API_KEY="your_key_here"

# Set permanently in .env
echo "GEMINI_API_KEY=your_key_here" >> .env
```

## 🎉 Success Indicators

You'll know the Root Agent is working properly when:

1. **Startup Messages Show Hierarchy**:
   ```
   🎯 Root Agent: Insurance Agent Supervisor (Main Interface)
      └── Delegates to specialized team
   ```

2. **Health Check Shows Delegation**:
   ```json
   "delegation_enabled": true
   ```

3. **Responses Are Comprehensive**:
   - Multi-domain queries get complete answers
   - Context is maintained across requests
   - Specialist expertise is evident in responses

4. **Natural Interaction Works**:
   - You can ask in plain English
   - Complex requests are handled smoothly
   - Follow-up questions work naturally

## 🔮 What's Next?

The Root Agent system is designed to grow with your needs:

1. **New Specialists**: Easy to add domain experts
2. **Learning Capabilities**: Future versions will learn your preferences
3. **Parallel Processing**: Specialists will work simultaneously
4. **Advanced Context**: Cross-session memory and user profiles

## 📞 Getting Help

If you need assistance:
1. Run the demo: `python demo_root_agent.py`
2. Check the health endpoint: `curl http://localhost:5001/health`
3. Review the logs in your startup terminal
4. Test with simple requests first

The Root Agent is designed to be intuitive - just ask for what you need, and it will coordinate the right specialists to help you! 🎯