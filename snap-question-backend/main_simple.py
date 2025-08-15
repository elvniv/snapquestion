from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from openai import OpenAI

app = FastAPI(title="SnapQuestion API")

# Initialize OpenAI client
openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://*.vercel.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerReq(BaseModel):
    tenant_id: str
    query_text: Optional[str] = None
    image_url: Optional[str] = None
    conversation_id: Optional[str] = None

class Source(BaseModel):
    source_id: str
    title: str
    page: Optional[int] = None

class AnswerResponse(BaseModel):
    answer: str
    citations: List[Source]
    confidence: float
    escalated: bool

def verify_firebase(authorization: Optional[str] = Header(None)) -> str:
    """Verify Firebase ID token and return user ID"""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    # For development, accept "Bearer DEV" token
    token = authorization[7:]  # Remove "Bearer " prefix
    if token == "DEV":
        return "uid_dev"
    
    # In production, verify with Firebase Admin SDK
    raise HTTPException(status_code=401, detail="Invalid token")

def generate_answer_with_openai(query: str) -> dict:
    """Generate answer using OpenAI with mock context for testing"""
    try:
        # Mock context for testing
        mock_context = """
        From HVAC Maintenance Manual (similarity: 0.89):
        To replace the air filter, first turn off the HVAC system. Locate the filter compartment, usually near the air handler or return air duct. Remove the old filter by sliding it out. Insert the new filter with the airflow arrow pointing toward the unit. Turn the system back on.
        
        From Generator Service Guide (similarity: 0.82):
        If your generator won't start, check the fuel level, oil level, and battery connections. Ensure the fuel valve is open and the choke is in the correct position.
        
        From Troubleshooting Manual (similarity: 0.75):
        Common HVAC issues include dirty filters, thermostat problems, and refrigerant leaks. Always turn off power before performing maintenance.
        """
        
        system_prompt = """You are a helpful AI assistant for a field service company. You help customers with HVAC, generator, and equipment questions by providing accurate answers based on the provided documentation.

Instructions:
1. Answer the question using the information provided in the context
2. If the context doesn't contain enough information to answer the question, say so
3. Be specific and practical in your responses
4. Include relevant safety warnings when appropriate
5. Keep responses concise but complete"""

        user_prompt = f"""Context from documentation:
{mock_context}

Question: {query}

Please provide a helpful answer based on the context above."""

        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        answer = response.choices[0].message.content
        
        # Mock confidence calculation
        confidence = 0.85 if len(query) > 10 else 0.65
        escalated = confidence < 0.7
        
        if escalated:
            answer = "I don't have enough information in the documentation to answer this question accurately. A support agent will contact you shortly for assistance."
        
        return {
            "answer": answer,
            "confidence": confidence,
            "escalated": escalated
        }
        
    except Exception as e:
        print(f"Error generating answer with OpenAI: {e}")
        return {
            "answer": "I'm experiencing technical difficulties. Please try again or contact support.",
            "confidence": 0.0,
            "escalated": True
        }

@app.get("/")
def root():
    return {"message": "SnapQuestion API", "version": "0.1.0", "openai_configured": bool(openai_client.api_key)}

@app.get("/healthz")
def healthz():
    return {"ok": True, "service": "snapquestion-api", "openai_configured": bool(openai_client.api_key)}

@app.post("/v1/answer", response_model=AnswerResponse)
async def answer(req: AnswerReq, uid: str = Depends(verify_firebase)):
    """Process a question and return an AI-generated answer with citations"""
    if not req.query_text:
        raise HTTPException(status_code=400, detail="query_text is required")
    
    try:
        # Generate answer using OpenAI
        ai_result = generate_answer_with_openai(req.query_text)
        
        # Mock citations
        citations = [
            {"source_id": "src_manual_01", "title": "HVAC Maintenance Manual", "page": 42},
            {"source_id": "src_guide_02", "title": "Generator Service Guide", "page": 15},
            {"source_id": "src_troubleshoot_03", "title": "Troubleshooting Manual", "page": 8}
        ]
        
        return {
            "answer": ai_result["answer"],
            "citations": citations,
            "confidence": ai_result["confidence"],
            "escalated": ai_result["escalated"]
        }
        
    except Exception as e:
        print(f"Error in answer endpoint: {e}")
        return {
            "answer": "I'm experiencing technical difficulties. Please try again or contact support for assistance.",
            "citations": [],
            "confidence": 0.0,
            "escalated": True
        }

@app.get("/v1/tenants/{tenant_id}/stats")
async def get_tenant_stats(tenant_id: str, uid: str = Depends(verify_firebase)):
    """Get usage statistics for a tenant"""
    return {
        "tenant_id": tenant_id,
        "total_queries": 1247,
        "queries_this_month": 89,
        "escalation_rate": 0.12,
        "avg_confidence": 0.87,
        "top_topics": ["filter reset", "error codes", "maintenance schedule"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main_simple:app", host="0.0.0.0", port=8000, reload=True)