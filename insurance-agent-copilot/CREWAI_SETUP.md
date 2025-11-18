# 🚀 CrewAI Setup Guide

## Quick Start

### 1. Install CrewAI Dependencies
```bash
cd insurance_agent/insurance-agent-copilot/backend
pip install -r requirements_crewai.txt
```

### 2. Set Up Environment
```bash
# Copy and edit .env file
cp .env.example .env

# Add your Gemini API key
GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Start CrewAI Version
```bash
# From project root
python start_crewai.py
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **CrewAI Backend**: http://localhost:5001  
- **API Documentation**: http://localhost:5001/docs

## 🧪 Test the Implementation

```bash
# In a new terminal
python test_crewai.py
```

## 👥 Meet Your AI Agents

### 🎯 Lead Manager
- Handles lead search, creation, and updates
- Manages lead temperature and classification
- Tracks lead progression

### 💬 Communication Specialist  
- Drafts WhatsApp, SMS, and email messages
- Ensures IRDAI compliance
- Handles call scheduling

### 📋 Task Coordinator
- Manages tasks and deadlines
- Tracks follow-ups and overdue items
- Prioritizes activities

### 📊 Analytics Expert
- Generates performance insights
- Creates revenue forecasts
- Provides daily summaries

### 🛡️ Compliance Officer
- Reviews content for IRDAI violations
- Suggests safe alternatives
- Ensures regulatory compliance

## 🎯 Example Queries

Try these queries in the chat interface:

```
"Show me all hot leads"
→ Lead Manager will search and display hot leads

"Send WhatsApp to Priya Sharma"  
→ Communication Specialist will draft a message

"What tasks are due today?"
→ Task Coordinator will show today's tasks

"Generate daily summary"
→ Analytics Expert will create comprehensive summary

"Is 'guaranteed returns' compliant?"
→ Compliance Officer will check and suggest alternatives
```

## 🔄 Running Both Versions

You can run both LangChain and CrewAI versions simultaneously:

```bash
# Terminal 1: Original LangChain version (port 5000)
python start.py

# Terminal 2: New CrewAI version (port 5001)  
python start_crewai.py

# Terminal 3: Frontend (can switch between backends)
npm run dev
```

## 🛠️ Troubleshooting

### CrewAI Installation Issues
```bash
# If CrewAI installation fails
pip install --upgrade pip
pip install crewai==0.83.0 crewai-tools==0.17.0

# For dependency conflicts
pip install --force-reinstall crewai
```

### Port Conflicts
```bash
# If port 5001 is busy
lsof -ti:5001 | xargs kill -9

# Or change port in start_crewai.py
```

### API Key Issues
```bash
# Check if API key is set
echo $GEMINI_API_KEY

# Or check .env file
cat .env | grep GEMINI_API_KEY
```

## 📊 Performance Comparison

| Metric | LangChain | CrewAI |
|--------|-----------|--------|
| **Response Time** | ~2-3s | ~3-5s |
| **Specialization** | General | High |
| **Accuracy** | Good | Better |
| **Maintainability** | Complex | Modular |
| **Scalability** | Tool-based | Agent-based |

## 🎉 Success Indicators

You'll know CrewAI is working when you see:

1. **Startup Messages**:
   ```
   👥 Multi-Agent System:
      🎯 Lead Manager
      💬 Communicator  
      📋 Task Coordinator
      📊 Analyst
      🛡️ Compliance Officer
   ```

2. **Agent Responses**: 
   - More specialized and detailed responses
   - Clear indication of which agents were involved
   - Better domain-specific knowledge

3. **API Documentation**:
   - Visit http://localhost:5001/docs
   - See CrewAI-specific endpoints
   - Test agent interactions

## 🔮 Next Steps

1. **Compare Responses**: Try the same queries on both versions
2. **Test Edge Cases**: Complex multi-step requests
3. **Monitor Performance**: Response times and accuracy
4. **Customize Agents**: Modify roles and tools as needed

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure API key is correctly set
4. Test with simple queries first

Happy agent orchestration! 🎯