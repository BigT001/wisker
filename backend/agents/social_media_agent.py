import asyncio
import os
import httpx
import json
from typing import Dict, Any, List

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


async def call_openai_api(prompt: str,
                          system_message: str = "",
                          model: str = "gpt-4o") -> str:
    """Call OpenAI API with the given prompt"""
    if not OPENAI_API_KEY:
        raise ValueError("OPENAI_API_KEY environment variable is not set")

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    messages = []
    if system_message:
        messages.append({"role": "system", "content": system_message})

    messages.append({"role": "user", "content": prompt})

    data = {
        "model": model,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 1500
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENAI_API_URL,
                                     headers=headers,
                                     json=data,
                                     timeout=60.0)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]


async def generate_social_media_plan(episode_idea: Dict[str, Any],
                                     script: str) -> Dict[str, Any]:
    """Generate a social media plan for the episode using OpenAI"""
    print("📱 Social Media Agent: Creating posting strategy with OpenAI...")

    # Create prompt for OpenAI
    system_message = """You are a social media marketing expert specializing in short-form video content.
    Your task is to create a comprehensive social media plan for a short video episode about a mischievous cat who goes shopping.
    Provide your response in valid JSON format."""

    prompt = f"""Create a social media plan for an episode titled "{episode_idea['title']}".

    Episode premise: {episode_idea['premise']}
    Setting: {episode_idea['setting']}

    Here's the script for the episode:

    {script[:1000]}... (script continues)

    Create a social media plan that includes:

    1. Platform-specific content for TikTok, Instagram, YouTube Shorts, and Twitter
    2. For each platform, include:
       - Post text
       - Hashtags (5-7 relevant ones)
       - Best time to post
       - Engagement prompt (question or call to action)
    3. Content variations (4 different types of content that can be created from this episode)

    Format your response as a JSON object with the following structure:
    {
      "platforms": [
        {
          "name": "string",
          "post_text": "string",
          "hashtags": ["string"],
          "best_time_to_post": "string",
          "engagement_prompt": "string"
        }
      ],
      "content_variations": [
        {
          "type": "string",
          "description": "string",
          "purpose": "string"
        }
      ]
    }"""

    try:
        # Call OpenAI API
        response_text = await call_openai_api(prompt, system_message)

        # Parse JSON response
        social_media_plan = json.loads(response_text)
        return social_media_plan
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Fall back to simulated response if API call fails
        return await generate_simulated_social_media_plan(episode_idea, script)


async def generate_simulated_social_media_plan(episode_idea: Dict[str, Any],
                                               script: str) -> Dict[str, Any]:
    """Generate a simulated social media plan (fallback function)"""
    print("⚠️ Falling back to simulated social media plan...")
    await asyncio.sleep(1)

    # Extract episode title and premise
    title = episode_idea.get('title', 'Mischievous Cat Shopper Episode')
    premise = episode_idea.get('premise', 'A cat goes shopping')

    # Generate platform-specific content
    platforms = [{
        "name":
        "TikTok",
        "post_text":
        f"When your cat has expensive taste 😹 #{title.replace(' ', '')} #CatTok #PetComedy",
        "hashtags": [
            "catsoftiktok", "funnypets", "catadventures", "whiskerswednesday",
            "shoppingspree"
        ],
        "best_time_to_post":
        "18:00",
        "engagement_prompt":
        "What's the craziest thing your cat has ever done? Tell us in the comments! 👇"
    }, {
        "name":
        "Instagram",
        "post_text":
        f"Whiskers has entered the chat... and the {premise.split(' ')[-1]}! 🛒🐱 Watch the full adventure of our Mischievous Cat Shopper! #CatsOfInstagram",
        "hashtags": [
            "catsofinstagram", "petinfluencer", "catcomedy", "funnycats",
            "catshopping"
        ],
        "best_time_to_post":
        "12:00",
        "engagement_prompt":
        "Double tap if your cat would totally do this too! What would YOUR cat shop for? 💭"
    }, {
        "name":
        "YouTube Shorts",
        "post_text":
        f"{title} | Mischievous Cat Shopper Series",
        "hashtags": [
            "CatVideos", "PetComedy", "ShortFilm", "AnimalsBeingDerps",
            "CatShopping"
        ],
        "best_time_to_post":
        "15:00",
        "engagement_prompt":
        "Subscribe to see more of Whiskers' shopping adventures! New episode every Friday!"
    }, {
        "name":
        "Twitter",
        "post_text":
        f"POV: You're a store manager and this little guy just set off your 'no pets allowed' alarm. 🐱🛒 #{title.replace(' ', '')}",
        "hashtags": ["CatsOfTwitter", "FunnyPets", "CatTales", "PetComedy"],
        "best_time_to_post":
        "17:00",
        "engagement_prompt":
        "Reply with what you think Whiskers is shopping for! Wrong answers only. 😹"
    }]

    # Generate content variations
    content_variations = [{
        "type":
        "Behind-the-scenes",
        "description":
        "How we trained our cat actor to perform shopping scenes",
        "purpose":
        "Show the work that goes into creating the content and build connection with audience"
    }, {
        "type": "Teaser",
        "description":
        "5-second clip of Whiskers in action with dramatic music",
        "purpose": "Build anticipation for the full episode"
    }, {
        "type":
        "Character spotlight",
        "description":
        "Meet Whiskers: his likes, dislikes, and shopping preferences",
        "purpose":
        "Develop character connection and backstory"
    }, {
        "type":
        "Blooper reel",
        "description":
        "Funny outtakes from filming the shopping scene",
        "purpose":
        "Provide additional entertainment value and show authenticity"
    }]

    return {"platforms": platforms, "content_variations": content_variations}
