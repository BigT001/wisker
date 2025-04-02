import os
import asyncio
from fastapi import APIRouter, BackgroundTasks, HTTPException

from utils.helpers import jobs, update_job_progress, extract_narration_lines
from agents.voiceover_agent import generate_voiceovers, generate_simulated_voiceovers

router = APIRouter(prefix="/generate", tags=["voiceovers"])

@router.post("/voiceovers/{episode_index}")
async def create_voiceovers(episode_index: int, background_tasks: BackgroundTasks):
    """Generate voiceovers for a specific episode (long-running task)"""
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

        # Create job ID
        job_id = f"voiceover_{episode_index}_{int(asyncio.get_event_loop().time())}"

        # Store job status
        jobs[job_id] = {"status": "queued", "progress": 0, "result_path": None}

        # Run in background
        background_tasks.add_task(
            process_voiceovers,
            job_id=job_id,
            script=script,
            episode_index=episode_index
        )

        return {"job_id": job_id, "status": "queued"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error starting voiceover generation: {str(e)}")

async def process_voiceovers(job_id: str, script: str, episode_index: int):
    """Process voiceovers in the background"""
    try:
        jobs[job_id]["status"] = "running"

        # Check if ElevenLabs API key is set
        if os.getenv("ELEVENLABS_API_KEY"):
            await generate_voiceovers(
                script,
                episode_index,
                progress_callback=lambda p: update_job_progress(job_id, p)
            )
        else:
            # Use simulated response if API key is not set
            await generate_simulated_voiceovers(
                extract_narration_lines(script),
                episode_index,
                progress_callback=lambda p: update_job_progress(job_id, p)
            )

        # Update job status
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["result_path"] = f"./outputs/audio/episode{episode_index+1}/"
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        print(f"Error generating voiceovers: {e}")
