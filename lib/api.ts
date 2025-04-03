// API utilities for communicating with the Python backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || `HTTP error ${response.status}`;
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    throw error instanceof Error 
      ? error 
      : new Error('An unknown error occurred while fetching the data.');
  }
}

// Script generation
export async function generateScript(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/content/generate-script`, {
    method: 'POST',
    body: JSON.stringify({ 
      episode_index: episodeIndex,
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Visual prompts generation
export async function generateVisualPrompts(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/generate/visual-prompts/${episodeIndex}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Image generation
export async function generateImages(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/generate/images/${episodeIndex}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Voiceover generation
export async function generateVoiceovers(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/generate/voiceovers/${episodeIndex}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Video generation
export async function generateVideo(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/generate/video/${episodeIndex}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Social media plan generation
export async function generateSocialMediaPlan(episodeIndex: number, apiKey?: string) {
  return fetchAPI(`/generate/social-media/${episodeIndex}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

// Job status checking
export async function getJobStatus(jobId: string) {
  return fetchAPI(`/jobs/${jobId}`);
}

interface ContentPlanConfig {
  series_title?: string;
  num_episodes: number;
  cat_name?: string;
  content_style?: string;
  theme: string;
  setting?: string;
  target_audience?: string;
  additional_characters?: string;
  description?: string;
  api_key?: string;
}

/**
 * Generates a content plan based on the provided configuration
 */
export async function generateContentPlan(config: ContentPlanConfig) {
  console.log("Sending content plan request with config:", {
    ...config,
    api_key: config.api_key ? "[REDACTED]" : undefined
  });
  
  // Use the provided API key or get from localStorage
  const apiKey = config.api_key || localStorage.getItem('openai_api_key') || undefined;
  
  // If a new API key is provided, save it for future use
  if (config.api_key) {
    localStorage.setItem('openai_api_key', config.api_key);
  }
  
  return fetchAPI('/content/generate-plan', {
    method: 'POST',
    body: JSON.stringify({
      ...config,
      api_key: apiKey
    }),
  });
}

/**
 * Runs the full content generation pipeline for a specific episode
 */
export async function runFullPipeline(episodeId: number, apiKey?: string) {
  return fetchAPI(`/generate/full-pipeline/${episodeId}`, {
    method: 'POST',
    body: JSON.stringify({
      api_key: apiKey || localStorage.getItem('openai_api_key') || undefined
    }),
  });
}

/**
 * Checks the status of the API connection
 */
export async function checkApiStatus(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetchAPI('/status', {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
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
