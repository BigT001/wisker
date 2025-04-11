import os

# Create output directories
os.makedirs("./outputs", exist_ok=True)
os.makedirs("./outputs/content_plan", exist_ok=True)
os.makedirs("./outputs/scripts", exist_ok=True)
os.makedirs("./outputs/images", exist_ok=True)
os.makedirs("./outputs/audio", exist_ok=True)
os.makedirs("./outputs/video", exist_ok=True)
os.makedirs("./outputs/social_media", exist_ok=True)

# API configuration
API_TITLE = "Mischievous Cat Shopper API"
API_DESCRIPTION = "API for generating content for the Mischievous Cat Shopper series"
API_VERSION = "1.0.0"

# CORS settings
CORS_ORIGINS = ["*"]  # In production, replace with specific origins
CORS_CREDENTIALS = True
CORS_METHODS = ["*"]
CORS_HEADERS = ["*"]
