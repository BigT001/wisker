import os
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from pydantic import BaseModel
from typing import Dict, Any, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import configuration
from config import (
    API_TITLE, API_DESCRIPTION, API_VERSION,
    CORS_ORIGINS, CORS_CREDENTIALS, CORS_METHODS, CORS_HEADERS
)

# Import routers
from routes import content, jobs, files

# Initialize FastAPI app
app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_CREDENTIALS,
    allow_methods=CORS_METHODS,
    allow_headers=CORS_HEADERS,
)

# Include routers
app.include_router(content.router)
app.include_router(jobs.router)
app.include_router(files.router)

# Custom exception handlers
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

# Define models for script generation
class ScriptGenerationRequest(BaseModel):
    episode: Dict[str, Any]
    catName: str
    contentStyle: Optional[str] = None
    apiProvider: Optional[str] = None
    apiKey: Optional[str] = None

class ScriptResponse(BaseModel):
    success: bool
    script: str

# Add script generation endpoint directly to the main app
@app.post("/scripts/generate", response_model=ScriptResponse, tags=["scripts"])
async def generate_script(request: ScriptGenerationRequest):
    """
    Generate a script for an episode of the Mischievous Cat Shopper series.
    
    - **episode**: Episode details including title, premise, setting, items, conflict, and resolution
    - **catName**: The name of the cat character
    - **contentStyle**: The style of content (e.g., "humorous, family-friendly")
    - **apiProvider**: The AI provider to use (e.g., "openai", "huggingface")
    - **apiKey**: Optional API key for the provider
    """
    try:
        logger.info(f"Generating script for cat: {request.catName}")
        
        # Extract data from the request
        cat_name = request.catName
        episode = request.episode
        setting = episode.get('setting', 'store')
        items = episode.get('items', ['toy'])
        conflict = episode.get('conflict', 'The store is closing soon')
        resolution = episode.get('resolution', 'The cat finds a way')
        
        # Generate a simple script
        script = f"""[SCENE 1 - {setting.upper()} - 0:00-0:10]
The camera pans across {setting}, showing various items.
NARRATOR: "It's another day at {setting}, but not for long..."
[SFX: Background ambience]

[SCENE 2 - AISLE - 0:10-0:20]
{cat_name} is seen eyeing {items[0] if items else 'a toy'}.
NARRATOR: "Our furry friend has a mission today."
[SFX: Cat meowing]

[SCENE 3 - CHECKOUT AREA - 0:20-0:30]
A store clerk is preparing to close.
CLERK: "Attention shoppers, we'll be closing in five minutes."
[SFX: Clock ticking]

[SCENE 4 - BACK TO AISLE - 0:30-0:40]
{cat_name} looks worried.
NARRATOR: "{conflict}"
[SFX: Dramatic music]

[SCENE 5 - VARIOUS LOCATIONS - 0:40-0:50]
Montage of {cat_name} trying to get the {items[0] if items else 'item'}.
NARRATOR: "Time for some quick thinking!"
[SFX: Fast-paced music]

[SCENE 6 - CHECKOUT - 0:50-1:00]
{cat_name} successfully gets what it wanted.
NARRATOR: "{resolution}"
{cat_name.upper()}: "Mission accomplished! That's how we roll!"
[SFX: Triumphant music]"""
        
        logger.info("Script generated successfully")
        return {"success": True, "script": script}
    
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate script: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Mischievous Cat Shopper API"}

@app.get("/status")
async def status():
    return {"status": "operational"}

# Print all routes on startup
@app.on_event("startup")
async def startup_event():
    logger.info("=== REGISTERED ROUTES ===")
    for route in app.routes:
        logger.info(f"Route: {route.path}, methods: {route.methods}")
    logger.info("========================")

# Create __init__.py files in necessary directories
def create_init_files():
    # Create __init__.py in routes directory
    os.makedirs("routes", exist_ok=True)
    with open("routes/__init__.py", "w") as f:
        f.write("# Routes package\n")
    
    # Create __init__.py in agents directory
    os.makedirs("agents", exist_ok=True)
    with open("agents/__init__.py", "w") as f:
        f.write("# Agents package\n")

if __name__ == "__main__":
    # Create necessary init files
    create_init_files()
    
    # Use port 8000 for local development
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
