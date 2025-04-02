import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import configuration
from config import (
    API_TITLE, API_DESCRIPTION, API_VERSION,
    CORS_ORIGINS, CORS_CREDENTIALS, CORS_METHODS, CORS_HEADERS
)

# Import routers
from routes import content, images, voiceovers, videos, social_media, jobs, pipeline, files

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
app.include_router(images.router)
app.include_router(voiceovers.router)
app.include_router(videos.router)
app.include_router(social_media.router)
app.include_router(jobs.router)
app.include_router(pipeline.router)
app.include_router(files.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Mischievous Cat Shopper API"}

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
    uvicorn.run("api.main:app", host="0.0.0.0", port=port, reload=True)
