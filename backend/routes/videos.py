from fastapi import APIRouter, HTTPException
from agents.video_agent import generate_video

router = APIRouter(prefix="/generate", tags=["videos"])

@router.post("/video/{episode_index}")
async def create_video(episode_index: int):
    """Generate video by combining images and audio"""
    try:
        video_path = await generate_video(episode_index)
        if video_path:
            return {"message": "Video generated successfully", "path": video_path}
        else:
            raise HTTPException(status_code=500, detail="Failed to generate video")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating video: {str(e)}")
