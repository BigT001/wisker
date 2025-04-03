import asyncio
import logging
import random
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

async def generate_simulated_content_ideas(config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate simulated content ideas (fallback function) that incorporate user input"""
    logger.warning("Falling back to simulated content ideas")
    await asyncio.sleep(1)

    # Extract user inputs with fallbacks
    series_title = config.get('series_title', 'Mischievous Cat Shopper')
    num_episodes = min(int(config.get('num_episodes', config.get('episodes', 5))), 10)  # Cap at 10 episodes
    cat_name = config.get('cat_name', 'Whiskers')
    
    # Create a more personalized simulated response
    simulated_plan = {
        "series_concept": f"A mischievous cat named {cat_name} who goes shopping and causes chaos in various stores while trying to find the perfect items.",
        "cat_personality": {
            "traits": ["curious", "playful", "determined", "easily distracted"],
            "quirks": [
                "knocks items off shelves", "hides in shopping bags",
                f"meows at cashiers with a distinct '{cat_name}' sound"
            ],
            "catchphrases": [
                "Purr-fect purchase!", "Meow-velous deal!",
                f"{cat_name}'s cat-astrophe in aisle 9!"
            ]
        },
        "episodes": []
    }
    
    # Base episode templates
    episode_templates = [
        {
            "title": "Grocery Store Mayhem",
            "premise": f"{cat_name} sneaks into a grocery store to find the fanciest cat food.",
            "setting": "Busy supermarket on a Saturday morning",
            "items": ["premium cat food", "catnip", "tuna"],
            "conflict": f"Store manager notices {cat_name} in the store and tries to catch them",
            "resolution": f"{cat_name} charms an elderly shopper who helps them escape with their treats"
        },
        {
            "title": "Pet Store Pandemonium",
            "premise": f"{cat_name} visits a pet store to find a new toy but gets distracted by all the options.",
            "setting": "Large pet supply store with many aisles",
            "items": ["interactive toy", "cat bed", "treats"],
            "conflict": f"{cat_name} accidentally releases some hamsters from their cages",
            "resolution": f"{cat_name} helps round up the hamsters and is rewarded with the toy they wanted"
        },
        {
            "title": "Department Store Disaster",
            "premise": f"{cat_name} follows their owner to a fancy department store and gets separated.",
            "setting": "Upscale department store with multiple floors",
            "items": ["bow tie", "fancy cat collar", "gourmet treats"],
            "conflict": f"Security guards spot {cat_name} and chase them through the store",
            "resolution": f"{cat_name} finds their way to the lost and found where their owner is looking for them"
        },
        {
            "title": "Farmers Market Adventure",
            "premise": f"{cat_name} explores an outdoor farmers market looking for fresh fish.",
            "setting": "Bustling outdoor farmers market on a sunny day",
            "items": ["fresh fish", "organic catnip", "cream"],
            "conflict": f"A dog at the market starts chasing {cat_name} between the stalls",
            "resolution": f"{cat_name} befriends a fishmonger who gives them scraps and shoos away the dog"
        },
        {
            "title": "Online Shopping Chaos",
            "premise": f"{cat_name} walks across their owner's keyboard and accidentally orders items online.",
            "setting": "Home office with computer and later delivery trucks arriving",
            "items": ["cat tower", "100 cans of tuna", "cat costume"],
            "conflict": f"Packages keep arriving and {cat_name}'s owner is confused and frustrated",
            "resolution": f"The owner discovers {cat_name}'s online shopping spree when the cat happily plays in the empty boxes"
        }
    ]
    
    # Add episodes based on the requested number
    for i in range(min(num_episodes, len(episode_templates))):
        simulated_plan["episodes"].append(episode_templates[i])
    
    # If we need more episodes than templates, create some variations
    while len(simulated_plan["episodes"]) < num_episodes:
        # Create variations by mixing elements from existing templates
        base = random.choice(episode_templates)
        variation = base.copy()
        
                # Create a new title
        locations = ["Antique Shop", "Garden Center", "Electronics Store", "Bakery", 
                     "Clothing Boutique", "Sporting Goods Store", "Craft Store"]
        actions = ["Adventure", "Escapade", "Expedition", "Journey", "Quest", "Spree"]
        
        variation["title"] = f"{random.choice(locations)} {random.choice(actions)}"
        variation["setting"] = f"{random.choice(['Busy', 'Quiet', 'Exclusive', 'Trendy', 'Rustic'])} {variation['title'].split()[0]} on a {random.choice(['Monday', 'weekend', 'holiday', 'sale day'])}"
        
        # Mix up some items
        all_items = [item for episode in episode_templates for item in episode["items"]]
        variation["items"] = random.sample(all_items, 3)
        
        # Add the variation
        simulated_plan["episodes"].append(variation)
    
    logger.info(f"Generated simulated content plan with {len(simulated_plan['episodes'])} episodes")
    return simulated_plan

async def generate_simulated_script(episode_idea: Dict[str, Any]) -> str:
    """Generate a simulated script (fallback function) that's more dynamic based on the episode idea"""
    logger.warning("Falling back to simulated script")
    await asyncio.sleep(1)
    
    # Extract key elements from the episode idea
    title = episode_idea.get('title', 'Shopping Adventure')
    premise = episode_idea.get('premise', 'A cat goes shopping')
    setting = episode_idea.get('setting', 'A store')
    items = episode_idea.get('items', ['item'])
    conflict = episode_idea.get('conflict', 'Something goes wrong')
    resolution = episode_idea.get('resolution', 'Problem solved')
    
    # Create a more dynamic script based on the episode idea
    script = f"""TITLE: {title.upper()}

[SCENE 1 - EXTERIOR {setting.split()[0].upper()} - DAY - 0:00-0:05]
{setting} with appropriate signage visible.

NARRATION: Meet Whiskers, a cat with expensive taste and a shopping list.

[SFX: Playful, mischievous music begins]

[SCENE 2 - STORE ENTRANCE - 0:05-0:10]
Whiskers sneakily enters the {setting.lower()}.

NARRATION: Today's mission: find {items[0] if items else "something special"} and maybe cause a little chaos along the way.

[SFX: Door whoosh, bell chime]

[SCENE 3 - SHOPPING AREA - 0:10-0:20]
Whiskers explores the store, examining various items with a discerning eye.

NARRATION: Not just any {items[0] if items else "item"} would do. Whiskers was looking for the premium stuff.

[SFX: Contemplative "hmm" sound as Whiskers inspects products]

[SCENE 4 - CONFLICT INTRODUCTION - 0:20-0:25]
{conflict}

NARRATION: But not everyone appreciated a feline shopper with refined taste.

[SFX: Dramatic music sting]

[SCENE 5 - CHASE/CONFLICT SCENE - 0:25-0:40]
Montage of Whiskers navigating the conflict, causing minor chaos.

NARRATION: What followed was pure cat-astrophe!

[SFX: Fast-paced chase music, appropriate sound effects]

[SCENE 6 - RESOLUTION SETUP - 0:40-0:50]
{resolution}

NARRATION: Sometimes the perfect shopping partner is the one who appreciates the finer things in life.

[SFX: Gentle, resolving music]

[SCENE 7 - CONCLUSION - 0:50-0:60]
Whiskers with the items he wanted, looking satisfied.

NARRATION: Mission accomplished! Another successful shopping adventure for our mischievous cat shopper.

[SFX: Triumphant music, shopping bag rustling, purring]

WHISKERS: (looking at camera) Purr-fect purchase!

[END SCENE - FADE OUT]

[TOTAL RUNTIME: 60 SECONDS]"""

    logger.info("Generated simulated script")
    return script
