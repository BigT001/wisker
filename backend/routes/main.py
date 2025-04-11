import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from backend.routes import scripts

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import configuration
from config import (
    API_TITLE, API_DESCRIPTION, API_VERSION,
    CORS_ORIGINS, CORS_CREDENTIALS, CORS_METHODS, CORS_HEADERS
)

# Import routers
from routes import content, scripts

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
app.include_router(scripts.router)

logger.info("All routers have been included")

@app.get("/")
async def root():
    return {"message": "Welcome to the Mischievous Cat Shopper API"}

@app.get("/status")
async def status():
    return {"status": "ok"}

# Create an __init__.py file in the routes directory
def create_init_files():
    os.makedirs("api/routes", exist_ok=True)
    with open("api/routes/__init__.py", "w") as f:
        f.write("# Routes package\n")

if __name__ == "__main__":
    # Create necessary init files
    create_init_files()
    
    # Use port 8000 for local development
    port = int(os.environ.get("PORT", 8000))
    logger.info(f"Starting server on port {port}")
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
