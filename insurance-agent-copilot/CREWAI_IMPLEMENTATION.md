# CrewAI Implementation Guide

## 🎯 Overview

This document explains the new CrewAI-based multi-agent implementation for the Insurance Agent Copilot.

## 🏗️ Architecture Comparison

### Original LangChain Approach
```
Single Agent → 52+ Tools → Sequential Processing
```

### New CrewAI Approach  
```
5 Specialized Agents → Domain-Specific Tools → Collaborative Processing
```

## 👥 Agent Roles

### 1. 🎯 Lead Manager
- **Role**: Lead management and organization
- **Tools**: LeadSearchTool, LeadManagementTool
- **Responsibilities**:
  - Search and retrieve lead information
  - Create and update lead records
  - Classify lead temperature and priority
  - Track lead progression through sales funnel

### 2. 💬 Communication Specialist
- **Role**: Customer communications and compliance
- **Tools**: CommunicationTool, ComplianceTool
- **Responsibilities**:
  - Draft WhatsApp, SMS, and email messages
  - Ensure IRDAI compliance in all communications
  - Handle call scheduling and meeting coordination
  - Maintain professional communication standards

### 3. 📋 Task Coordinator
- **Role**: Task management and follow-ups
- **Tools**: TaskManagementTool
- **Responsibilities**:
  - Create and prioritize tasks
  - Track deadlines and overdue items
  - Coordinate follow-up activities
  - Ensure nothing falls through the cracks

### 4. 📊 Analytics Expert
- **Role**: Data analysis and insights
- **Tools**: AnalyticsTool
- **Responsibilities**:
  - Generate performance metrics
  - Provide revenue forecasts
  - Analyze conversion statistics
  - Create daily summaries and reports

### 5. 🛡️ Compliance Officer
- **Role**: Regulatory compliance and safety
- **Tools**: ComplianceTool
- **Responsibilities**:
  - Review all content for IRDAI violations
  - Suggest safe alternatives for risky phrases
  - Ensure regulatory adherence
  - Protect customer interests

## 🔄 Request Processing Flow

### 1. Smart Routing
```python
def route_request(user_message: str) -> List[Task]:
    # Analyze user intent
    # Route to appropriate agents
    # Create specialized tasks
```

### 2. Agent Collaboration
```python
crew = Crew(
    agents=[lead_manager, communicator, task_coordinator, analyst, compliance_officer],
    tasks=tasks,
    process=Process.sequential
)
```

### 3. Execution
- Agents work on their specialized tasks
- Results are coordinated and combined
- Final response is formatted and returned

## 🚀 Getting Started

### 1. Install CrewAI Dependencies
```bash
cd backend
pip install -r requirements_crewai.txt
```

### 2. Start CrewAI Version
```bash
python start_crewai.py
```

### 3. Access Services
- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:5001/docs

## 📊 Feature Comparison

| Feature | LangChain Version | CrewAI Version |
|---------|------------------|----------------|
| **Architecture** | Single Agent | Multi-Agent |
| **Tools** | 52+ Tools | 5 Specialized Tools |
| **Processing** | Sequential | Collaborative |
| **Specialization** | General Purpose | Domain-Specific |
| **Scalability** | Tool-based | Agent-based |
| **Complexity** | High | Moderate |
| **Maintenance** | Complex | Modular |

## 🎯 Use Cases

### Lead Management Queries
```
"Find hot leads" → Lead Manager Agent
"Show me Priya's information" → Lead Manager Agent
"Update lead temperature" → Lead Manager Agent
```

### Communication Requests
```
"Send WhatsApp to John" → Communication Specialist
"Draft email for renewal" → Communication Specialist
"Check if message is compliant" → Communication Specialist + Compliance Officer
```

### Task Management
```
"Show overdue tasks" → Task Coordinator
"Create follow-up task" → Task Coordinator
"What's due today?" → Task Coordinator
```

### Analytics & Insights
```
"Daily summary" → Analytics Expert
"Revenue forecast" → Analytics Expert
"Performance metrics" → Analytics Expert
```

### Compliance Checks
```
"Is this message compliant?" → Compliance Officer
"Check IRDAI violations" → Compliance Officer
"Safe alternative for guaranteed returns" → Compliance Officer
```

## 🔧 Configuration

### Environment Variables
```bash
# .env file
GEMINI_API_KEY=your_api_key_here
PORT=5001
CLIENT_URL=http://localhost:3000
VITE_API_URL=http://localhost:5001/api
```

### Agent Customization
Each agent can be customized by modifying:
- **Role**: Agent's primary responsibility
- **Goal**: What the agent aims to achieve
- **Backstory**: Agent's expertise and personality
- **Tools**: Available tools for the agent

## 🚦 API Endpoints

### CrewAI Endpoints
- `POST /api/agent` - Multi-agent processing
- `POST /api/agent/stream` - Streaming responses
- `GET /health` - Agent status check

### Legacy Compatibility
- `GET /api/leads` - Lead data (unchanged)
- `GET /api/templates` - Templates (unchanged)
- `POST /api/compliance/validate` - Compliance check (unchanged)

## 🎨 Frontend Integration

The frontend remains unchanged and works with both implementations:
- Same API endpoints
- Same response formats
- Same user experience
- Automatic agent routing

## 🔄 Migration Path

### From LangChain to CrewAI
1. Keep original `main.py` as backup
2. Install CrewAI dependencies
3. Start CrewAI version on port 5001
4. Test functionality
5. Switch frontend to CrewAI backend
6. Gradually migrate features

### Rollback Strategy
```bash
# Switch back to LangChain
python start.py  # Original version (port 5000)

# Or run both simultaneously
python start.py        # LangChain on port 5000
python start_crewai.py # CrewAI on port 5001
```

## 🎯 Benefits of CrewAI Approach

### 1. **Specialization**
- Each agent focuses on specific domain expertise
- Better quality responses for specialized queries
- Clearer separation of concerns

### 2. **Scalability**
- Easy to add new agents for new domains
- Agents can work in parallel (future enhancement)
- Modular architecture for easier maintenance

### 3. **Collaboration**
- Agents can delegate tasks to each other
- Complex queries handled by multiple specialists
- Better coordination of multi-step workflows

### 4. **Maintainability**
- Smaller, focused codebases per agent
- Easier to debug and test individual agents
- Clear responsibility boundaries

## 🔮 Future Enhancements

### 1. **Parallel Processing**
```python
process=Process.hierarchical  # Enable parallel agent execution
```

### 2. **Agent Memory**
```python
# Add memory to agents for context retention
memory=True
```

### 3. **Custom Tools**
```python
# Create domain-specific tools for each agent
class PolicyManagementTool(BaseTool):
    # Specialized policy operations
```

### 4. **Agent Delegation**
```python
# Enable agents to delegate tasks to each other
allow_delegation=True
```

## 🎉 Conclusion

The CrewAI implementation provides a more organized, scalable, and maintainable approach to the insurance agent copilot. While the LangChain version offers comprehensive tool coverage, the CrewAI version provides better specialization and collaboration capabilities.

Choose based on your needs:
- **LangChain**: Comprehensive, single-agent, tool-heavy
- **CrewAI**: Specialized, multi-agent, collaborative