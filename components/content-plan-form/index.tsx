"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateContentPlan } from "@/lib/api";

import { FormHeader } from "./formHeader";
import { FormFields } from "./formFields";
import { ApiProviderSection } from "./apiProviderSection";
import { SubmitButton } from "./submitButton";
import { ContentPlanResult } from "./contentPlanResult";
import { ContentPlanFormData, ContentPlanFormProps, ApiProvider } from "./types";

export default function ContentPlanForm({
  apiConnected,
}: ContentPlanFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [contentPlan, setContentPlan] = useState<any>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState<ContentPlanFormData>({
    series_title: "Fat Cat Shopper",
    episodes: 10,
    cat_name: "Whiskers",
    content_style: "humorous, tricky",
    description: "",
    setting: "",
    target_audience: "",
    additional_characters: "",
    api_key: "",
    api_provider: "huggingface",
  });

  // Load API provider from localStorage on component mount
  useEffect(() => {
    const savedProvider = localStorage.getItem("api_provider");
    const savedApiKey = localStorage.getItem(
      savedProvider === "openai" ? "openai_api_key" : "huggingface_api_key"
    );

    if (savedProvider) {
      setFormData((prev) => ({
        ...prev,
        api_provider: savedProvider as ApiProvider,
        api_key: savedApiKey || "",
      }));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'api_provider') {
      setFormData((prev) => ({
        ...prev,
        api_provider: (value === 'huggingface' || value === 'openai') 
          ? value as ApiProvider
          : prev.api_provider,
        api_key: '', // Clear the API key when switching providers
      }));
      
      localStorage.setItem('api_provider', value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'episodes' ? parseInt(value) : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please check your API connection and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      toast({
        title: "Generating content plan",
        description: "This may take a few moments...",
      });

      const apiKey =
        formData.api_key || 
        (formData.api_provider === 'openai' 
          ? localStorage.getItem("openai_api_key") 
          : localStorage.getItem("huggingface_api_key")) || 
        undefined;

      if (!apiKey) {
        throw new Error(
          `${formData.api_provider === 'openai' ? 'OpenAI' : 'Hugging Face'} API key is required.`
        );
      }

      if (formData.api_provider === 'openai' && !apiKey.startsWith('sk-')) {
        throw new Error(
          "Invalid OpenAI API key format. API keys should start with 'sk-'"
        );
      }

      if (formData.api_key) {
        localStorage.setItem(
          formData.api_provider === 'openai' 
            ? "openai_api_key" 
            : "huggingface_api_key", 
          formData.api_key
        );
      }

      const config = {
        series_title: formData.series_title,
        num_episodes: formData.episodes,
        cat_name: formData.cat_name,
        content_style: formData.content_style || formData.description,
        theme: formData.content_style || formData.description,
        setting: formData.setting,
        target_audience: formData.target_audience,
        additional_characters: formData.additional_characters,
        api_key: apiKey,
        api_provider: formData.api_provider,
      };

      const data = await generateContentPlan(config);
      setContentPlan(data);

      toast({
        title: "Success!",
        description: "Content plan generated successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Error generating content plan:", error);

      let errorMessage = "Failed to generate content plan. Please try again.";

      if (error instanceof Error) {
        if (
          error.message.includes("invalid_api_key") ||
          error.message.includes("Incorrect API key")
        ) {
          errorMessage =
            `Invalid ${formData.api_provider === 'openai' ? 'OpenAI' : 'Hugging Face'} API key. Please check your API key and try again.`;
        } else if (error.message.includes("API key is required")) {
          errorMessage =
            `${formData.api_provider === 'openai' ? 'OpenAI' : 'Hugging Face'} API key is required. Please enter a valid API key.`;
        } else {
          errorMessage = error.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <FormHeader />
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <FormFields 
              formData={formData}
              handleChange={handleChange}
            />
            <ApiProviderSection 
              apiProvider={formData.api_provider}
              apiKey={formData.api_key}
              onProviderChange={(provider) => {
                setFormData(prev => ({
                  ...prev,
                  api_provider: provider,
                  api_key: ''
                }));
              }}
              onApiKeyChange={(key) => {
                setFormData(prev => ({
                  ...prev,
                  api_key: key
                }));
              }}
            />
          </CardContent>
          <CardFooter className="flex justify-end">
            <SubmitButton 
              isLoading={isLoading} 
              apiConnected={apiConnected} 
            />
          </CardFooter>
        </form>
      </Card>
      {contentPlan && (
        <ContentPlanResult 
          contentPlan={contentPlan} 
        />
      )}
    </div>
  );
}
