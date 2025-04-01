import os
import json
from fastapi import APIRouter, Body, HTTPException
from fastapi.responses import JSONResponse

from api.models.schemas import ContentConfig, ContentPlan
from agents.content_agent import generate_content_ideas, generate_simulated_content_ideas

router = APIRouter(prefix="/generate", tags=["content"])

@router.post("/content-plan", response_model=ContentPlan)
async def create_content_plan(config: ContentConfig = Body(...)):
    """Generate a content plan for the series"""
    try:
        # Check if OpenAI API key is set
        if os.getenv("OPENAI_API_KEY"):
            content_plan = await generate_content_ideas(config.dict())
        else:
            # Use simulated response if API key is not set
            content_plan = await generate_simulated_content_ideas(config.dict())

        # Save to file
        with open('./outputs/content_plan.json', 'w') as f:
            json.dump(content_plan, f, indent=2)

        return content_plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content plan: {str(e)}")

@router.post("/script/{episode_index}")
async def create_script(episode_index: int):
    """Generate a script for a specific episode"""
    try:
        # Load content plan
        try:
            with open('./outputs/content_plan.json', 'r') as f:
                content_plan = json.load(f)
        except FileNotFoundError:
            raise HTTPException(
                status_code=404,
                detail="Content plan not found. Generate a content plan first."
            )

        if episode_index < 0 or episode_index >= len(content_plan["episodes"]):
            raise HTTPException(
                status_code=400,
                detail=f"Episode index out of range. Must be between 0 and {len(content_plan['episodes'])-1}"
            )

        # Generate script
        # For simplicity, we'll use a simulated script
        script = f"""TITLE: {content_plan["episodes"][episode_index]['title'].upper()}

[SCENE 1 - EXTERIOR {content_plan["episodes"][episode_index]['setting'].upper()} - DAY - 0:00-0:05]
{content_plan["episodes"][episode_index]['setting']} with appropriate signage visible.

NARRATION: Meet Whiskers, a cat with expensive taste and a shopping list.

[SFX: Playful, mischievous music begins]

[SCENE 2 - STORE ENTRANCE - 0:05-0:10]
Whiskers sneakily enters the {content_plan["episodes"][episode_index]['setting'].lower()}.

NARRATION: Today's mission: find {content_plan["episodes"][episode_index]['items'][0]} and maybe cause a little chaos along the way.

[SFX: Door whoosh, bell chime]

[SCENE 3 - SHOPPING AREA - 0:10-0:20]
Whiskers explores the store, examining various items with a discerning eye.

NARRATION: Not just any {content_plan["episodes"][episode_index]['items'][0]} would do. Whiskers was looking for the premium stuff.

[SFX: Contemplative "hmm" sound as Whiskers inspects products]

[SCENE 4 - CONFLICT INTRODUCTION - 0:20-0:25]
{content_plan["episodes"][episode_index]['conflict']}

NARRATION: But not everyone appreciated a feline shopper with refined taste.

[SFX: Dramatic music sting]

[SCENE 5 - CHASE/CONFLICT SCENE - 0:25-0:40]
Montage of Whiskers navigating the conflict, causing minor chaos.

NARRATION: What followed was pure cat-astrophe!

[SFX: Fast-paced chase music, appropriate sound effects]

[SCENE 6 - RESOLUTION SETUP - 0:40-0:50]
{content_plan["episodes"][episode_index]['resolution']}

NARRATION: Sometimes the perfect shopping partner is the one who appreciates the finer things in life.

[SFX: Gentle, resolving music]

[SCENE 7 - CONCLUSION - 0:50-0:60]
Whiskers with the items he wanted, looking satisfied.

NARRATION: Mission accomplished! Another successful shopping adventure for our mischievous cat shopper.

[SFX: Triumphant music, shopping bag rustling, purring]

WHISKERS: (looking at camera) Purr-fect purchase!

[END SCENE - FADE OUT]

[TOTAL RUNTIME: 60 SECONDS]"""

        # Save to file
        os.makedirs('./outputs', exist_ok=True)
        with open(f'./outputs/episode{episode_index+1}_script.txt', 'w') as f:
            f.write(script)

        return {"script": script}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating script: {str(e)}")
