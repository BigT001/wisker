import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional

from backend.agents.content_plan_agent.content_agent import generate_content_plan, generate_episode_script

app = FastAPI(
    title="Content Generation API",
    description="API for generating content plans and scripts",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class ContentPlanRequest(BaseModel):
    num_episodes: int = Field(default=5)
    theme: str = Field(default="")
    title: Optional[str] = Field(default="Mischievous Cat Shopper")
    description: Optional[str] = Field(default=None)
    cat_name: Optional[str] = Field(default="Whiskers")
    content_style: Optional[str] = Field(default="humorous, family-friendly")
    use_gpt4: Optional[bool] = Field(default=False)
    api_key: Optional[str] = Field(default=None)

class ScriptRequest(BaseModel):
    episode: Dict[str, Any]
    cat_name: str = Field(default="Whiskers")
    content_style: str = Field(default="humorous, family-friendly")
    use_gpt4: bool = Field(default=False)
    api_key: Optional[str] = Field(default=None)

# Changed endpoint to match frontend
@app.post("/generate/content-plan")
async def api_generate_content_plan(request: ContentPlanRequest):
    print(f"Received request to /generate/content-plan: {request}")
    """Generate a content plan based on the provided parameters"""
    # Set API key if provided
    # Set API key if provided
    if request.api_key:
        os.environ["OPENAI_API_KEY"] = request.api_key
        print(f"Using API key from request")
    elif not os.getenv("OPENAI_API_KEY"):
        print(f"No API key found in environment or request")
        raise HTTPException(status_code=400, detail="OpenAI API key is required")
    else:
        print(f"Using API key from environment")
   
    # Set GPT-4 flag if requested
    if request.use_gpt4:
        os.environ["USE_GPT4"] = "true"
    else:
        os.environ["USE_GPT4"] = "false"
   
    # Create config from request
    config = {
        "series_title": request.title,
        "num_episodes": request.num_episodes,
        "cat_name": request.cat_name,
        "content_style": request.content_style,
        "theme": request.theme or request.description,
        "use_gpt4": request.use_gpt4
    }
   
    try:
        # Generate content plan
        content_plan = await generate_content_plan(config)
        return content_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content plan: {str(e)}")

# Changed endpoint to match frontend pattern
@app.post("/generate/script/{episode_index}")
async def api_generate_script(episode_index: int, request: ScriptRequest = None):
    """Generate a script for a specific episode"""
    # Set API key if provided
    if request and request.api_key:
        os.environ["OPENAI_API_KEY"] = request.api_key
    elif not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=400, detail="OpenAI API key is required")
   
    # Set GPT-4 flag if requested
    if request and request.use_gpt4:
        os.environ["USE_GPT4"] = "true"
    else:
        os.environ["USE_GPT4"] = "false"
   
    # Create config from request
    config = {
        "cat_name": request.cat_name if request else "Whiskers",
        "content_style": request.content_style if request else "humorous, family-friendly",
        "use_gpt4": request.use_gpt4 if request else False
    }
   
    try:
        # Generate script
        episode = request.episode if request else {"index": episode_index}
        script = await generate_episode_script(episode, config)
        return {"script": script}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating script: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Content Generation API"}

@app.get("/status")
async def status():
    return {"status": "operational"}

@app.get("/test")
async def test():
    return {"message": "API is working"}

# Add endpoints for other API functions as needed
@app.get("/episodes")
async def get_episodes():
    # Implement this based on your data storage
    return {"episodes": []}

@app.get("/episodes/{episode_id}")
async def get_episode(episode_id: int):
    # Implement this based on your data storage
    return {"id": episode_id, "title": "Example Episode"}

@app.get("/content-plans")
async def get_content_plans():
    # Implement this based on your data storage
    return {"content_plans": []}

@app.get("/content-plans/{plan_id}")
async def get_content_plan(plan_id: str):
    # Implement this based on your data storage
    return {"id": plan_id, "title": "Example Plan"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
