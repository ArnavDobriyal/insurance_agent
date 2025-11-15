import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Retry logic with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Extract intent from user command
export async function extractIntent(text, context = {}) {
  const prompt = `
You are an AI assistant for an insurance agent application. Extract the intent and entities from the following command:

Command: "${text}"
Context: ${JSON.stringify(context)}

Respond in JSON format:
{
  "intent": "navigation|action|search",
  "entities": {},
  "confidence": 0.0-1.0,
  "action": {
    "type": "navigate|create|update|search",
    "payload": {}
  }
}

Examples:
- "Go to hot leads" → {"intent": "navigation", "action": {"type": "navigate", "payload": {"route": "/leads", "filter": "hot"}}}
- "Create new lead for Priya" → {"intent": "action", "entities": {"name": "Priya"}, "action": {"type": "create", "payload": {"entity": "lead"}}}
- "Search Amit Patel" → {"intent": "search", "entities": {"name": "Amit Patel"}, "action": {"type": "search", "payload": {"query": "Amit Patel"}}}
`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    // Parse JSON from response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse intent response');
  } catch (error) {
    console.error('Intent extraction error:', error);
    throw error;
  }
}

// Summarize interaction
export async function summarizeInteraction(type, content, leadContext = {}) {
  const prompt = `
You are an AI assistant for insurance agents. Summarize the following ${type}:

Content: "${content}"
Lead Context: ${JSON.stringify(leadContext)}

Provide a summary in this format:
{
  "summary": ["bullet point 1", "bullet point 2", "bullet point 3"],
  "insights": ["insight 1", "insight 2"],
  "nextAction": "specific recommended action",
  "entities": {
    "productInterest": [],
    "premium": null,
    "concerns": []
  },
  "sentiment": 0.0-1.0
}

Keep it concise and actionable. Focus on insurance-relevant information.
`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse summary response');
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
}

// Generate next best action
export async function generateNextAction(leadData, context) {
  const prompt = `
You are an AI assistant for insurance agents. Based on the lead information, suggest the next best action.

Lead Data: ${JSON.stringify(leadData)}
Context: ${JSON.stringify(context)}

Respond in JSON format:
{
  "id": "action-${Date.now()}",
  "title": "Clear action title",
  "steps": ["step 1", "step 2", "step 3"],
  "reasoning": "Why this action is recommended",
  "confidence": 0.0-1.0,
  "difficulty": "easy|medium|hard",
  "signals": ["signal 1", "signal 2"]
}

Consider:
- Lead temperature and conversion probability
- Last interaction date and summary
- Product interests
- IRDAI compliance (no guaranteed returns promises)
`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse next action response');
  } catch (error) {
    console.error('Next action generation error:', error);
    throw error;
  }
}

// Predict objections
export async function predictObjections(leadData, productType) {
  const prompt = `
You are an AI assistant for insurance agents. Predict likely objections for this lead and provide IRDAI-compliant responses.

Lead Data: ${JSON.stringify(leadData)}
Product Type: ${productType}

Respond in JSON format:
{
  "objections": [
    {
      "id": "obj-1",
      "text": "Objection text",
      "probability": 0.0-1.0,
      "safeResponse": "IRDAI-compliant response",
      "signals": ["signal 1", "signal 2"]
    }
  ]
}

IMPORTANT: Responses must be IRDAI-compliant:
- No guaranteed returns promises
- No misleading claims
- Focus on benefits, not guarantees
- Mention risks where applicable
`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse objections response');
  } catch (error) {
    console.error('Objection prediction error:', error);
    throw error;
  }
}

// Fill template with lead data
export async function fillTemplate(template, leadData) {
  const prompt = `
You are an AI assistant for insurance agents. Fill in the template with appropriate values from the lead data.

Template: "${template.content}"
Dynamic Fields: ${JSON.stringify(template.dynamicFields)}
Lead Data: ${JSON.stringify(leadData)}

Respond in JSON format:
{
  "filledContent": "template with {{fields}} replaced",
  "fieldValues": {
    "fieldName": {
      "value": "filled value",
      "source": "lead data field or AI generated",
      "confidence": 0.0-1.0
    }
  }
}

Rules:
- Replace all {{fieldName}} placeholders with appropriate values
- Use lead data when available
- Generate reasonable values for missing fields based on context
- Ensure IRDAI compliance (no guaranteed returns, etc.)
- Cite the source of each value
`;

  try {
    const result = await retryWithBackoff(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse template fill response');
  } catch (error) {
    console.error('Template fill error:', error);
    throw error;
  }
}

export default {
  extractIntent,
  summarizeInteraction,
  generateNextAction,
  predictObjections,
  fillTemplate,
};
