import os
import json
import asyncio
from fastapi import APIRouter, BackgroundTasks, HTTPException
from models.schemas import ContentConfig
from utils.helpers import jobs
from agents.content_agent import generate_content_ideas
from agents.visual_agent import generate_visual_prompts, generate_images
from agents.voiceover_agent import generate_voiceovers
from agents.social_media_agent import generate_social_media_plan
from utils.helpers import extract_narration_lines

router = APIRouter(prefix="/generate", tags=["pipeline"])

@router.post("/full-pipeline/{episode_index}")
async def run_full_pipeline(episode_index: int, background_tasks: BackgroundTasks):
    """Run the full content generation pipeline for a specific episode"""
    try:
        # Create job ID
        job_id = f"pipeline_{episode_index}_{int(asyncio.get_event_loop().time())}"
        # Store job status
        jobs[job_id] = {"status": "queued", "progress": 0, "result_path": None}
        # Run in background
        background_tasks.add_task(
            process_full_pipeline,
            job_id=job_id,
            episode_index=episode_index
        )
        return {"job_id": job_id, "status": "queued"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting pipeline: {str(e)}")

async def process_full_pipeline(job_id: str, episode_index: int):
    """Process the full content pipeline in the background"""
    try:
        jobs[job_id]["status"] = "running"
        
        # Check if content plan exists, if not generate it
        if not os.path.exists('./outputs/content_plan.json'):
            config = ContentConfig()
            if not os.getenv("OPENAI_API_KEY"):
                raise ValueError("OpenAI API key is required but not provided")
            
            content_plan = await generate_content_ideas(config.dict())
            
            with open('./outputs/content_plan.json', 'w') as f:
                json.dump(content_plan, f, indent=2)
        else:
            with open('./outputs/content_plan.json', 'r') as f:
                content_plan = json.load(f)
        
        jobs[job_id]["progress"] = 20
        
        # Generate script
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
        
        with open(f'./outputs/episode{episode_index+1}_script.txt', 'w') as f:
            f.write(script)
        
        jobs[job_id]["progress"] = 40
        
        # Generate visual prompts
        visual_prompts = await generate_visual_prompts(script)
        with open(f'./outputs/episode{episode_index+1}_visual_prompts.json', 'w') as f:
            json.dump(visual_prompts, f, indent=2)
        
        jobs[job_id]["progress"] = 50
        
        # Generate images
        if not os.getenv("HUGGINGFACE_API_KEY"):
            raise ValueError("Hugging Face API key is required but not provided")
        
        await generate_images(visual_prompts, episode_index)
        
        jobs[job_id]["progress"] = 70
        
        # Generate voiceovers
        if not os.getenv("ELEVENLABS_API_KEY"):
            raise ValueError("ElevenLabs API key is required but not provided")
        
        await generate_voiceovers(script, episode_index)
        
        jobs[job_id]["progress"] = 90
        
        # Generate social media plan
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OpenAI API key is required but not provided")
        
        social_media_plan = await generate_social_media_plan(content_plan["episodes"][episode_index], script)
        
        with open(f'./outputs/episode{episode_index+1}_social_media.json', 'w') as f:
            json.dump(social_media_plan, f, indent=2)
        
        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["result_path"] = f"./outputs/episode{episode_index+1}/"
    
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        print(f"Error in pipeline: {e}")
