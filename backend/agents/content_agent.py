import os
import json
import aiohttp
from typing import Dict, Any, List

async def generate_content_ideas(config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate content ideas for a cat shopping series"""
    try:
        # Get API key from config or environment
        api_key = config.get('api_key') or os.environ.get('OPENAI_API_KEY')
        
        if not api_key:
            raise ValueError("OpenAI API key is required but not provided")
        
        # Extract configuration
        series_title = config.get('series_title', 'Mischievous Cat Shopper')
        num_episodes = config.get('num_episodes', 5)
        cat_name = config.get('cat_name', 'Whiskers')
        content_style = config.get('content_style', 'humorous, family-friendly')
        theme = config.get('theme', content_style)
        setting = config.get('setting', '')
        target_audience = config.get('target_audience', '')
        additional_characters = config.get('additional_characters', '')
        
        print(f"Generating content ideas for '{series_title}' with {num_episodes} episodes")
        
        # Prepare the prompt for OpenAI
        system_prompt = """You are a creative content planner for short-form video series. 
        Create a detailed content plan for a series about a mischievous cat who goes shopping."""
        
        user_prompt = f"""Create a content plan for a short-form video series titled "{series_title}" with {num_episodes} episodes.
        
        The main character is a cat named {cat_name} who loves to go shopping.
        
        The content style should be: {content_style}
        
        Additional details:
        - Setting: {setting}
        - Target audience: {target_audience}
        - Additional characters: {additional_characters}
        - Theme/mood: {theme}
        
        For each episode, include:
        1. A catchy title
        2. A brief premise
        3. The specific setting (what store or shopping location)
        4. List of 2-3 items the cat is shopping for
        5. A conflict that arises
        6. How the conflict is resolved
        
        Also include a section about the cat's personality with:
        1. 3-5 personality traits
        2. 2-3 quirky behaviors
        3. 2-3 catchphrases or sounds the cat makes
        
        Format the response as a JSON object with the following structure:
        {{
          "series_concept": "Brief overall concept",
          "cat_personality": {{
            "traits": ["trait1", "trait2", "etc"],
            "quirks": ["quirk1", "quirk2", "etc"],
            "catchphrases": ["phrase1", "phrase2", "etc"]
          }},
          "episodes": [
            {{
              "title": "Episode title",
              "premise": "Brief premise",
              "setting": "Specific store or location",
              "items": ["item1", "item2", "etc"],
              "conflict": "Description of conflict",
              "resolution": "How conflict is resolved"
            }}
          ]
        }}
        
        Ensure all content is family-friendly and appropriate for all audiences."""
        
        # Prepare the API request
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }
        
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.7
        }
        
        print("Sending request to OpenAI API")
        
        # Make the API request
        async with aiohttp.ClientSession() as session:
            async with session.post(
                "https://api.openai.com/v1/chat/completions",
                headers=headers,
                json=payload
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    print(f"OpenAI API error: {response.status} - {error_text}")
                    raise ValueError(f"OpenAI API returned error {response.status}: {error_text}")
                
                result = await response.json()
        
        print("Received response from OpenAI API")
        
        # Extract and parse the content plan
        content_plan_text = result["choices"][0]["message"]["content"]
        
        # Sometimes OpenAI returns text before or after the JSON, so we need to extract just the JSON part
        try:
            # Try to parse the entire response as JSON
            content_plan = json.loads(content_plan_text)
            print("Successfully parsed JSON response")
        except json.JSONDecodeError:
            # If that fails, try to extract just the JSON part
            import re
            print("Failed to parse entire response as JSON, trying to extract JSON part")
            json_match = re.search(r'({[\s\S]*})', content_plan_text)
            if json_match:
                try:
                    content_plan = json.loads(json_match.group(1))
                    print("Successfully extracted and parsed JSON part")
                except json.JSONDecodeError:
                    print("Failed to parse extracted JSON part")
                    raise ValueError("Failed to parse OpenAI response as JSON")
            else:
                print("Failed to extract JSON part from response")
                raise ValueError("Failed to extract JSON from OpenAI response")
        
        return content_plan
    
    except aiohttp.ClientError as e:
        print(f"Network error when calling OpenAI API: {str(e)}")
        raise ValueError(f"Network error when calling OpenAI API: {str(e)}")
    except json.JSONDecodeError as e:
        print(f"Error parsing OpenAI response: {str(e)}")
        raise ValueError(f"Error parsing OpenAI response: {str(e)}")
    except Exception as e:
        print(f"Error generating content plan: {str(e)}")
        raise ValueError(f"Error generating content plan: {str(e)}")
