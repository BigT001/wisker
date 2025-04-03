from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ContentConfig(BaseModel):
    series_title: str = "Mischievous Cat Shopper"
    episodes: int = 5
    num_episodes: Optional[int] = None  # Added for compatibility
    cat_name: str = "Whiskers"
    content_style: str = "humorous, family-friendly tricky, 30-60 seconds per episode"
    theme: Optional[str] = None
    setting: Optional[str] = None
    target_audience: Optional[str] = None
    additional_characters: Optional[str] = None
    api_key: Optional[str] = None
    use_gpt4: Optional[bool] = False

class EpisodeIdea(BaseModel):
    title: str
    premise: str
    setting: str
    items: List[str]
    conflict: str
    resolution: str

class ContentPlan(BaseModel):
    series_concept: str
    cat_personality: Dict[str, Any]
    episodes: List[EpisodeIdea]

class VisualPrompt(BaseModel):
    description: str
    stable_diffusion_prompt: str
    style: str
    shot_type: str

class VisualPrompts(BaseModel):
    scenes: List[VisualPrompt]

class SocialMediaPlatform(BaseModel):
    name: str
    post_text: str
    hashtags: List[str]
    best_time_to_post: str
    engagement_prompt: str

class ContentVariation(BaseModel):
    type: str
    description: str
    purpose: str

class SocialMediaPlan(BaseModel):
    platforms: List[SocialMediaPlatform]
    content_variations: List[ContentVariation]

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: Optional[int] = None
    result_path: Optional[str] = None
