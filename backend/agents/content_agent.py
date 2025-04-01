import asyncio
import os
from typing import Dict, Any, List
import json
import httpx

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"


async def call_openai_api(prompt: str,
                          system_message: str = "",
                          model: str = "gpt-3.5-turbo") -> str:
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
        "max_tokens": 2000
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(OPENAI_API_URL,
                                     headers=headers,
                                     json=data,
                                     timeout=60.0)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]


async def generate_content_ideas(config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate content ideas for the series using OpenAI"""
    print(
        "🧠 Content Planning Agent: Generating series concept and episode ideas with OpenAI..."
    )

    # Create prompt for OpenAI
    system_message = """You are a creative content planner for a series about a mischievous cat who goes shopping.
    Your task is to generate a detailed content plan with episode ideas.
    Provide your response in valid JSON format."""

    prompt = f"""Create a content plan for a series titled "{config['series_title']}" with {config['episodes']} episodes.
    The main character is a cat named {config['cat_name']}.
    The content style should be {config['content_style']}.

    For each episode, include:
    - title
    - premise
    - setting
    - items the cat wants to buy
    - conflict
    - resolution

    Also include:
    - series_concept: A brief description of the overall series concept
    - cat_personality: Details about the cat's traits, quirks, and catchphrases

    Return a JSON object with the following structure:
    {{
      "series_concept": "<brief description>",
      "cat_personality": {{
        "traits": ["<trait1>", "<trait2>"],
        "quirks": ["<quirk1>", "<quirk2>"],
        "catchphrases": ["<phrase1>", "<phrase2>"]
      }},
      "episodes": [
        {{
          "title": "<episode title>",
          "premise": "<brief premise>",
          "setting": "<location>",
          "items": ["<item1>", "<item2>"],
          "conflict": "<main conflict>",
          "resolution": "<resolution>"
        }}
      ]
    }}"""

    try:
        # Call OpenAI API
        response_text = await call_openai_api(prompt, system_message)

        # Parse JSON response
        content_plan = json.loads(response_text)
        return content_plan
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Fall back to simulated response if API call fails
        return await generate_simulated_content_ideas(config)


async def generate_script(episode_idea: Dict[str, Any]) -> str:
    """Generate a script for an episode using OpenAI"""
    print(
        "✍️ Script Generation Agent: Creating script based on episode idea with OpenAI..."
    )

    # Create prompt for OpenAI
    system_message = """You are a professional script writer for short-form video content.
    Your task is to write a 60-second script for an episode about a mischievous cat who goes shopping.
    Include scene descriptions, narration, and sound effect notes."""

    prompt = f"""Write a 60-second script for an episode titled "{episode_idea['title']}".

    Episode premise: {episode_idea['premise']}
    Setting: {episode_idea['setting']}
    Items the cat wants: {', '.join(episode_idea['items'])}
    Conflict: {episode_idea['conflict']}
    Resolution: {episode_idea['resolution']}

    Format the script with:
    - Scene headings with timestamps (e.g., [SCENE 1 - LOCATION - 0:00-0:05])
    - Scene descriptions
    - Narration lines
    - Sound effect notes [SFX: description]
    - Total runtime of 60 seconds

    Make it humorous, family-friendly, and engaging for all ages."""

    try:
        # Call OpenAI API
        script = await call_openai_api(prompt, system_message)
        return script
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        # Fall back to simulated response if API call fails
        return await generate_simulated_script(episode_idea)


# Fallback functions in case API calls fail
async def generate_simulated_content_ideas(
        config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate simulated content ideas (fallback function)"""
    print("⚠️ Falling back to simulated content ideas...")
    await asyncio.sleep(1)

    # Return simulated content plan (same as before)
    return {
        "series_concept":
        "A mischievous cat named Whiskers who goes shopping and causes chaos in various stores while trying to find the perfect items.",
        "cat_personality": {
            "traits":
            ["curious", "playful", "determined", "easily distracted"],
            "quirks": [
                "knocks items off shelves", "hides in shopping bags",
                "meows at cashiers"
            ],
            "catchphrases": [
                "Purr-fect purchase!", "Meow-velous deal!",
                "Cat-astrophe in aisle 9!"
            ]
        },
        "episodes": [
            {
                "title":
                "Grocery Store Mayhem",
                "premise":
                "Whiskers sneaks into a grocery store to find the fanciest cat food.",
                "setting":
                "Busy supermarket on a Saturday morning",
                "items": ["premium cat food", "catnip", "tuna"],
                "conflict":
                "Store manager notices a cat in the store and tries to catch Whiskers",
                "resolution":
                "Whiskers charms an elderly shopper who helps him escape with his treats"
            },
            {
                "title":
                "Pet Store Pandemonium",
                "premise":
                "Whiskers visits a pet store to find a new toy but gets distracted by all the options.",
                "setting":
                "Large pet supply store with many aisles",
                "items": ["interactive toy", "cat bed", "treats"],
                "conflict":
                "Whiskers accidentally releases some hamsters from their cages",
                "resolution":
                "Whiskers helps round up the hamsters and is rewarded with the toy he wanted"
            },
            {
                "title":
                "Department Store Disaster",
                "premise":
                "Whiskers follows his owner to a fancy department store and gets separated.",
                "setting":
                "Upscale department store with multiple floors",
                "items": ["bow tie", "fancy cat collar", "gourmet treats"],
                "conflict":
                "Security guards spot Whiskers and chase him through the store",
                "resolution":
                "Whiskers finds his way to the lost and found where his owner is looking for him"
            },
            {
                "title":
                "Farmers Market Adventure",
                "premise":
                "Whiskers explores an outdoor farmers market looking for fresh fish.",
                "setting":
                "Bustling outdoor farmers market on a sunny day",
                "items": ["fresh fish", "organic catnip", "cream"],
                "conflict":
                "A dog at the market starts chasing Whiskers between the stalls",
                "resolution":
                "Whiskers befriends a fishmonger who gives him scraps and shoos away the dog"
            },
            {
                "title":
                "Online Shopping Chaos",
                "premise":
                "Whiskers walks across his owner's keyboard and accidentally orders items online.",
                "setting":
                "Home office with computer and later delivery trucks arriving",
                "items": ["cat tower", "100 cans of tuna", "cat costume"],
                "conflict":
                "Packages keep arriving and Whiskers' owner is confused and frustrated",
                "resolution":
                "The owner discovers Whiskers' online shopping spree when the cat happily plays in the empty boxes"
            }
        ]
    }


async def generate_simulated_script(episode_idea: Dict[str, Any]) -> str:
    """Generate a simulated script (fallback function)"""
    print("⚠️ Falling back to simulated script...")
    await asyncio.sleep(1)

    # Return simulated script (same as before)
    return f"""TITLE: {episode_idea['title'].upper()}

[SCENE 1 - EXTERIOR {episode_idea['setting'].upper()} - DAY - 0:00-0:05]
{episode_idea['setting']} with appropriate signage visible.

NARRATION: Meet Whiskers, a cat with expensive taste and a shopping list.

[SFX: Playful, mischievous music begins]

[SCENE 2 - STORE ENTRANCE - 0:05-0:10]
Whiskers sneakily enters the {episode_idea['setting'].lower()}.

NARRATION: Today's mission: find {episode_idea['items'][0]} and maybe cause a little chaos along the way.

[SFX: Door whoosh, bell chime]

[SCENE 3 - SHOPPING AREA - 0:10-0:20]
Whiskers explores the store, examining various items with a discerning eye.

NARRATION: Not just any {episode_idea['items'][0]} would do. Whiskers was looking for the premium stuff.

[SFX: Contemplative "hmm" sound as Whiskers inspects products]

[SCENE 4 - CONFLICT INTRODUCTION - 0:20-0:25]
{episode_idea['conflict']}

NARRATION: But not everyone appreciated a feline shopper with refined taste.

[SFX: Dramatic music sting]

[SCENE 5 - CHASE/CONFLICT SCENE - 0:25-0:40]
Montage of Whiskers navigating the conflict, causing minor chaos.

NARRATION: What followed was pure cat-astrophe!

[SFX: Fast-paced chase music, appropriate sound effects]

[SCENE 6 - RESOLUTION SETUP - 0:40-0:50]
{episode_idea['resolution']}

NARRATION: Sometimes the perfect shopping partner is the one who appreciates the finer things in life.

[SFX: Gentle, resolving music]

[SCENE 7 - CONCLUSION - 0:50-0:60]
Whiskers with the items he wanted, looking satisfied.

NARRATION: Mission accomplished! Another successful shopping adventure for our mischievous cat shopper.

[SFX: Triumphant music, shopping bag rustling, purring]

WHISKERS: (looking at camera) Purr-fect purchase!

[END SCENE - FADE OUT]

[TOTAL RUNTIME: 60 SECONDS]"""
