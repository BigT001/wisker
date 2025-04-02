"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ApiStatus from "@/components/api-status"
import { useToast } from "@/hooks/use-toast"
import { generateContentPlan, runFullPipeline } from "@/lib/api"

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
  const { toast } = useToast()

  const handleGenerateContentPlan = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Using preview mode. In a real app, this would connect to the Python backend.",
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
        theme: "Mischievous Cat Shopper"
      }
      await generateContentPlan(config)
      
      toast({
        title: "Success!",
        description: "Content plan generated successfully",
        variant: "success",
      })
      
      // Switch to content plan tab
      setActiveTab("content-plan")
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to generate content plan",
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
        description: "Using preview mode. In a real app, this would connect to the Python backend.",
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
    } catch (_) {
      toast({
        title: "Error",
        description: "Failed to start pipeline",
        variant: "destructive",
      })
    } finally {
      setIsRunningPipeline(false)
    }
  }

  return (
    <motion.div
      variants={animations.item}
      className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
    >
      <ApiStatus setApiConnected={setApiConnected} />

      <Card className="col-span-1 md:col-span-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="icon-container">
                <Sparkles className="text-primary" size={18} />
              </div>
              <CardTitle>Quick Actions</CardTitle>
            </div>
            {apiConnected && (
              <Badge className="badge badge-success">
                <div className="status-indicator status-indicator-success status-indicator-pulse mr-1.5"></div>
                API Connected
              </Badge>
            )}
          </div>
          <CardDescription className="mt-2">
            Generate content for your Mischievous Cat Shopper series
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    className="btn btn-default"
                    onClick={handleGenerateContentPlan}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <Sparkles className="animate-spin" size={16} />
                        <span>Generating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} />
                        <span>Generate Content Plan</span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip">
                  <p>Create a new content plan with episode ideas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="btn btn-outline"
                    onClick={handleRunFullPipeline}
                    disabled={isRunningPipeline}
                  >
                    {isRunningPipeline ? (
                      <div className="flex items-center gap-2">
                        <Zap className="animate-pulse text-amber-500" size={16} />
                        <span>Running...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Zap className="text-amber-500" size={16} />
                        <span>Run Full Pipeline (Episode 0)</span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="tooltip">
                  <p>
                    Generate script, images, voiceovers, and video for Episode 0
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="status-indicator status-indicator-success mr-1.5"></div>
                <span>Script Generation</span>
              </div>
              <div className="flex items-center">
                <div className="status-indicator bg-blue-500 mr-1.5"></div>
                <span>Image Creation</span>
              </div>
              <div className="flex items-center">
                <div className="status-indicator bg-purple-500 mr-1.5"></div>
                <span>Video Rendering</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
