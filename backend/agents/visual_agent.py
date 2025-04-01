import asyncio
import os
import base64
import httpx
from typing import Dict, Any, List, Optional
import io
from PIL import Image

# Hugging Face API configuration
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"


async def generate_visual_prompts(
        script: str) -> Dict[str, List[Dict[str, str]]]:
    """Generate visual prompts for Stable Diffusion based on the script"""
    print(
        "🎨 Visual Generation Agent: Creating prompts for image generation...")

    # Parse script to extract scenes
    scenes = []
    lines = script.split('\n')
    current_scene = None

    for line in lines:
        if line.startswith('[SCENE'):
            # Extract scene number and description
            scene_parts = line.split(' - ')
            if len(scene_parts) >= 2:
                scene_num = scene_parts[0].replace('[SCENE ', '').strip()
                scene_desc = scene_parts[1].strip()

                # Next line usually contains more detailed description
                scene_index = lines.index(line)
                if scene_index + 1 < len(lines):
                    detailed_desc = lines[scene_index + 1].strip()
                else:
                    detailed_desc = scene_desc

                scenes.append({
                    "scene_num": scene_num,
                    "description": detailed_desc,
                    "original_line": line
                })

    # Generate visual prompts for each scene
    visual_prompts = []
    for scene in scenes:
        # Create a Stable Diffusion prompt based on the scene description
        stable_diffusion_prompt = f"Photorealistic orange tabby cat in {scene['description']}, mischievous expression, detailed environment, bright lighting"

        # Determine style based on scene content
        if "chase" in scene['description'].lower(
        ) or "conflict" in scene['original_line'].lower():
            style = "Dynamic, action-oriented, bright lighting"
            shot_type = "Wide action shot with motion"
        elif "conclusion" in scene['original_line'].lower(
        ) or "resolution" in scene['original_line'].lower():
            style = "Triumphant, warm, satisfying composition"
            shot_type = "Medium shot focusing on cat's expression"
        else:
            style = "Detailed, colorful, slight anthropomorphism"
            shot_type = "Medium wide shot"

        visual_prompts.append({
            "description": scene['description'],
            "stable_diffusion_prompt": stable_diffusion_prompt,
            "style": style,
            "shot_type": shot_type
        })

    return {"scenes": visual_prompts}


async def generate_images(visual_prompts: Dict[str, List[Dict[str, str]]],
                          episode_index: int):
    """Generate images based on visual prompts using Hugging Face Stable Diffusion API"""
    print("🎨 Visual Generation Agent: Generating images with Hugging Face...")

    if not HUGGINGFACE_API_KEY:
        print(
            "⚠️ HUGGINGFACE_API_KEY not set, falling back to simulated images")
        return await generate_simulated_images(visual_prompts, episode_index)

    # Create images directory
    os.makedirs(f'./outputs/images/episode{episode_index+1}', exist_ok=True)

    # Set up headers for Hugging Face API
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }

    # Process each scene
    async with httpx.AsyncClient() as client:
        for i, scene in enumerate(visual_prompts['scenes']):
            print(
                f"Generating image for scene {i+1}: {scene['description'][:50]}..."
            )

            # Prepare the payload
            payload = {
                "inputs": scene['stable_diffusion_prompt'],
                "parameters": {
                    "negative_prompt":
                    "deformed, distorted, disfigured, poorly drawn, bad anatomy, wrong anatomy, extra limb, missing limb, floating limbs, disconnected limbs, mutation, mutated, ugly, disgusting, blurry, watermark",
                }
            }

            try:
                # Call Hugging Face API
                response = await client.post(HUGGINGFACE_API_URL,
                                             headers=headers,
                                             json=payload,
                                             timeout=60.0)
                response.raise_for_status()

                # Save the image
                image_bytes = response.content
                image = Image.open(io.BytesIO(image_bytes))
                image.save(
                    f'./outputs/images/episode{episode_index+1}/scene_{i+1}.png'
                )

                # Also save prompt info
                with open(
                        f'./outputs/images/episode{episode_index+1}/scene_{i+1}_prompt.txt',
                        'w') as f:
                    f.write(f"Prompt: {scene['stable_diffusion_prompt']}\n")
                    f.write(f"Style: {scene['style']}\n")
                    f.write(f"Shot Type: {scene['shot_type']}")

            except Exception as e:
                print(f"Error generating image: {e}")
                # Create a placeholder text file instead
                with open(
                        f'./outputs/images/episode{episode_index+1}/scene_{i+1}_error.txt',
                        'w') as f:
                    f.write(f"Error generating image: {str(e)}\n\n")
                    f.write(f"Prompt: {scene['stable_diffusion_prompt']}")

    return True


async def generate_simulated_images(visual_prompts: Dict[str, List[Dict[str,
                                                                        str]]],
                                    episode_index: int):
    """Generate simulated images (fallback function)"""
    print("⚠️ Falling back to simulated images...")

    # Create images directory
    os.makedirs(f'./outputs/images/episode{episode_index+1}', exist_ok=True)

    # Process each scene
    for i, scene in enumerate(visual_prompts['scenes']):
        print(
            f"Simulating image for scene {i+1}: {scene['description'][:50]}..."
        )

        # Simulate image generation delay
        await asyncio.sleep(0.5)

        # Write a description file
        with open(f'./outputs/images/episode{episode_index+1}/scene_{i+1}.txt',
                  'w') as f:
            f.write(f"[Simulated image for scene {i+1}]\n\n")
            f.write(f"Prompt: {scene['stable_diffusion_prompt']}\n")
            f.write(f"Style: {scene['style']}\n")
            f.write(f"Shot Type: {scene['shot_type']}")

    return True
