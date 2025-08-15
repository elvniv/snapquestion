from fastapi import FastAPI, UploadFile, File, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
import json

app = FastAPI(title="SnapQuestion API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnswerReq(BaseModel):
    tenant_id: str
    query_text: Optional[str] = None
    image_url: Optional[str] = None
    conversation_id: Optional[str] = None

class CheckoutReq(BaseModel):
    tenant_id: str
    plan: str

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
    
    # TODO: Implement actual Firebase token verification
    # For development, accept "Bearer DEV" token
    token = authorization[7:]  # Remove "Bearer " prefix
    if token == "DEV":
        return "uid_dev"
    
    # In production, verify with Firebase Admin SDK
    raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
def root():
    return {"message": "SnapQuestion API", "version": "0.1.0"}

@app.get("/healthz")
def healthz():
    return {"ok": True, "service": "snapquestion-api"}

@app.post("/v1/ingest/upload")
async def ingest_upload(
    tenant_id: str,
    file: UploadFile = File(...),
    uid: str = Depends(verify_firebase)
):
    """Upload a document for ingestion into the knowledge base"""
    # TODO: Implement actual file processing
    # 1. Save to Firebase Storage or S3
    # 2. Enqueue processing job to RQ
    # 3. Return source_id for tracking
    
    file_content = await file.read()
    file_size = len(file_content)
    
    # Mock source ID generation
    import hashlib
    source_id = f"src_{hashlib.md5(file_content).hexdigest()[:8]}"
    
    return {
        "source_id": source_id,
        "filename": file.filename,
        "size": file_size,
        "tenant_id": tenant_id,
        "status": "queued"
    }

@app.post("/v1/billing/checkout")
async def billing_checkout(req: CheckoutReq, uid: str = Depends(verify_firebase)):
    """Create a Stripe Checkout session"""
    # TODO: Integrate with Stripe API
    # 1. Create checkout session
    # 2. Return checkout URL
    
    # Mock checkout URL
    checkout_url = f"https://checkout.stripe.com/pay/cs_test_{req.tenant_id}_{req.plan}"
    
    return {
        "checkout_url": checkout_url,
        "session_id": f"cs_test_{req.tenant_id}",
        "plan": req.plan
    }

@app.post("/v1/answer", response_model=AnswerResponse)
async def answer(req: AnswerReq, uid: str = Depends(verify_firebase)):
    """Process a question and return an AI-generated answer with citations"""
    # TODO: Implement RAG pipeline
    # 1. Embed query
    # 2. Search vector DB for relevant chunks
    # 3. Generate answer with LLM
    # 4. Extract citations
    # 5. Calculate confidence score
    
    # Mock response for development
    mock_answer = {
        "answer": "To reset the filter on your HVAC system, locate the filter compartment (usually near the air handler or return air duct), turn off the system, remove the old filter, and insert a new filter with the airflow arrow pointing toward the unit. Reset the filter indicator if your system has one.",
        "citations": [
            {"source_id": "src_manual_01", "title": "HVAC Maintenance Manual", "page": 42},
            {"source_id": "src_guide_02", "title": "Quick Start Guide", "page": 3}
        ],
        "confidence": 0.92,
        "escalated": False
    }
    
    # If confidence is low, escalate to human
    if req.query_text and "complex" in req.query_text.lower():
        mock_answer["confidence"] = 0.45
        mock_answer["escalated"] = True
        mock_answer["answer"] = "This question requires human assistance. A support agent will contact you shortly."
    
    return mock_answer

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
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)