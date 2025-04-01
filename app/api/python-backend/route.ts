import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    setupGuide: `
# Python Backend Setup Guide

This guide will help you set up the Python backend for the Mischievous Cat Shopper Content Generation Platform.

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment tool (venv or conda)
- FFmpeg installed on your system (for video processing)

## Step 1: Create Project Structure

Create the following directory structure:

\`\`\`
backend/
├── agents/
│   ├── __init__.py
├── outputs/
│   ├── images/
│   ├── audio/
│   ├── video/
│   └── social_media/
└── .env
\`\`\`

## Step 2: Set Up Virtual Environment

Create and activate a virtual environment:

\`\`\`bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows
venv\\Scripts\\activate
# On macOS/Linux
source venv/bin/activate
\`\`\`

## Step 3: Install Dependencies

Install the required Python packages:

\`\`\`bash
pip install fastapi uvicorn httpx python-multipart pillow moviepy ffmpeg-python python-dotenv
\`\`\`

## Step 4: Configure Environment Variables

Create a \`.env\` file in the root directory with the following variables:

\`\`\`
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key  # Optional
HUGGINGFACE_API_KEY=your_huggingface_api_key  # Optional
\`\`\`

## Step 5: Copy Python Files

Copy the provided Python files into the appropriate directories:

1. \`content_agent.py\`, \`visual_agent.py\`, \`voiceover_agent.py\`, \`video_agent.py\`, \`social_media_agent.py\`, and \`social_media_publisher.py\` into the \`agents/\` directory
2. \`main.py\` into the root directory

## Step 6: Create __init__.py

Create an \`__init__.py\` file in the \`agents/\` directory to make it a proper Python package:

\`\`\`python
# agents/__init__.py
# This file makes the agents directory a Python package
\`\`\`

## Step 7: Run the FastAPI Server

Start the FastAPI server:

\`\`\`bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
\`\`\`

The API will be available at http://localhost:8000, and the API documentation will be available at http://localhost:8000/docs.

## Step 8: Connect Frontend to Backend

Make sure your Next.js frontend is configured to connect to the backend by setting the \`NEXT_PUBLIC_API_URL\` environment variable to \`http://localhost:8000\`.
    `
  })
}
