import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    readme: `
# Mischievous Cat Shopper Content Generation Platform

A full-stack application that combines a Next.js frontend with a Python FastAPI backend to generate content for the "Mischievous Cat Shopper" series. This platform orchestrates the content generation workflow from ideation to video production and social media planning.

## Features

- Content idea generation using OpenAI
- Script generation for episodes
- Visual prompt creation and image generation
- Voiceover synthesis from script narration
- Video production by combining images and audio
- Social media planning for content distribution
- User-friendly dashboard interface

## Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hooks for state management

### Backend
- Python 3.9+
- FastAPI
- OpenAI API integration
- ElevenLabs for voiceover generation (optional)
- Hugging Face for image generation (optional)
- FFmpeg for video processing

## Getting Started

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env.local\` file with the following variables:
   \`\`\`
   NEXT_PUBLIC_API_URL=http://localhost:8000
   \`\`\`
4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Backend Setup

1. Navigate to the backend directory
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
6. Run the FastAPI server:
   \`\`\`bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   \`\`\`
7. The API will be available at http://localhost:8000
8. API documentation will be available at http://localhost:8000/docs

## Project Structure

### Frontend

\`\`\`
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── ui/               # UI components
│   ├── dashboard.tsx     # Main dashboard
│   ├── content-generator.tsx
│   ├── script-generator.tsx
│   ├── visual-generator.tsx
│   ├── voiceover-generator.tsx
│   ├── video-generator.tsx
│   └── social-media-planner.tsx
├── lib/                  # Utility functions
│   └── api.ts            # API client
└── public/               # Static assets
\`\`\`

### Backend

\`\`\`
├── agents/               # Agent modules
│   ├── content_agent.py  # Content generation
│   ├── visual_agent.py   # Visual generation
│   ├── voiceover_agent.py # Voiceover generation
│   ├── video_agent.py    # Video generation
│   ├── social_media_agent.py # Social media planning
│   └── social_media_publisher.py # Publishing
├── main.py               # FastAPI application
└── .env                  # Environment variables
\`\`\`

## Workflow

1. Generate content ideas for the series
2. Create scripts for individual episodes
3. Generate visual prompts and images for scenes
4. Create voiceovers from script narration
5. Combine images and audio into videos
6. Plan social media content for distribution

## License

MIT
    `
  })
}
