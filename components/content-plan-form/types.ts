export type ApiProvider = 'huggingface' | 'openai';

export interface ContentPlanFormData {
  series_title: string;
  episodes: number;
  cat_name: string;
  content_style: string;
  description: string;
  setting: string;
  target_audience: string;
  additional_characters: string;
  api_key: string;
  api_provider: ApiProvider;
}

export interface ContentPlanFormProps {
  apiConnected: boolean | null;
  onPlanCreated?: (plan: any) => void;
}