# Content Generation Agent

This project provides a content generation agent that creates detailed content plans and scripts for a series about a mischievous cat who goes shopping.

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file based on `.env.example` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

## Usage

### Command Line

Generate a content plan:

```bash
python main.py --series_title "Mischievous Cat Shopper" --num_episodes 5 --cat_name "Whiskers" --content_style "humorous, family-friendly" --output content_plan.json
```

Generate a content plan with scripts for each episode:

```bash
python main.py --series_title "Mischievous Cat Shopper" --num_episodes 3 --cat_name "Whiskers" --generate_scripts --output content_plan_with_scripts.json
```

### API Server

Start the API server:

```bash
python api.py
```

The server will start on http://localhost:8000

API Endpoints:
- POST `/generate-content-plan` - Generate a content plan
- POST `/generate-script` - Generate a script for a specific episode

## API Examples

### Generate Content Plan

```bash
curl -X POST http://localhost:8000/generate-content-plan \
  -H "Content-Type: application/json" \
  -d '{
    "series_title": "Mischievous Cat Shopper",
    "num_episodes": 3,
    "cat_name": "Whiskers",
    "content_style": "humorous, family-friendly"
  }'
```

### Generate Script

```bash
curl -X POST http://localhost:8000/generate-script \
  -H "Content-Type: application/json" \
  -d '{
    "episode": {
      "title": "Grocery Store Mayhem",
      "premise": "Whiskers sneaks into a grocery store to find the fanciest cat food.",
      "setting": "Busy supermarket on a Saturday morning",
      "items": ["premium cat food", "catnip", "tuna"],
      "conflict": "Store manager notices Whiskers in the store and tries to catch them",
      "resolution": "Whiskers charms an elderly shopper who helps them escape with their treats"
    },
    "cat_name": "Whiskers",
    "content_style": "humorous, family-friendly"
  }'
```
