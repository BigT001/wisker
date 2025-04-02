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

interface ContentPlanConfig {
  num_episodes: number;
  theme: string;
  title?: string;
  description?: string;
}

/**
 * Generates a content plan based on the provided configuration
 */
export async function generateContentPlan(config: ContentPlanConfig) {
  return fetchAPI('/generate/content-plan', {
    method: 'POST',
    body: JSON.stringify(config),
  });
}

/**
 * Runs the full content generation pipeline for a specific episode
 */
export async function runFullPipeline(episodeId: number) {
  return fetchAPI(`/generate/pipeline/${episodeId}`, {
    method: 'POST',
  });
}

/**
 * Checks the status of the API connection
 */
export async function checkApiStatus(): Promise<boolean> {
  try {
    const response = await fetchAPI('/status', {
      method: 'GET',
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(5000),
    });
    
    return response.status === 'operational';
  } catch (error) {
    console.error('API status check failed:', error);
    return false;
  }
}

/**
 * Get all episodes
 */
export async function getEpisodes() {
  return fetchAPI('/episodes');
}

/**
 * Get a specific episode by ID
 */
export async function getEpisode(episodeId: number) {
  return fetchAPI(`/episodes/${episodeId}`);
}

/**
 * Get all content plans
 */
export async function getContentPlans() {
  return fetchAPI('/content-plans');
}

/**
 * Get a specific content plan by ID
 */
export async function getContentPlan(planId: string) {
  return fetchAPI(`/content-plans/${planId}`);
}

/**
 * Save a content plan
 */
export async function saveContentPlan(plan: any) {
  return fetchAPI('/content-plans', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
}

/**
 * Update a content plan
 */
export async function updateContentPlan(planId: string, plan: any) {
  return fetchAPI(`/content-plans/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(plan),
  });
}

/**
 * Delete a content plan
 */
export async function deleteContentPlan(planId: string) {
  return fetchAPI(`/content-plans/${planId}`, {
    method: 'DELETE',
  });
}
