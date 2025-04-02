from fastapi import APIRouter, HTTPException
from models.schemas import JobStatus
from utils.helpers import jobs

router = APIRouter(tags=["jobs"])

@router.get("/jobs/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get the status of a background job"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")

    job = jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "progress": job["progress"],
        "result_path": job["result_path"]
    }
