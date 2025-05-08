from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import openai
import anthropic
from datetime import datetime
import logging
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize API clients
openai.api_key = os.getenv("OPENAI_API_KEY")
claude = anthropic.Client(api_key=os.getenv("ANTHROPIC_API_KEY"))

app = FastAPI(title="AI-NLP Service")

class NLPQuery(BaseModel):
    query: str
    context: Optional[Dict] = None
    employee_id: Optional[str] = None

class NLPResponse(BaseModel):
    intent: str
    entities: Dict[str, str]
    action: str
    parameters: Dict[str, any]
    confidence: float

def extract_intent_and_entities(query: str) -> Dict:
    """Use OpenAI to extract intent and entities from the query."""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a workspace management assistant. Extract the intent and entities from the user's query."},
                {"role": "user", "content": query}
            ],
            temperature=0.3
        )
        
        # Parse the response to extract intent and entities
        # This is a simplified version - you might want to make this more robust
        content = response.choices[0].message.content
        return {
            "intent": content.split("Intent:")[1].split("\n")[0].strip(),
            "entities": parse_entities(content)
        }
    except Exception as e:
        logger.error(f"OpenAI API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing query with OpenAI")

def parse_entities(content: str) -> Dict[str, str]:
    """Parse entities from the OpenAI response."""
    entities = {}
    if "Entities:" in content:
        entity_section = content.split("Entities:")[1].strip()
        for line in entity_section.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                entities[key.strip()] = value.strip()
    return entities

def generate_action_plan(intent: str, entities: Dict[str, str], context: Optional[Dict] = None) -> Dict:
    """Use Claude to generate an action plan based on the intent and entities."""
    try:
        prompt = f"""
        Intent: {intent}
        Entities: {entities}
        Context: {context if context else 'No additional context'}
        
        Generate an action plan for the workspace management system.
        """
        
        response = claude.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=1000,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Parse the response to extract action and parameters
        # This is a simplified version - you might want to make this more robust
        content = response.content[0].text
        return {
            "action": content.split("Action:")[1].split("\n")[0].strip(),
            "parameters": parse_parameters(content)
        }
    except Exception as e:
        logger.error(f"Claude API error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error generating action plan with Claude")

def parse_parameters(content: str) -> Dict[str, any]:
    """Parse parameters from the Claude response."""
    parameters = {}
    if "Parameters:" in content:
        param_section = content.split("Parameters:")[1].strip()
        for line in param_section.split("\n"):
            if ":" in line:
                key, value = line.split(":", 1)
                parameters[key.strip()] = value.strip()
    return parameters

@app.post("/process-query", response_model=NLPResponse)
async def process_query(query: NLPQuery):
    try:
        # Extract intent and entities using OpenAI
        extraction_result = extract_intent_and_entities(query.query)
        
        # Generate action plan using Claude
        action_plan = generate_action_plan(
            extraction_result["intent"],
            extraction_result["entities"],
            query.context
        )
        
        return NLPResponse(
            intent=extraction_result["intent"],
            entities=extraction_result["entities"],
            action=action_plan["action"],
            parameters=action_plan["parameters"],
            confidence=0.95  # This could be calculated based on the model's confidence scores
        )
        
    except Exception as e:
        logger.error(f"Query processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 