from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional, List
import logging

# Import the content agent functionality
from agents.content_plan_agent.content_agent import generate_content_ideas

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

router = APIRouter(
    prefix="/content",
    tags=["content"],
    responses={404: {"description": "Not found"}},
)

class ContentPlanRequest(BaseModel):
    series_title: str = Field(default="Mischievous Cat Shopper")
    num_episodes: int = Field(default=5, ge=1, le=100, description="Number of episodes (1-100)")
    cat_name: str = Field(default="Whiskers")
    content_style: str = Field(default="humorous, family-friendly")
    theme: Optional[str] = Field(default=None)
    setting: Optional[str] = Field(default=None)
    target_audience: Optional[str] = Field(default=None)
    additional_characters: Optional[str] = Field(default=None)
    api_key: Optional[str] = Field(default=None)
    api_provider: str = Field(default="openai", description="API provider (e.g., 'openai', 'huggingface')")
    use_gpt4: bool = Field(default=False)

@router.post("/generate-plan")
async def create_content_plan(request: ContentPlanRequest):
    """Generate a content plan for the Mischievous Cat Shopper series"""
    try:
        logger.info(f"Received content plan request for '{request.series_title}' using {request.api_provider}")
        
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
        logger.info("Content plan generated successfully")
        return content_plan
    except ValueError as e:
        logger.error(f"Value error in create_content_plan: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in create_content_plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating content plan: {str(e)}")