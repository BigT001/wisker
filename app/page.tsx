"use client";

import React, { useState } from "react";
import {
  Cat,
  Sparkles,
  Zap,
  Play,
  Film,
  FileText,
  Activity,
  Eye,
  Server,
  Pen,
  Image,
  FilmIcon,
  MedalIcon,
  Notebook,
  FolderOpen,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPlanForm from "@/components/content-plan-form";
import ScriptGenerator from "@/components/script-generator/script-generator";
import StatusMonitor from "@/components/status-monitor";
import ApiStatus from "@/components/api-status";
import QuickActions from "@/components/quick-actions";
import SavedContentPlans from "@/components/content-plan-form/saved-content-plans";
import { useRouter } from "next/navigation";
import { Toaster } from "@/components/ui/sonner"
import { toast } from "@/hooks/use-toast";
interface ContentPlan {
  id: string;
  series_concept: string;
  cat_name: string;
  content_style?: string;
  created_at: string;
  episodes: any[];
  cat_personality: {
    traits: string[];
    quirks: string[];
    catchphrases: string[];
  };
}

const Home = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(true);
  const [activeTab, setActiveTab] = useState("content-generator");
  const [selectedContentPlan, setSelectedContentPlan] =
    useState<ContentPlan | undefined>(undefined);

  // Define animations for QuickActions
  const animations = {
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
  };

  const handlePlanCreated = (plan: ContentPlan) => {
    setSelectedContentPlan(plan);
    // Save to localStorage as a backup
    try {
      localStorage.setItem("latest-content-plan", JSON.stringify(plan));
      toast({
        title: "Content Plan Created",
        description: "Your content plan has been created and saved locally.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving content plan to localStorage:", error);
    }
  };

  const handleSelectPlan = (plan: ContentPlan) => {
    setSelectedContentPlan(plan);
    // Save to localStorage as a backup
    try {
      localStorage.setItem("latest-content-plan", JSON.stringify(plan));
    } catch (error) {
      console.error("Error saving content plan to localStorage:", error);
    }
    // Switch to script generator tab when a plan is selected
    setActiveTab("script-generator");
  };

  // Handler for content plan updates from ScriptGenerator
  const handleContentPlanUpdated = (updatedPlan: ContentPlan) => {
    setSelectedContentPlan(updatedPlan);

    // Save to localStorage as a backup
    try {
      localStorage.setItem("latest-content-plan", JSON.stringify(updatedPlan));
      toast({
        title: "Content Plan Updated",
        description:
          "Your content plan has been updated with the generated scripts.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving content plan to localStorage:", error);
    }
  };

  // Handler for script generation
  const handleScriptGenerated = (episodeIndex: number, script: string) => {
    console.log(`Script generated for episode ${episodeIndex + 1}`);

    // Update the content plan with the new script
    if (selectedContentPlan && selectedContentPlan.episodes) {
      const updatedPlan = JSON.parse(JSON.stringify(selectedContentPlan));
      if (updatedPlan.episodes[episodeIndex]) {
        updatedPlan.episodes[episodeIndex].script = script;
        setSelectedContentPlan(updatedPlan);

        // Save to localStorage
        try {
          localStorage.setItem(
            "latest-content-plan",
            JSON.stringify(updatedPlan)
          );
        } catch (error) {
          console.error(
            "Error saving updated content plan to localStorage:",
            error
          );
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <header className="pt-16 pb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">🐱</span>
          <h1 className="text-5xl font-extrabold text-purple-700 font-serif tracking-tight">
            Whisker
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-md mx-auto font-light">
          AI-powered content generation platform for the Mischievous Cat series
        </p>
      </header>
      <main className="px-20 mx-auto py-8 ">
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-1">
            <div className="h-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ApiStatus setApiConnected={setApiConnected} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-3">
            <div className="h-full">
              <QuickActions
                apiConnected={apiConnected}
                setApiConnected={setApiConnected}
                setActiveTab={setActiveTab}
                animations={animations}
              />
            </div>
          </div>
        </div>
        <section className="mt-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 w-full bg-purple-200">
              <TabsTrigger
                value="content-generator"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Content Generator
              </TabsTrigger>
              <TabsTrigger
                value="saved-plans"
                className="flex items-center gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                Saved Plans
              </TabsTrigger>

              <TabsTrigger
                value="script-generator"
                className="flex items-center gap-2"
              >
                <Notebook className="h-4 w-4" />
                Script Generator
              </TabsTrigger>

              <TabsTrigger
                value="imageGenerator"
                className="flex items-center gap-2"
              >
                <Image className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger
                value="videoGenerator"
                className="flex items-center gap-2"
              >
                <FilmIcon className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="schedulePost"
                className="flex items-center gap-2"
              >
                <MedalIcon className="h-4 w-4" />
                Schedule Post
              </TabsTrigger>
            </TabsList>
            {/* Add TabsContent components for each tab */}
            <TabsContent value="content-generator" className="mt-6">
              <ContentPlanForm
                apiConnected={apiConnected}
                onPlanCreated={handlePlanCreated}
              />
            </TabsContent>
            <TabsContent value="script-generator" className="mt-6">
              <ScriptGenerator
                contentPlan={selectedContentPlan}
                apiConnected={apiConnected}
                onScriptGenerated={handleScriptGenerated}
              />
            </TabsContent>
            <TabsContent value="saved-plans" className="mt-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <SavedContentPlans onSelectPlan={handleSelectPlan} />
              </div>
            </TabsContent>
            <TabsContent value="imageGenerator" className="mt-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Image Generator</h2>
                <p>Image generation feature coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="videoGenerator" className="mt-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Video Generator</h2>
                <p>Video generation feature coming soon...</p>
              </div>
            </TabsContent>
            <TabsContent value="schedulePost" className="mt-6">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Schedule Post</h2>
                <p>Post scheduling feature coming soon...</p>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Display selected content plan information (optional) */}
        {selectedContentPlan && (
          <section className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-purple-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-purple-700">
                Selected Content Plan
              </h2>
              <button
                onClick={() => setActiveTab("script-generator")}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md flex items-center gap-2 text-sm transition-colors"
              >
                <Notebook className="h-4 w-4" />
                Generate Scripts
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Series Concept
                </p>
                <p className="text-lg">{selectedContentPlan.series_concept}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Cat Name</p>
                <p className="text-lg">{selectedContentPlan.cat_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Episodes</p>
                <p className="text-lg">
                  {selectedContentPlan.episodes.length} episodes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-lg">
                  {new Date(
                    selectedContentPlan.created_at
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};export default Home;
