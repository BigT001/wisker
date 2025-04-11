import { ScriptGenerationRequest, ScriptGeneratorProps } from './types';


// API utilities for communicating with the Python backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';


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
  api_provider?: 'openai' | 'huggingface';
  use_gpt4?: boolean;
}
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

// Get API key based on provider
function getApiKey(apiProvider: string = 'openai', providedKey?: string): string | undefined {
  const storageKey = apiProvider === 'openai' ? 'openai_api_key' : 'huggingface_api_key';
  return providedKey || localStorage.getItem(storageKey) || undefined;
}

// Save API key based on provider
function saveApiKey(apiKey: string, apiProvider: string = 'openai'): void {
  const storageKey = apiProvider === 'openai' ? 'openai_api_key' : 'huggingface_api_key';
  localStorage.setItem(storageKey, apiKey);
  localStorage.setItem('api_provider', apiProvider);
}

// Script generation request function
export async function generateScript(requestConfig: ScriptGenerationRequest & { api_provider?: 'openai' | 'huggingface', api_key?: string }) {
  // Use the provided API provider or get from localStorage
  const apiProvider = requestConfig.api_provider || localStorage.getItem('api_provider') || 'openai';
  const apiKey = getApiKey(apiProvider, requestConfig.api_key);
  
  console.log("Sending script generation request:", {
    ...requestConfig,
    apiKey: apiKey ? "[REDACTED]" : undefined,
    apiProvider: apiProvider
  });
  
  // If a new API key is provided, save it for future use
  if (requestConfig.api_key) {
    saveApiKey(requestConfig.api_key, apiProvider);
  }
  
  // Use the fetchAPI helper function to make the request
  return fetchAPI('/scripts/generate', {
    method: 'POST',
    body: JSON.stringify({
      ...requestConfig,
      api_key: apiKey,
      api_provider: apiProvider
    }),
  });

}

//gerates a content plan based on the provided configuration
export async function generateContentPlan(config: ContentPlanConfig) {
  // Use the provided API provider or get from localStorage
  const apiProvider = config.api_provider || localStorage.getItem('api_provider') || 'openai';
  const apiKey = getApiKey(apiProvider, config.api_key);
  
  console.log("Sending content plan request with config:", {
    ...config,
    api_key: apiKey ? "[REDACTED]" : undefined,
    api_provider: apiProvider
  });
  
  // If a new API key is provided, save it for future use
  if (config.api_key) {
    saveApiKey(config.api_key, apiProvider);
  }
  
  return fetchAPI('/content/generate-plan', {
    method: 'POST',
    body: JSON.stringify({
      ...config,
      api_key: apiKey,
      api_provider: apiProvider
    }),
  });
}

//ecks the status of the API connection
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

//t all episodes
export async function getEpisodes() {
  return fetchAPI('/episodes');
}

//t a specific episode by ID
export async function getEpisode(episodeId: number) {
  return fetchAPI(`/episodes/${episodeId}`);
}

//t all content plans
export async function getContentPlans() {
  return fetchAPI('/content-plans');
}

//t a specific content plan by ID
export async function getContentPlan(planId: string) {
  return fetchAPI(`/content-plans/${planId}`);
}

//save content plan
export async function saveContentPlan(plan: any) {
  return fetchAPI('/content-plans', {
    method: 'POST',
    body: JSON.stringify(plan),
  });
}

// save scripts separately
export async function saveScript(scriptData: {
  contentPlanId: string;
  episodeIndex: number;
  script: string;
  episodeTitle: string;
}) {
  // Assuming your fetchAPI function is already set up for Hugging Face
  return fetchAPI('/scripts', {
    method: 'POST',
    body: JSON.stringify(scriptData),
  });
}


//Update a content plan
export async function updateContentPlan(planId: string, plan: any) {
  return fetchAPI(`/content-plans/${planId}`, {
    method: 'PUT',
    body: JSON.stringify(plan),
  });
}

//elete a content plan
export async function deleteContentPlan(planId: string) {
  return fetchAPI(`/content-plans/${planId}`, {
    method: 'DELETE',
  });
}
