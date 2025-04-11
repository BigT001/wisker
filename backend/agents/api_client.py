import os
import logging
import httpx
from typing import Dict, Any, List, Optional

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"
HUGGINGFACE_API_TOKEN = os.getenv("HUGGINGFACE_API_TOKEN", "")
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/"

async def call_openai_api(
    prompt: str,
    system_message: str = "",
    model: str = "gpt-3.5-turbo",
    temperature: float = 0.7,
    max_tokens: int = 2000,
    api_key: Optional[str] = None
) -> str:
    """Call OpenAI API with the given prompt"""
    # Use provided API key or fall back to environment variable
    api_key = api_key or OPENAI_API_KEY
    
    if not api_key:
        logger.error("OpenAI API key is not provided")
        raise ValueError("OpenAI API key is not provided")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
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
            response = await client.post(
                OPENAI_API_URL,
                headers=headers,
                json=data,
                timeout=60.0
            )
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

async def call_huggingface_api(
    prompt: str,
    model_id: str = "mistralai/Mistral-7B-Instruct-v0.2",
    temperature: float = 0.7,
    max_tokens: int = 2000,
    api_token: Optional[str] = None
) -> str:
    """Call Hugging Face API with the given prompt"""
    # Use provided API token or fall back to environment variable
    api_token = api_token or HUGGINGFACE_API_TOKEN
    
    if not api_token:
        logger.error("Hugging Face API token is not provided")
        raise ValueError("Hugging Face API token is not provided")
    
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    # Different models might require different payload formats
    # This is a common format that works with many instruction-tuned models
    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": max_tokens,
            "temperature": temperature,
            "return_full_text": False,
            "do_sample": True
        }
    }
    
    api_url = f"{HUGGINGFACE_API_URL}{model_id}"
    
    try:
        async with httpx.AsyncClient() as client:
            logger.info(f"Sending request to Hugging Face API with model: {model_id}")
            response = await client.post(
                api_url,
                headers=headers,
                json=payload,
                timeout=120.0  # Longer timeout for HF models
            )
            response.raise_for_status()
            result = response.json()
            logger.info("Successfully received response from Hugging Face API")
            
            # Handle different response formats
            if isinstance(result, list) and len(result) > 0:
                # Some models return a list of outputs
                return result[0].get("generated_text", "")
            elif isinstance(result, dict):
                # Some models return a dictionary
                return result.get("generated_text", "")
            else:
                # Fallback for other formats
                return str(result)
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error occurred: {e.response.status_code} - {e.response.text}")
        raise
    except httpx.RequestError as e:
        logger.error(f"Request error occurred: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise

async def generate_text(
    prompt: str,
    system_message: str = "",
    api_provider: str = "openai",
    model: str = None,
    temperature: float = 0.7,
    max_tokens: int = 2000,
    api_key: Optional[str] = None
) -> str:
    """
    Generate text using the specified API provider
    
    Args:
        prompt: The prompt to send to the API
        system_message: System message for OpenAI (ignored for Hugging Face)
        api_provider: "openai" or "huggingface"
        model: Model name/ID (provider-specific)
        temperature: Sampling temperature
        max_tokens: Maximum tokens to generate
        api_key: Optional API key/token to override environment variables
        
    Returns:
        Generated text
    """
    logger.info(f"Generating text using {api_provider}")
    
    if api_provider.lower() == "openai":
        # Default model for OpenAI
        if not model:
            model = "gpt-3.5-turbo"
        
        return await call_openai_api(
            prompt=prompt,
            system_message=system_message,
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            api_key=api_key
        )
    
    elif api_provider.lower() == "huggingface":
        # Default model for Hugging Face
        if not model:
            model = "mistralai/Mistral-7B-Instruct-v0.2"
        
        # For Hugging Face, we combine system message and prompt
        combined_prompt = prompt
        if system_message:
            combined_prompt = f"{system_message}\n\n{prompt}"
        
        return await call_huggingface_api(
            prompt=combined_prompt,
            model_id=model,
            temperature=temperature,
            max_tokens=max_tokens,
            api_token=api_key
        )
    
    else:
        logger.error(f"Unsupported API provider: {api_provider}")
        raise ValueError(f"Unsupported API provider: {api_provider}")
