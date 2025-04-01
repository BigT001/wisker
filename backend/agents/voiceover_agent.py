import asyncio
import os
import re
from typing import List, Callable, Optional

# ElevenLabs API configuration
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY", "")
ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech"
ELEVENLABS_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"  # Default voice ID (Rachel)


async def generate_voiceovers(
        script: str,
        episode_index: int,
        progress_callback: Optional[Callable[[int], None]] = None):
    """Generate voiceovers from script narration lines using ElevenLabs"""
    print(
        "🎤 Voiceover Generation Agent: Creating audio files with ElevenLabs..."
    )

    # Extract narration lines
    narration_lines = extract_narration_lines(script)
    print(f"Found {len(narration_lines)} narration lines to convert to speech")

    # Create audio directory
    os.makedirs(f'./outputs/audio/episode{episode_index+1}', exist_ok=True)

    # Check if ElevenLabs API key is set
    if not ELEVENLABS_API_KEY:
        print("⚠️ ELEVENLABS_API_KEY not set, falling back to simulated audio")
        return await generate_simulated_voiceovers(narration_lines,
                                                   episode_index,
                                                   progress_callback)

    # Import httpx here to avoid import errors if not installed
    import httpx

    # Set up headers for ElevenLabs API
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }

    # Process each line
    async with httpx.AsyncClient() as client:
        for i, line in enumerate(narration_lines):
            print(f"Processing line {i+1}: {line[:50]}...")

            # Update progress if callback provided
            if progress_callback:
                progress = int((i / len(narration_lines)) * 100)
                progress_callback(progress)

            # Prepare the payload
            payload = {
                "text": line,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.5,
                    "similarity_boost": 0.5
                }
            }

            try:
                # Call ElevenLabs API
                response = await client.post(
                    f"{ELEVENLABS_API_URL}/{ELEVENLABS_VOICE_ID}",
                    headers=headers,
                    json=payload,
                    timeout=30.0)
                response.raise_for_status()

                # Save the audio file
                with open(
                        f'./outputs/audio/episode{episode_index+1}/line_{i+1}.mp3',
                        'wb') as f:
                    f.write(response.content)

                # Also save the text for reference
                with open(
                        f'./outputs/audio/episode{episode_index+1}/line_{i+1}.txt',
                        'w') as f:
                    f.write(f'Text: "{line}"')

            except Exception as e:
                print(f"Error generating audio: {e}")
                # Create a placeholder text file instead
                with open(
                        f'./outputs/audio/episode{episode_index+1}/line_{i+1}_error.txt',
                        'w') as f:
                    f.write(f"Error generating audio: {str(e)}\n\n")
                    f.write(f'Text: "{line}"')

    # Final progress update
    if progress_callback:
        progress_callback(100)

    return True


async def generate_simulated_voiceovers(
        narration_lines: List[str],
        episode_index: int,
        progress_callback: Optional[Callable[[int], None]] = None):
    """Generate simulated voiceovers (fallback function)"""
    print("⚠️ Falling back to simulated voiceovers...")

    # Create audio directory
    os.makedirs(f'./outputs/audio/episode{episode_index+1}', exist_ok=True)

    # Process each line
    for i, line in enumerate(narration_lines):
        print(f"Simulating audio for line {i+1}: {line[:50]}...")

        # Update progress if callback provided
        if progress_callback:
            progress = int((i / len(narration_lines)) * 100)
            progress_callback(progress)

        # Simulate API call delay
        await asyncio.sleep(0.2)

        # Write a description file
        with open(f'./outputs/audio/episode{episode_index+1}/line_{i+1}.txt',
                  'w') as f:
            f.write(f"[Simulated audio file for line {i+1}]\n\n")
            f.write(f'Text: "{line}"')

    # Final progress update
    if progress_callback:
        progress_callback(100)

    return True


# Helper function to extract narration lines from the script
def extract_narration_lines(script: str) -> List[str]:
    """Extract narration lines from the script"""
    lines = script.split('\n')
    narration_lines = []

    in_narration_block = False

    for line in lines:
        trimmed_line = line.strip()

        # Look for narration/voiceover sections
        if re.search(r'narration:', trimmed_line, re.IGNORECASE) or re.search(
                r'voiceover:', trimmed_line, re.IGNORECASE):
            in_narration_block = True
            # Extract the actual narration text if it's on the same line
            match = re.search(r'(?:narration|voiceover):(.*)', trimmed_line,
                              re.IGNORECASE)
            if match and match.group(1).strip():
                narration_lines.append(match.group(1).strip())

        # If we're in a narration block and the line isn't a new section header
        elif in_narration_block and not trimmed_line.endswith(
                ':') and not trimmed_line.startswith('[') and trimmed_line:
            narration_lines.append(trimmed_line)

        # Check if we're exiting a narration block
        elif in_narration_block and (trimmed_line.endswith(':')
                                     or trimmed_line.startswith('[')
                                     or not trimmed_line):
            in_narration_block = False

    return narration_lines
