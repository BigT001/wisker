"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Zap, FileText, Image, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { generateContentPlan, runFullPipeline, checkApiStatus } from "@/lib/api"

interface QuickActionsProps {
  apiConnected: boolean | null
  setApiConnected: (connected: boolean) => void
  setActiveTab: (tab: string) => void
  animations: {
    item: {
      hidden: { y: number; opacity: number }
      visible: { y: number; opacity: number }
    }
  }
}

export default function QuickActions({
  apiConnected,
  setApiConnected,
  setActiveTab,
  animations
}: QuickActionsProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRunningPipeline, setIsRunningPipeline] = useState(false)
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false)
  const { toast } = useToast()

  const handleGenerateContentPlan = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please check your API connection and try again.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    toast({
      title: "Starting content plan generation",
      description: "This may take a few moments...",
    })

    try {
      const config = {
        num_episodes: 5,
        theme: "Mischievous Cat Shopper",
        title: "Adventures of Whisker",
        description: "Follow Whisker the cat on shopping adventures"
      }
      await generateContentPlan(config)
     
      toast({
        title: "Success!",
        description: "Content plan generated successfully",
        variant: "success",
      })
     
      // Switch to content plan tab
      setActiveTab("content-plan")
    } catch (error) {
      console.error("Content plan generation failed:", error);
      toast({
        title: "Error",
        description: "Failed to generate content plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRunFullPipeline = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please check your API connection and try again.",
        variant: "destructive",
      })
      return
    }

    setIsRunningPipeline(true)
    toast({
      title: "Starting full pipeline",
      description: "This will generate all content for episode 0",
    })

    try {
      await runFullPipeline(0)
     
      toast({
        title: "Pipeline started!",
        description: "Check the Status Monitor for progress",
        variant: "success",
      })
     
      // Switch to status tab
      setActiveTab("status")
    } catch (error) {
      console.error("Pipeline execution failed:", error);
      toast({
        title: "Error",
        description: "Failed to start pipeline. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRunningPipeline(false)
    }
  }

  const refreshApiStatus = async () => {
    setIsRefreshingStatus(true);
    try {
      const status = await checkApiStatus();
      setApiConnected(status);
      
      toast({
        title: status ? "API Connected" : "API Disconnected",
        description: status 
          ? "Successfully connected to the content generation API" 
          : "Could not connect to the API. Some features may be limited.",
        variant: status ? "success" : "destructive",
      });
    } catch (error) {
      console.error("API status check failed:", error);
      setApiConnected(false);
      
      toast({
        title: "Connection Error",
        description: "Failed to check API status. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshingStatus(false);
    }
  };

  return (
    <motion.div
      variants={animations.item}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
    >
      <Card className="md:col-span-4 w-full h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Sparkles className="text-primary" size={18} />
              </div>
              <CardTitle>Quick Actions</CardTitle>
            </div>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {apiConnected === null ? (
                <Badge variant="outline" className="bg-gray-100 text-gray-700">
                  <div className="h-2 w-2 rounded-full bg-gray-400 mr-1.5"></div>
                  Checking API...
                </Badge>
              ) : apiConnected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                  API Connected
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <div className="h-2 w-2 rounded-full bg-red-500 mr-1.5"></div>
                  API Disconnected
                </Badge>
              )}
            </motion.div>
          </div>
          <CardDescription className="">
            Generate content for your Mischievous Cat Shopper series with AI-powered tools
          </CardDescription>
        </CardHeader>
       
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="relative overflow-hidden bg-black text-white"
                    onClick={handleGenerateContentPlan}
                    disabled={isGenerating || !apiConnected}
                  >
                    {isGenerating && (
                      <motion.div 
                        className="absolute inset-0 bg-primary/20"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2, ease: "linear" }}
                      />
                    )}
                    <div className="flex items-center gap-2 relative z-10 ">
                      <Sparkles className={isGenerating ? "animate-spin" : ""} size={16} />
                      <span>{isGenerating ? "Generating..." : "Generate Content Plan"}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="bg-white rounded-md px-3 py-2">
                      Create a new content plan with episode ideas for your series</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="relative overflow-hidden"
                    onClick={handleRunFullPipeline}
                    disabled={isRunningPipeline || !apiConnected}
                  >
                    {isRunningPipeline && (
                      <motion.div 
                        className="absolute inset-0 bg-amber-500/10"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                      />
                    )}
                    <div className="flex items-center gap-2 relative z-10">
                      <Zap className={isRunningPipeline ? "animate-pulse text-amber-500" : "text-amber-500"} size={16} />
                      <span>{isRunningPipeline ? "Running Pipeline..." : "Run Full Pipeline (Episode 0)"}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                <p className="bg-white rounded-md px-3 py-2">

                    Generate script, images, voiceovers, and video for Episode 0
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {!apiConnected && apiConnected !== null && (
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="ml-auto"
                      onClick={refreshApiStatus}
                      disabled={isRefreshingStatus}
                    >
                      <motion.div
                        animate={{ rotate: isRefreshingStatus ? 360 : 0 }}
                        transition={{ duration: 1, repeat: isRefreshingStatus ? Infinity : 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                          <path d="M21 3v5h-5"></path>
                          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                          <path d="M3 21v-5h5"></path>
                        </svg>
                      </motion.div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh API connection status</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
         
          {/* <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
                <span className="flex items-center gap-1">
                  <FileText size={14} />
                  Script Generation
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-1.5"></div>
                <span className="flex items-center gap-1">
                  <Image size={14} />
                  Image Creation
                </span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-1.5"></div>
                <span className="flex items-center gap-1">
                  <Video size={14} />
                  Video Rendering
                </span>
              </div>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </motion.div>
  )
}
