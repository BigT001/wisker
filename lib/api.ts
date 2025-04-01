// API utilities for communicating with the Python backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'An error occurred while fetching the data.');
  }

  return response.json();
}

// Content generation
export async function generateContentPlan(config: any) {
  return fetchAPI('/generate/content-plan', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

// Script generation
export async function generateScript(episodeIndex: number) {
  return fetchAPI(`/generate/script/${episodeIndex}`, {
    method: 'POST',
  });
}

// Visual prompts generation
export async function generateVisualPrompts(episodeIndex: number) {
  return fetchAPI(`/generate/visual-prompts/${episodeIndex}`, {
    method: 'POST',
  });
}

// Image generation
export async function generateImages(episodeIndex: number) {
  return fetchAPI(`/generate/images/${episodeIndex}`, {
    method: 'POST',
  });
}

// Voiceover generation
export async function generateVoiceovers(episodeIndex: number) {
  return fetchAPI(`/generate/voiceovers/${episodeIndex}`, {
    method: 'POST',
  });
}

// Video generation
export async function generateVideo(episodeIndex: number) {
  return fetchAPI(`/generate/video/${episodeIndex}`, {
    method: 'POST',
  });
}

// Social media plan generation
export async function generateSocialMediaPlan(episodeIndex: number) {
  return fetchAPI(`/generate/social-media/${episodeIndex}`, {
    method: 'POST',
  });
}

// Job status checking
export async function getJobStatus(jobId: string) {
  return fetchAPI(`/jobs/${jobId}`);
}

// Full pipeline
export async function runFullPipeline(episodeIndex: number) {
  return fetchAPI(`/generate/full-pipeline/${episodeIndex}`, {
    method: 'POST',
  });
}
