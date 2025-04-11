import { ReactNode } from "react";

export interface ContentPlan {
  id: string;
  series_concept: string;
  cat_name: string;
  content_style?: string;
  created_at: string;
  episodes: Episode[];
  cat_personality: {
    traits: string[];
    quirks: string[];
    catchphrases: string[];
  };
}

export interface Episode {
  title: string;
  description: string;
  keywords: string[];
  script?: string;
}

export interface ScriptGenerationRequest {
  episode: Episode;
  catName: string;
  contentStyle: string;
}

export interface ScriptGeneratorProps {
  // Allow both undefined and null for contentPlan
  contentPlan?: ContentPlan | null;
  // Allow both undefined and null for selectedContentPlan
  selectedContentPlan?: ContentPlan | null;
  apiConnected?: boolean;
  selectedEpisode?: number;
  onEpisodeSelect?: (episodeIndex: number) => void;
  onScriptGenerated?: (episodeIndex: number, script: string) => void;
  // Add the missing onContentPlanUpdated prop
  onContentPlanUpdated?: (updatedPlan: ContentPlan) => void;
  standalone?: boolean;
}

export interface ContentPlan {
  id: string;
  series_concept: string;
  cat_name: string;
  content_style?: string;
  created_at: string;
  episodes: Episode[];
  cat_personality: {
    traits: string[];
    quirks: string[];
    catchphrases: string[];
  };
}

export interface ScriptGeneratorProps {
  contentPlan?: ContentPlan | null;
  selectedContentPlan?: ContentPlan | null;
  apiConnected?: boolean;
  selectedEpisode?: number;
  onEpisodeSelect?: (episodeIndex: number) => void;
  onScriptGenerated?: (episodeIndex: number, script: string) => void;
  onContentPlanUpdated?: (updatedPlan: ContentPlan) => void;
  standalone?: boolean;
}