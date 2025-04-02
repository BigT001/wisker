import os
import json
from fastapi import APIRouter, HTTPException

from models.schemas import SocialMediaPlan
from agents.social_media_agent import generate_social_media_plan, generate_simulated_social_media_plan

router = APIRouter(prefix="/generate", tags=["social-media"])

@router.post("/social-media/{episode_index}", response_model=SocialMediaPlan)
async def create_social_media_plan(episode_index: int):
    """Generate a social media plan for a specific episode"""
    try:
        # Load content plan and script
        try:
            with open('./outputs/content_plan.json', 'r') as f:
                content_plan = json.load(f)

            with open(f'./outputs/episode{episode_index+1}_script.txt', 'r') as f:
                script = f.read()
        except FileNotFoundError:
            raise HTTPException(
                status_code=404,
                detail="Content plan or script not found. Generate them first."
            )

        if episode_index < 0 or episode_index >= len(content_plan["episodes"]):
            raise HTTPException(
                status_code=400,
                detail=f"Episode index out of range. Must be between 0 and {len(content_plan['episodes'])-1}"
            )

        # Check if OpenAI API key is set
        if os.getenv("OPENAI_API_KEY"):
            social_media_plan = await generate_social_media_plan(content_plan["episodes"][episode_index], script)
        else:
            # Use simulated response if API key is not set
            social_media_plan = await generate_simulated_social_media_plan(content_plan["episodes"][episode_index], script)

        # Save to file
        with open(f'./outputs/episode{episode_index+1}_social_media.json', 'w') as f:
            json.dump(social_media_plan, f, indent=2)

        return social_media_plan
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating social media plan: {str(e)}")
