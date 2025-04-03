import os
import json
import requests
import asyncio
from typing import Dict, Any, List

async def generate_with_huggingface(
    prompt: str, 
    api_key: str, 
    model: str = "mistralai/Mistral-7B-Instruct-v0.2",
    max_new_tokens: int = 1024,
    temperature: float = 0.7
) -> str:
    """Generate text using Hugging Face Inference API"""
    url = f"https://api-inference.huggingface.co/models/{model}"
    headers = {"Authorization": f"Bearer {api_key}"}
    
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_new_tokens,
            "temperature": temperature,
            "return_full_text": False
        }
    }
    
    # Convert to async request using asyncio
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(
        None,
        lambda: requests.post(url, headers=headers, json=payload)
    )
    
    if response.status_code != 200:
        try:
            error_msg = response.json().get("error", "Unknown error")
        except:
            error_msg = f"HTTP error {response.status_code}"
        raise ValueError(f"Hugging Face API error: {error_msg}")
    
    return response.json()[0]["generated_text"]

async def generate_content_ideas_hf(config: Dict[str, Any]) -> Dict[str, Any]:
    """Generate content plan using Hugging Face models"""
    # Extract config parameters
    series_title = config.get("series_title", "Mischievous Cat Shopper")
    num_episodes = config.get("num_episodes", 5)
    cat_name = config.get("cat_name", "Whiskers")
    content_style = config.get("content_style", "humorous, family-friendly")
    theme = config.get("theme", content_style)
    setting = config.get("setting", "")
    target_audience = config.get("target_audience", "")
    additional_characters = config.get("additional_characters", "")
    api_key = config.get("api_key")
    
    if not api_key:
        raise ValueError("Hugging Face API key is required")
    
    print(f"Generating content ideas with Hugging Face for '{series_title}' with {num_episodes} episodes")
    
    # Create the prompt - match the OpenAI format for consistency
    prompt = f"""Create a content plan for a short-form video series titled "{series_title}" with {num_episodes} episodes.
    
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
    
    Ensure all content is family-friendly and appropriate for all audiences.
    
    Only return the JSON object, nothing else."""
    
    try:
        print("Sending request to Hugging Face API")
        
        # Generate the content plan
        response_text = await generate_with_huggingface(
            prompt=prompt,
            api_key=api_key,
            max_new_tokens=2048,
            temperature=0.7
        )
        
        print("Received response from Hugging Face API")
        
        # Extract JSON from the response
        # Sometimes models add extra text before/after the JSON
        try:
            # Try to parse the entire response as JSON
            content_plan = json.loads(response_text)
            print("Successfully parsed JSON response")
        except json.JSONDecodeError:
            # If that fails, try to extract just the JSON part
            import re
            print("Failed to parse entire response as JSON, trying to extract JSON part")
            
            # Look for JSON pattern
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            
            if json_start >= 0 and json_end > json_start:
                json_str = response_text[json_start:json_end]
                try:
                    content_plan = json.loads(json_str)
                    print("Successfully extracted and parsed JSON part")
                except json.JSONDecodeError:
                    # Try with regex as a fallback
                    json_match = re.search(r'({[\s\S]*})', response_text)
                    if json_match:
                        try:
                            content_plan = json.loads(json_match.group(1))
                            print("Successfully extracted and parsed JSON part with regex")
                        except:
                            print("Failed to parse extracted JSON part")
                            raise ValueError("Failed to parse Hugging Face response as JSON")
                    else:
                        print("Failed to extract JSON part from response")
                        raise ValueError(f"Failed to extract JSON from Hugging Face response. Raw response: {response_text[:200]}...")
            else:
                print("Failed to find JSON markers in response")
                raise ValueError(f"Failed to find JSON in Hugging Face response. Raw response: {response_text[:200]}...")
        
        return content_plan
        
    except ValueError as e:
        # Re-raise ValueError for specific error handling
        raise e
    except Exception as e:
        print(f"Error generating content plan with Hugging Face: {str(e)}")
        raise ValueError(f"Error generating content plan with Hugging Face: {str(e)}")
