import os
import json
import asyncio
from fastapi import APIRouter, BackgroundTasks, HTTPException
from typing import Dict, List

from api.models.schemas import VisualPrompts
from api.utils.helpers import jobs
from agents.visual_agent import generate_visual_prompts, generate_images, generate_simulated_images

router = APIRouter(prefix="/generate", tags=["images"])

@router.post("/visual-prompts/{episode_index}", response_model=VisualPrompts)
async def create_visual_prompts(episode_index: int):
    """Generate visual prompts for a specific episode"""
    try:
        # Load script
        try:
            with open(f'./outputs/episode{episode_index+1}_script.txt', 'r') as f:
                script = f.read()
        except FileNotFoundError:
            raise HTTPException(
                status_code=404,
                detail=f"Script for episode {episode_index+1} not found. Generate a script first."
            )

        # Generate visual prompts
        visual_prompts = await generate_visual_prompts(script)

        # Save to file
        with open(f'./outputs/episode{episode_index+1}_visual_prompts.json', 'w') as f:
            json.dump(visual_prompts, f, indent=2)

        return visual_prompts
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating visual prompts: {str(e)}")

@router.post("/images/{episode_index}")
async def create_images(episode_index: int, background_tasks: BackgroundTasks):
    """Generate images for a specific episode (long-running task)"""
    try:
        # Load visual prompts
        try:
            with open(f'./outputs/episode{episode_index+1}_visual_prompts.json', 'r') as f:
                visual_prompts = json.load(f)
        except FileNotFoundError:
            raise HTTPException(
                status_code=404,
                detail=f"Visual prompts for episode {episode_index+1} not found. Generate visual prompts first."
            )

        # Create job ID
        job_id = f"images_{episode_index}_{int(asyncio.get_event_loop().time())}"

        # Store job status
        jobs[job_id] = {"status": "queued", "progress": 0, "result_path": None}

        # Run in background
        background_tasks.add_task(
            process_images,
            job_id=job_id,
            visual_prompts=visual_prompts,
            episode_index=episode_index
        )

        return {"job_id": job_id, "status": "queued"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting image generation: {str(e)}")

async def process_images(job_id: str, visual_prompts: Dict[str, List[Dict[str, str]]], episode_index: int):
    """Process image generation in the background"""
    try:
        jobs[job_id]["status"] = "running"

        # Check if Hugging Face API key is set
        if os.getenv("HUGGINGFACE_API_KEY"):
            await generate_images(visual_prompts, episode_index)
        else:
            # Use simulated response if API key is not set
            await generate_simulated_images(visual_prompts, episode_index)

        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["result_path"] = f"./outputs/images/episode{episode_index+1}/"
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        print(f"Error in image generation: {e}")
