import logging
from fastapi import APIRouter, HTTPException, Body, Depends
from typing import Dict, Any, Optional
from pydantic import BaseModel

from backend.agents.script_generator.generat_script_ import generate_script

logger = logging.getLogger(__name__)
router = APIRouter()

class ScriptRequest(BaseModel):
    episode_idea: Dict[str, Any]
    cat_name: str
    content_style: str
    api_provider: Optional[str] = "openai"
    api_key: Optional[str] = None

class ScriptResponse(BaseModel):
    script: str

@router.post("/generate-script", response_model=ScriptResponse)
async def generate_script_route(request: ScriptRequest = Body(...)):
    """Generate a script for an episode"""
    try:
        logger.info(f"Received request to generate script for episode: {request.episode_idea.get('title', 'Unknown')}")
        
        script = await generate_script(
            episode_idea=request.episode_idea,
            cat_name=request.cat_name,
            content_style=request.content_style,
            api_provider=request.api_provider,
            api_key=request.api_key
        )
        
        return ScriptResponse(script=script)
    
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# backend/main.py (or wherever your FastAPI app is defined)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.script_routes import router as script_router

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(script_router, prefix="/api")