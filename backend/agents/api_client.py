import os
import logging
import httpx
from typing import Dict, Any, List

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# OpenAI API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"

async def call_openai_api(prompt: str,
                          system_message: str = "",
                          model: str = "gpt-3.5-turbo",
                          temperature: float = 0.7,
                          max_tokens: int = 2000) -> str:
    """Call OpenAI API with the given prompt"""
    if not OPENAI_API_KEY:
        logger.error("OPENAI_API_KEY environment variable is not set")
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
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        async with httpx.AsyncClient() as client:
            logger.info(f"Sending request to OpenAI API with model: {model}")
            response = await client.post(OPENAI_API_URL,
                                        headers=headers,
                                        json=data,
                                        timeout=60.0)
            response.raise_for_status()
            result = response.json()
            logger.info("Successfully received response from OpenAI API")
            return result["choices"][0]["message"]["content"]
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise
    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise
