import os
import json
from fastapi import APIRouter, HTTPException

router = APIRouter(tags=["files"])

@router.get("/outputs/{file_path:path}")
async def get_file(file_path: str):
    """Serve files from the outputs directory"""
    try:
        file_full_path = os.path.join("./outputs", file_path)
        if not os.path.exists(file_full_path):
            raise HTTPException(status_code=404, detail="File not found")

        # For JSON files, return the JSON content
        if file_path.endswith(".json"):
            with open(file_full_path, 'r') as f:
                return json.load(f)

        # For text files, return the text content
        if file_path.endswith(".txt"):
            with open(file_full_path, 'r') as f:
                content = f.read()
            return {"content": content}

        # For other files, return a message (in a real app, you'd serve the file)
        return {
            "message": f"File {file_path} exists but cannot be served directly through this endpoint"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error accessing file: {str(e)}")
