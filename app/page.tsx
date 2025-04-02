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
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentPlanForm from "@/components/content-plan-form";
import EpisodeGenerator from "@/components/episode-generator";
import StatusMonitor from "@/components/status-monitor";
import ApiStatus from "@/components/api-status";
import ContentPreview from "@/components/content-preview"; // You'll need to create this component
import QuickActions from "@/components/quick-actions"; // Add this import

const Home = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(true);
  const [activeTab, setActiveTab] = useState("content-plan"); // Add this state for tab control

  // Define animations for QuickActions
  const animations = {
    item: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
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
            <TabsList className="grid grid-cols-4 w-full bg-purple-200">
              <TabsTrigger
                value="content-plan"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Content Plan
              </TabsTrigger>
              <TabsTrigger
                value="episode-generator"
                className="flex items-center gap-2"
              >
                <Film className="h-4 w-4" />
                Episode Generator
              </TabsTrigger>
              <TabsTrigger
                value="status-monitor"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Status Monitor
              </TabsTrigger>
              <TabsTrigger
                value="content-preview"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Content Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content-plan">
              <ContentPlanForm apiConnected={apiConnected} />
            </TabsContent>

            <TabsContent value="episode-generator">
              <EpisodeGenerator apiConnected={apiConnected} />
            </TabsContent>

            <TabsContent value="status-monitor">
              <StatusMonitor />
            </TabsContent>

            <TabsContent value="content-preview">
              <ContentPreview />
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default Home;
