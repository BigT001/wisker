import os
import logging
from typing import Dict, Any
from agents.api_client import generate_text

logger = logging.getLogger(__name__)

async def generate_script(
    episode_idea: Dict[str, Any],
    cat_name: str = "Whiskers",
    content_style: str = "",
    api_provider: str = "openai",
    api_key: str = None
) -> str:
    """Generate a script for an episode using specified API provider or fallback method"""
    logger.info(f"Generating script for episode: {episode_idea.get('title', 'Unknown')}")
    
    # Create prompt for script generation
    system_message = """You are a professional script writer for short-form video content.
    Your task is to write a 60-second script for an episode about a mischievous cat who goes shopping.
    Include scene descriptions, narration, and sound effect notes.
    Make the script engaging, visual, and suitable for production."""
    
    prompt = f"""Write a 60-second script for an episode titled "{episode_idea['title']}".
    Episode premise: {episode_idea['premise']}
    Setting: {episode_idea['setting']}
    Items the cat wants: {', '.join(episode_idea['items'])}
    Conflict: {episode_idea['conflict']}
    Resolution: {episode_idea['resolution']}
    Cat's name: {cat_name}
    Style: {content_style}
    
    Format the script with:
    - Scene headings with timestamps (e.g., [SCENE 1 - LOCATION - 0:00-0:05])
    - Scene descriptions that are visual and specific
    - Narration lines that are concise and engaging
    - Sound effect notes [SFX: description]
    - Total runtime of 60 seconds
    - Include 6-8 distinct scenes
    
    Make it humorous, family-friendly, and engaging for all ages.
    Ensure the script has a clear beginning, middle, and end structure.
    Include at least one memorable catchphrase for the cat character."""
    
    try:
        # Get model based on provider
        model = None
        if api_provider == "openai":
            model = "gpt-4" if os.getenv("USE_GPT4", "").lower() == "true" else "gpt-3.5-turbo"
        elif api_provider == "huggingface":
            model = os.getenv("HUGGINGFACE_MODEL", "mistralai/Mistral-7B-Instruct-v0.2")
        
        logger.info(f"Using {api_provider} with model {model}")
        
        # Generate script using the unified generate_text function
        script = await generate_text(
            prompt=prompt,
            system_message=system_message,
            api_provider=api_provider,
            model=model,
            temperature=0.7,
            max_tokens=2000,
            api_key=api_key
        )
        
        logger.info("Successfully generated script")
        return script
    except Exception as e:
        logger.error(f"Error generating script: {str(e)}")
        # Fallback to simulated script generation
        logger.info("Falling back to simulated script generation")
