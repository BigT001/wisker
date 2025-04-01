import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    instructions: `
# Python Backend Setup Instructions

## Prerequisites
- Python 3.9+ installed
- pip (Python package manager)
- Virtual environment tool (venv or conda)

## Setup Steps

1. Clone the repository or download the Python files
2. Create a virtual environment:
   \`\`\`bash
   python -m venv venv
   \`\`\`
3. Activate the virtual environment:
   - Windows: \`venv\\Scripts\\activate\`
   - macOS/Linux: \`source venv/bin/activate\`
4. Install dependencies:
   \`\`\`bash
   pip install fastapi uvicorn httpx python-multipart pillow moviepy ffmpeg-python
   \`\`\`
5. Set up environment variables:
   Create a .env file with the following variables:
   \`\`\`
   OPENAI_API_KEY=your_openai_api_key
   ELEVENLABS_API_KEY=your_elevenlabs_api_key (optional)
   HUGGINGFACE_API_KEY=your_huggingface_api_key (optional)
   \`\`\`
6. Organize the Python files:
   - Create a directory structure as follows:
     \`\`\`
     backend/
     ├── agents/
     │   ├── __init__.py
     │   ├── content_agent.py
     │   ├── visual_agent.py
     │   ├── voiceover_agent.py
     │   ├── video_agent.py
     │   ├── social_media_agent.py
     │   └── social_media_publisher.py
     ├── main.py
     └── .env
     \`\`\`
7. Run the FastAPI server:
   \`\`\`bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`
8. The API will be available at http://localhost:8000
9. API documentation will be available at http://localhost:8000/docs
    `
  })
}
