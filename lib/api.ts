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




/**
 * API functions for content generation
 * These are mock implementations for demonstration purposes
 */

interface ContentPlanConfig {
  num_episodes: number
  theme: string
}

/**
 * Generates a content plan based on the provided configuration
 */
export async function generateContentPlan(config: ContentPlanConfig): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // In a real implementation, this would make an API call to a backend service
  console.log("Generating content plan with config:", config)

  // Return success (in a real app, this would return the generated plan)
  return Promise.resolve()
}

/**
 * Runs the full content generation pipeline for a specific episode
 */
export async function runFullPipeline(episodeId: number): Promise<void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // In a real implementation, this would trigger a backend pipeline
  console.log("Running full pipeline for episode:", episodeId)

  // Return success
  return Promise.resolve()
}

/**
 * Checks the status of the API connection
 */
export async function checkApiStatus(): Promise<boolean> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real implementation, this would check if the API is available
  return Promise.resolve(true)
}

