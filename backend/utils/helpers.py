import re
from typing import List, Dict, Any

# Global jobs store
jobs = {}

def update_job_progress(job_id: str, progress: int):
    """Update the progress of a job"""
    if job_id in jobs:
        jobs[job_id]["progress"] = progress

def extract_narration_lines(script: str) -> List[str]:
    """Extract narration lines from the script"""
    lines = script.split('\n')
    narration_lines = []

    in_narration_block = False

    for line in lines:
        trimmed_line = line.strip()

        # Look for narration/voiceover sections
        if re.search(r'narration:', trimmed_line, re.IGNORECASE) or re.search(r'voiceover:', trimmed_line, re.IGNORECASE):
            in_narration_block = True
            # Extract the actual narration text if it's on the same line
            match = re.search(r'(?:narration|voiceover):(.*)', trimmed_line, re.IGNORECASE)
            if match and match.group(1).strip():
                narration_lines.append(match.group(1).strip())

        # If we're in a narration block and the line isn't a new section header
        elif in_narration_block and not trimmed_line.endswith(':') and not trimmed_line.startswith('[') and trimmed_line:
            narration_lines.append(trimmed_line)

        # Check if we're exiting a narration block
        elif in_narration_block and (trimmed_line.endswith(':') or trimmed_line.startswith('[') or not trimmed_line):
            in_narration_block = False

    return narration_lines
