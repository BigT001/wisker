"use client"

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
import ContentPlanForm from "@/components/content-plan-form"
import EpisodeGenerator from "@/components/episode-generator"
import StatusMonitor from "@/components/status-monitor"
import ApiStatus from "@/components/api-status"
import ContentPreview from "@/components/content-preview"; // You'll need to create this component

const Home = () => {
  const [apiConnected, setApiConnected] = useState<boolean | null>(true);

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

      <main className="px-20 mx-auto py-8">
        <div className="mt-4 grid grid-cols-4 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm col-span-1 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Server className="h-5 w-5" />
              <div className="flex justify-between w-full">
                <h2 className="text-xl font-bold">API Status</h2>
                <div className="flex items-center gap-2 border border-green-500 rounded-full px-2">
                  <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 text-sm">Connected</span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-2">Content Generation API</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm col-span-3 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Quick Actions</h2>
              </div>

              <div className="flex items-center gap-2 border border-green-500 rounded-full px-2">
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="text-green-600 text-sm">API Connected</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Generate content for your Mischievous Cat Shopper series
            </p>

            <div className="flex gap-4">
              <div className="relative group ">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md
                hover:bg-gray-800 transition-colors w-full"
                >
                  <Sparkles className="h-5 w-5 text-white" />
                  Generate Content Plan
                </button>
                <div className="absolute left-0 right-0 bottom-full mb-2 p-3 bg-white text-gray-700 text-sm rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  Create a new content plan with episode ideas
                  <div className="absolute left-1/2 -translate-x-1/2 top-full h-2 w-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
                </div>
              </div>

              <div className="relative group ">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-400 text-black rounded-md
                 hover:bg-purple-50 transition-colors w-full">
                  <Zap className="h-5 w-5 text-black" />
                  Run Full Pipeline (Episode 0)
                </button>
                <div className="absolute left-0 right-0 bottom-full mb-2 p-3 bg-white text-gray-700 text-sm rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  Generate script, images, voiceovers, and video for Episode 0
                  <div className="absolute left-1/2 -translate-x-1/2 top-full h-2 w-2 bg-white border-r border-b border-gray-200 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-12">
          <Tabs defaultValue="content-plan" className="w-full">
            <TabsList className="grid grid-cols-4 w-full bg-purple-200">
              <TabsTrigger value="content-plan" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content Plan
              </TabsTrigger>
              <TabsTrigger value="episode-generator" className="flex items-center gap-2">
                <Film className="h-4 w-4" />
                Episode Generator
              </TabsTrigger>
              <TabsTrigger value="status-monitor" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Status Monitor
              </TabsTrigger>
              <TabsTrigger value="content-preview" className="flex items-center gap-2">
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
