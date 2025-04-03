from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import os

# Import the content agent functionality
from agents.content_agent import generate_content_ideas

router = APIRouter(
    prefix="/content",
    tags=["content"],
    responses={404: {"description": "Not found"}},
)

class ContentPlanRequest(BaseModel):
    series_title: str = Field(default="Mischievous Cat Shopper")
    num_episodes: int = Field(default=5)
    cat_name: str = Field(default="Whiskers")
    content_style: str = Field(default="humorous, family-friendly")
    theme: Optional[str] = Field(default=None)
    setting: Optional[str] = Field(default=None)
    target_audience: Optional[str] = Field(default=None)
    additional_characters: Optional[str] = Field(default=None)
    api_key: Optional[str] = Field(default=None)
    api_provider: str = Field(default="openai")  # Add this field
    use_gpt4: bool = Field(default=False)

@router.post("/generate-plan")
async def create_content_plan(request: ContentPlanRequest):
    """Generate a content plan for the Mischievous Cat Shopper series"""
    try:
        print(f"Received content plan request for '{request.series_title}' using {request.api_provider}")
        
        # Create config from request
        config = {
            "series_title": request.series_title,
            "num_episodes": request.num_episodes,
            "cat_name": request.cat_name,
            "content_style": request.content_style,
            "theme": request.theme,
            "setting": request.setting,
            "target_audience": request.target_audience,
            "additional_characters": request.additional_characters,
            "use_gpt4": request.use_gpt4,
            "api_key": request.api_key,
            "api_provider": request.api_provider  # Pass the provider to the agent
        }
        
        # Generate content plan
        content_plan = await generate_content_ideas(config)
        return content_plan
    except ValueError as e:
        print(f"Value error in create_content_plan: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Unexpected error in create_content_plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating content plan: {str(e)}")
