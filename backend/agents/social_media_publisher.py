import os
import asyncio
from datetime import datetime, timezone
import httpx
from typing import Dict, Any, List

class SocialMediaPublisher:
    def __init__(self):
        self.scheduled_posts = []
        
    async def schedule_post(self, platform: str, content: Dict[str, Any], publish_time: str):
        """Schedule a post for publishing"""
        self.scheduled_posts.append({
            "platform": platform,
            "content": content,
            "publish_time": publish_time,
            "status": "scheduled"
        })
        
    async def publish_to_platform(self, platform: str, content: Dict[str, Any]) -> bool:
        """Publish content to specific platform using their APIs"""
        try:
            if platform != "youtube":
                print(f"Skipping {platform} - currently only supporting YouTube")
                return False
                
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.getenv('YOUTUBE_API_KEY')}"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://www.googleapis.com/upload/youtube/v3/videos",
                    params={
                        "part": "snippet,status,recordingDetails,localizations",
                        "uploadType": "resumable"
                    },
                    headers=headers,
                    json={
                        "snippet": {
                            "title": content["title"],
                            "description": content["description"],
                            "tags": content.get("tags", []),
                            "categoryId": "22",  # People & Blogs
                            "defaultLanguage": "en",
                            "defaultAudioLanguage": "en",
                            "playlist": content.get("playlist", ""),
                            "thumbnailUrl": content.get("thumbnail_url", "")
                        },
                        "status": {
                            "privacyStatus": content.get("privacy_status", "private"),
                            "selfDeclaredMadeForKids": content.get("made_for_kids", False),
                            "publishAt": content.get("publish_at", None),
                            "license": content.get("license", "youtube"),
                            "embeddable": content.get("embeddable", True)
                        },
                        "recordingDetails": {
                            "location": content.get("location", None),
                            "recordingDate": content.get("recording_date", None)
                        }
                    }
                )
                
                if response.status_code == 200:
                    print("Successfully uploaded video to YouTube")
                    return True
                else:
                    print(f"Failed to upload to YouTube: {response.text}")
                    return False
        except Exception as e:
            print(f"Error publishing to {platform}: {str(e)}")
            return False

    async def run_scheduler(self):
        """Main scheduler loop"""
        while True:
            current_time = datetime.now(timezone.utc)
            
            for post in self.scheduled_posts:
                if post["status"] == "scheduled":
                    scheduled_time = datetime.fromisoformat(post["publish_time"])
                    
                    if current_time >= scheduled_time:
                        success = await self.publish_to_platform(
                            post["platform"],
                            post["content"]
                        )
                        
                        post["status"] = "published" if success else "failed"
                        
            await asyncio.sleep(60)  # Check every minute

    async def create_playlist(self, title: str, description: str, privacy_status: str = "private") -> str:
        """Create a new YouTube playlist"""
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.getenv('YOUTUBE_API_KEY')}"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://www.googleapis.com/youtube/v3/playlists",
                    params={"part": "snippet,status"},
                    headers=headers,
                    json={
                        "snippet": {
                            "title": title,
                            "description": description
                        },
                        "status": {
                            "privacyStatus": privacy_status
                        }
                    }
                )
                
                if response.status_code == 200:
                    playlist_data = response.json()
                    return playlist_data["id"]
                return None
        except Exception as e:
            print(f"Error creating playlist: {str(e)}")
            return None

    async def add_to_playlist(self, playlist_id: str, video_id: str) -> bool:
        """Add a video to a YouTube playlist"""
        try:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {os.getenv('YOUTUBE_API_KEY')}"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://www.googleapis.com/youtube/v3/playlistItems",
                    params={"part": "snippet"},
                    headers=headers,
                    json={
                        "snippet": {
                            "playlistId": playlist_id,
                            "resourceId": {
                                "kind": "youtube#video",
                                "videoId": video_id
                            }
                        }
                    }
                )
                return response.status_code == 200
        except Exception as e:
            print(f"Error adding to playlist: {str(e)}")
            return False

publisher = SocialMediaPublisher()
