"use client";
import { ReactNode } from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScriptGenerationRequest, Episode } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generateScript, saveContentPlan } from "@/lib/api";

// Import sub-components
import EpisodeSelector from "./episode-selector";
import ProgressTracker from "./progress-tracker";
import ScriptStatus from "./script-status";
import EpisodeDetails from "./episode-details";
import ScriptViewer from "./script-viewer";
import { ScriptGeneratorProps } from "./types";

export default function ScriptGenerator({
  contentPlan,
  onScriptGenerated,
  onEpisodeSelect,
  onContentPlanUpdated,
  selectedEpisode = 0,
  standalone = false,
  apiConnected = true,
  selectedContentPlan,
}: ScriptGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<string>("");
  const [localSelectedEpisode, setLocalSelectedEpisode] = useState(selectedEpisode);
  const [savedScripts, setSavedScripts] = useState<Record<number, string>>({});
  const [generatingAll, setGeneratingAll] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const { toast } = useToast();

  
  

  // Use either the controlled selectedEpisode or the local state
  const currentEpisodeIndex = onEpisodeSelect
    ? selectedEpisode
    : localSelectedEpisode;
  const effectiveContentPlan = contentPlan || selectedContentPlan;

  // Load any saved scripts from the content plan
  useEffect(() => {
    if (!effectiveContentPlan || !effectiveContentPlan.episodes) {
      return; // Exit early if content plan is not available
    }
    
    // First, load scripts from the content plan (for backward compatibility)
    const scriptsFromContentPlan: Record<number, string> = {};
    effectiveContentPlan.episodes.forEach((episode: any, index: number) => {
      if (episode.script) {
        scriptsFromContentPlan[index] = episode.script;
      }
    });
    
    // Then check localStorage for any saved scripts
    const contentPlanId = effectiveContentPlan.id || "temp-plan";
    const scriptsFromStorage: Record<number, string> = {};
    
    try {
      for (let i = 0; i < effectiveContentPlan.episodes.length; i++) {
        const scriptKey = `script-${contentPlanId}-episode-${i}`;
        const savedScript = localStorage.getItem(scriptKey);
        if (savedScript) {
          scriptsFromStorage[i] = savedScript;
        }
      }
    } catch (error) {
      console.error("Error loading scripts from localStorage:", error);
    }
    
    // Merge scripts, prioritizing localStorage versions
    const mergedScripts = {
      ...scriptsFromContentPlan,
      ...scriptsFromStorage,
    };
    
    // Set the merged scripts
    setSavedScripts(mergedScripts);
    
    // If there's a script for the current episode, load it
    if (mergedScripts[currentEpisodeIndex]) {
      setScript(mergedScripts[currentEpisodeIndex]);
      setActiveTab("script");
    } else {
      setScript("");
      setActiveTab("details");
    }
    
    // Log the number of scripts loaded for debugging
    const scriptCount = Object.keys(mergedScripts).length;
    if (scriptCount > 0) {
      console.log(`Loaded ${scriptCount} scripts for content plan: ${effectiveContentPlan.series_concept}`);
    }
  }, [effectiveContentPlan, currentEpisodeIndex]);
  

  const handleEpisodeChange = (episodeIndex: number) => {
    if (onEpisodeSelect) {
      onEpisodeSelect(episodeIndex);
    } else {
      setLocalSelectedEpisode(episodeIndex);
    }

    // If there's a saved script for this episode, load it
    if (savedScripts[episodeIndex]) {
      setScript(savedScripts[episodeIndex]);
      setActiveTab("script");
    } else {
      setScript("");
      setActiveTab("details");
    }
  };

  const generateScriptForEpisode = async (episodeIndex: number) => {
    // Check if effectiveContentPlan is defined
    if (!effectiveContentPlan) {
      throw new Error("Content plan is not available");
    }
  
    try {
      // Check if episodes array and the specific episode exist
      if (!effectiveContentPlan.episodes || !effectiveContentPlan.episodes[episodeIndex]) {
        throw new Error(`Episode ${episodeIndex + 1} not found in content plan`);
      }
  
      const episode = effectiveContentPlan.episodes[episodeIndex];
      
      // Create the request object with the correct structure
      const requestConfig: ScriptGenerationRequest = {
        episode: episode,
        catName: effectiveContentPlan.cat_name || 'Whiskers',
        contentStyle: effectiveContentPlan.content_style || 'humorous, family-friendly'
      };
      
      const data = await generateScript(requestConfig);
      const generatedScript = data.script;
      
      // Update saved scripts locally
      setSavedScripts(prev => ({
        ...prev,
        [episodeIndex]: generatedScript
      }));
      
      // If this is the currently selected episode, update the script display
      if (episodeIndex === currentEpisodeIndex) {
        setScript(generatedScript);
        setActiveTab('script');
      }
      
      // Call the callback if provided
      if (onScriptGenerated) {
        onScriptGenerated(episodeIndex, generatedScript);
      }
      
      try {
        // Save the script - but don't let failures here stop the process
        await saveScriptForEpisode(episodeIndex, generatedScript);
      } catch (saveError) {
        console.error('Error saving script:', saveError);
        // Continue anyway - we've already updated the local state
      }
      
      return generatedScript;
    } catch (error) {
      console.error(`Error generating script for episode ${episodeIndex}:`, error);
      throw error;
    }
  };
  
  const saveScriptForEpisode = async (episodeIndex: number, scriptContent: string) => {
    // Check if effectiveContentPlan is defined
    if (!effectiveContentPlan) {
      throw new Error("Content plan is not available");
    }
  
    try {
      // Get the content plan ID
      const contentPlanId = effectiveContentPlan.id || 'temp-plan';
      
      // Check if episodes array and the specific episode exist
      if (!effectiveContentPlan.episodes || !effectiveContentPlan.episodes[episodeIndex]) {
        throw new Error(`Episode ${episodeIndex + 1} not found in content plan`);
      }
      
      const episodeTitle = effectiveContentPlan.episodes[episodeIndex].title || `Episode ${episodeIndex + 1}`;
      
      // Create the script data object
      const scriptData = {
        contentPlanId,
        episodeIndex,
        script: scriptContent,
        episodeTitle
      };
      
      console.log('Saving script:', scriptData);
      
      // Save to localStorage for persistence
      const scriptKey = `script-${contentPlanId}-episode-${episodeIndex}`;
      localStorage.setItem(scriptKey, scriptContent);
      
      // Update the local state with the new script
      // This is a workaround for not being able to save to the API
      if (effectiveContentPlan && effectiveContentPlan.episodes) {
        // Create a deep copy to avoid reference issues
        const updatedEpisodes = [...effectiveContentPlan.episodes];
        
        // Update the script in the episode
        updatedEpisodes[episodeIndex] = {
          ...updatedEpisodes[episodeIndex],
          script: scriptContent
        };
        
        // If you have a callback to update the parent component, use it
        // if (onContentPlanUpdated) {
        //   onContentPlanUpdated({
        //     ...effectiveContentPlan,
        //     episodes: updatedEpisodes
        //   });
        // }
      }
      
      // Skip the API call that's failing
      // await saveContentPlan(updatedPlan);
      
      return true;
    } catch (error) {
      console.error('Error saving script:', error);
      
      // Still try to save to localStorage as a fallback
      try {
        const contentPlanId = effectiveContentPlan.id || 'temp-plan';
        const scriptKey = `script-${contentPlanId}-episode-${episodeIndex}`;
        localStorage.setItem(scriptKey, scriptContent);
        console.log('Fallback: Saved script to localStorage');
        return true;
      } catch (localStorageError) {
        console.error('Error saving to localStorage:', localStorageError);
        return false;
      }
    }
  };
  
  const handleSaveScript = async () => {
    if (!effectiveContentPlan) {
      toast({
        title: "Error",
        description: "Content plan is not available",
        variant: "destructive",
      });
      return;
    }

    if (!script) {
      toast({
        title: "Error",
        description: "No script to save",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Save the script for the current episode
      const success = await saveScriptForEpisode(currentEpisodeIndex, script);

      if (success) {
        toast({
          title: "Success",
          description: "Script saved successfully",
          variant: "success",
        });
        // Update the saved scripts state
        setSavedScripts((prev) => ({
          ...prev,
          [currentEpisodeIndex]: script,
        }));
        // Update parent component with the saved script
    updateParentWithAllScripts();
  
        
      } else {
        toast({
          title: "Error",
          description: "Failed to save script",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving script:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the script",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateScript = async () => {
    setLoading(true);
    try {
      await generateScriptForEpisode(currentEpisodeIndex);
      toast({
        title: "Script Generated & Saved",
        description: `Script for Episode ${currentEpisodeIndex + 1}: ${
          effectiveContentPlan?.episodes?.[currentEpisodeIndex]?.title ||
          "Unknown Title"
        } created and saved successfully`,
        variant: "success",
      });
      
      // Update parent component with the generated script
      updateParentWithAllScripts();
    } catch (error) {
      // Error handling code...
    } finally {
      setLoading(false);
    }
  };
  ;

  const handleGenerateAllScripts = async () => {
    if (!effectiveContentPlan || !effectiveContentPlan.episodes || effectiveContentPlan.episodes.length === 0) {
      toast({
        title: "Error",
        description: "No episodes found in the content plan",
        variant: "destructive"
      });
      return;
    }
  
    setGeneratingAll(true);
    setGenerationProgress(0);
    
    const totalEpisodes = effectiveContentPlan.episodes.length;
    let successCount = 0;
    let failCount = 0;
    
    // Show initial toast
    toast({
      title: "Generating Scripts",
      description: `Starting generation for ${totalEpisodes} episodes...`,
      variant: "default"
    });
    
    // Generate scripts for each episode sequentially
    for (let i = 0; i < totalEpisodes; i++) {
      try {
        // Update progress
        setGenerationProgress(Math.round((i / totalEpisodes) * 100));
        
        // Generate script for this episode
        const generatedScript = await generateScriptForEpisode(i);
        
        // Save to localStorage directly as a backup
        try {
          const contentPlanId = effectiveContentPlan.id || 'temp-plan';
          const scriptKey = `script-${contentPlanId}-episode-${i}`;
          localStorage.setItem(scriptKey, generatedScript);
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
        }
        
        successCount++;
        
        // Update progress toast every few episodes
        if (i % 3 === 0 || i === totalEpisodes - 1) {
          toast({
            title: "Generating Scripts",
            description: `Progress: ${i + 1}/${totalEpisodes} episodes completed`,
            variant: "default"
          });
        }
      } catch (error) {
        failCount++;
        console.error(`Error generating script for episode ${i}:`, error);
        toast({
          title: "Error",
          description: `Failed to generate script for Episode ${i + 1}: ${effectiveContentPlan.episodes[i]?.title || `Episode ${i + 1}`}`,
          variant: "destructive"
        });
      }
      
      // Small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Final progress update
    setGenerationProgress(100);
    
    // Final toast
    toast({
      title: "Generation Complete",
      description: `Successfully generated ${successCount} scripts. ${failCount > 0 ? `Failed: ${failCount}.` : ''} All scripts have been saved to localStorage.`,
      variant: successCount > 0 ? "success" : "destructive"
    });
    
    setGeneratingAll(false);
  };
  

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script);
    toast({
      title: "Copied",
      description: "Script copied to clipboard",
      variant: "default",
    });
  };

  // Add this function to update the parent component with all scripts
  const updateParentWithAllScripts = () => {
    if (!effectiveContentPlan || !effectiveContentPlan.episodes) {
      return;
    }
    
    if (!onContentPlanUpdated) {
      return; // No callback provided
    }
  
  // Create a deep copy of the content plan
  const updatedPlan = JSON.parse(JSON.stringify(effectiveContentPlan));
    
  // Update each episode with its script from savedScripts
  Object.entries(savedScripts).forEach(([indexStr, script]) => {
    const index = parseInt(indexStr, 10);
    if (!isNaN(index) && updatedPlan.episodes[index]) {
      updatedPlan.episodes[index].script = script;
    }
  });
  
  // Call the callback to update the parent
  onContentPlanUpdated(updatedPlan);
};

  // Add this function to load scripts
  const loadSavedScripts = async () => {
    if (!effectiveContentPlan || !effectiveContentPlan.id) return;

    const contentPlanId = effectiveContentPlan.id;
    const scripts: Record<number, string> = {};

    // Try to load scripts from API first
    try {
      const response = await fetch(
        `/api/scripts?contentPlanId=${contentPlanId}`
      );
      if (response.ok) {
        const data = await response.json();
        data.forEach((scriptItem: any) => {
          scripts[scriptItem.episodeIndex] = scriptItem.script;
        });
      }
    } catch (apiError) {
      console.error("Error loading scripts from API:", apiError);
    }

    // Also check localStorage for any scripts
    try {
      for (let i = 0; i < effectiveContentPlan.episodes.length; i++) {
        const scriptKey = `script-${contentPlanId}-episode-${i}`;
        const savedScript = localStorage.getItem(scriptKey);
        if (savedScript && !scripts[i]) {
          scripts[i] = savedScript;
        }
      }
    } catch (localStorageError) {
      console.error(
        "Error loading scripts from localStorage:",
        localStorageError
      );
    }

    // Update the saved scripts state
    setSavedScripts(scripts);

    // If there's a script for the current episode, load it
    if (scripts[currentEpisodeIndex]) {
      setScript(scripts[currentEpisodeIndex]);
      setActiveTab("script");
    }
  };

  if (!apiConnected) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            API is not connected. Please check your connection.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!effectiveContentPlan) {
    return (
      <Card className="shadow-lg border-muted">
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">
            Please select or generate a content plan first
          </p>
        </CardContent>
      </Card>
    );
  }

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <EpisodeSelector
          episodes={effectiveContentPlan.episodes}
          currentEpisodeIndex={currentEpisodeIndex}
          savedScripts={savedScripts}
          onEpisodeChange={handleEpisodeChange}
          disabled={loading || generatingAll}
        />

        <Button
          onClick={handleGenerateAllScripts}
          disabled={loading || generatingAll || saving}
          variant="secondary"
          className="gap-2 whitespace-nowrap shadow-sm hover:shadow-md transition-all"
        >
          {generatingAll ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating All...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-1" />
              Generate All Scripts
            </>
          )}
        </Button>
      </div>

      <ProgressTracker
        progress={generationProgress}
        isGenerating={generatingAll}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger
            value="details"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Episode Details
          </TabsTrigger>
          <TabsTrigger
            value="script"
            disabled={!script}
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Script
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <EpisodeDetails
            episode={effectiveContentPlan.episodes[currentEpisodeIndex]}
            episodeIndex={currentEpisodeIndex}
            hasScript={Boolean(savedScripts[currentEpisodeIndex])}
            onGenerateScript={handleGenerateScript}
            onViewScript={() => setActiveTab("script")}
            isGenerating={loading}
            isSaving={saving}
          />

          <ScriptStatus
            completedCount={Object.keys(savedScripts).length}
            totalCount={effectiveContentPlan.episodes.length}
          />
        </TabsContent>

        <TabsContent value="script" className="space-y-4">
          <ScriptViewer
            script={script}
            episodeTitle={
              effectiveContentPlan.episodes[currentEpisodeIndex].title
            }
            episodeIndex={currentEpisodeIndex}
            onCopy={handleCopyScript}
            onDownload={handleSaveScript}
            onBackToDetails={() => setActiveTab("details")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );

  // If standalone, wrap in a card
  if (standalone) {
    return (
      <Card className="shadow-lg border-muted overflow-hidden">
        <CardHeader className="bg-muted/30">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Script Generator</CardTitle>
              <CardDescription>
                Generate scripts for "{effectiveContentPlan.series_concept}"
              </CardDescription>
            </div>
            {saving && (
              <Badge variant="outline" className="bg-background animate-pulse">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Saving...
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-6">{content}</CardContent>
        <CardFooter className="bg-muted/10 border-t p-4 flex justify-between">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Cat Character:</span>{" "}
            {effectiveContentPlan.cat_name || "Whiskers"}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Style:</span>{" "}
            {effectiveContentPlan.content_style || "humorous, family-friendly"}
          </div>
        </CardFooter>
      </Card>
    );
  }

  // Otherwise, just return the content
  return content;
}
