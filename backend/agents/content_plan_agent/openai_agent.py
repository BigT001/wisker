import json
import logging
import re
from typing import Dict, Any
from agents.api_client import call_openai_api

logger = logging.getLogger(__name__)

async def generate_content_ideas(config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate content ideas for the series using OpenAI based on user input"""
    logger.info(f"Generating content plan for series: {config.get('series_title', 'Unknown')}")
    
    # Extract user inputs with fallbacks
    series_title = config.get('series_title', 'Mischievous Cat Shopper')
    num_episodes = int(config.get('num_episodes', config.get('episodes', 5)))
    cat_name = config.get('cat_name', 'Whiskers')
    content_style = config.get('content_style', 'humorous, family-friendly')
    theme = config.get('theme', '')
    
    # Get additional parameters if available
    setting = config.get('setting', '')
    target_audience = config.get('target_audience', '')
    additional_characters = config.get('additional_characters', '')
    
    # Create a more detailed system message
    system_message = """You are a creative content planner specializing in short-form video content.
    Your task is to generate a detailed, engaging content plan with episode ideas for a series about a mischievous and tricky cat who likes shopping.
    Be creative, original, and tailor your response to the specific inputs provided.
    Provide your response in valid JSON format that can be parsed by Python's json.loads()."""

    # Create a more detailed prompt incorporating all user inputs
    prompt = f"""Create a detailed content plan for a series titled "{series_title}" with {num_episodes} episodes.
    
    The main character is a cat named {cat_name}.
    The content style should be {content_style}.
    {f'The theme or additional context is: {theme}' if theme else ''}
    {f'The setting is: {setting}' if setting else ''}
    {f'The target audience is: {target_audience}' if target_audience else ''}
    {f'Additional characters include: {additional_characters}' if additional_characters else ''}
    
    For each episode, include:
    - title: A catchy, engaging title
    - premise: A brief but clear description of the episode's main idea
    - setting: A specific, interesting location where the episode takes place
    - items: 2-3 specific items the cat wants to buy in this episode
    - conflict: A specific, entertaining obstacle or challenge the cat faces
    - resolution: A satisfying, clever way the cat overcomes the conflict
    
    Also include:
    - series_concept: A compelling description of the overall series concept (2-3 sentences)
    - cat_personality: Details about the cat's traits, quirks, and catchphrases that make them unique
    
    Make each episode distinct and creative, with varied settings and scenarios.
    
    Return a JSON object with the following structure:
    {{
      "series_concept": "<brief description>",
      "cat_personality": {{
        "traits": ["<trait1>", "<trait2>", "<trait3>"],
        "quirks": ["<quirk1>", "<quirk2>", "<quirk3>"],
        "catchphrases": ["<phrase1>", "<phrase2>", "<phrase3>"]
      }},
      "episodes": [
        {{
          "title": "<episode title>",
          "premise": "<brief premise>",
          "setting": "<location>",
          "items": ["<item1>", "<item2>", "<item3>"],
          "conflict": "<main conflict>",
          "resolution": "<resolution>"
        }}
      ]
    }}"""

    try:
        # Call OpenAI API with more specific parameters
        logger.info("Calling OpenAI API for content plan generation")
        response_text = await call_openai_api(
            prompt,
            system_message,
            model="gpt-4" if config.get("use_gpt4", False) else "gpt-3.5-turbo",
            temperature=0.8  # Slightly higher temperature for more creativity
        )
        
        # Parse JSON response
        try:
            # Try to extract JSON if it's wrapped in markdown code blocks
            json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', response_text)
            if json_match:
                content_plan = json.loads(json_match.group(1))
                logger.info("Successfully extracted JSON from markdown response")
            else:
                content_plan = json.loads(response_text)
                logger.info("Successfully parsed JSON response")
            
            logger.info(f"Generated content plan with {len(content_plan.get('episodes', []))} episodes")
            
            # Validate the response structure
            if not isinstance(content_plan, dict):
                raise ValueError("Response is not a dictionary")
            
            required_keys = ["series_concept", "cat_personality", "episodes"]
            for key in required_keys:
                if key not in content_plan:
                    raise ValueError(f"Response missing required key: {key}")
            
            if not isinstance(content_plan["episodes"], list) or len(content_plan["episodes"]) < 1:
                raise ValueError("Episodes must be a non-empty list")
            
            # Ensure we have exactly the number of episodes requested
            if len(content_plan["episodes"]) != num_episodes:
                logger.warning(f"Received {len(content_plan['episodes'])} episodes but {num_episodes} were requested")
                
                # If we have too many, trim the list
                if len(content_plan["episodes"]) > num_episodes:
                    content_plan["episodes"] = content_plan["episodes"][:num_episodes]
                
                # If we have too few, we'll keep what we have
            
            return content_plan
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON response: {e}")
            logger.debug(f"Raw response: {response_text}")
            raise
        
    except Exception as e:
        logger.error(f"Error generating content plan: {str(e)}")
        raise
