"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import ContentPlanForm from "@/components/content-plan-form"
import EpisodeGenerator from "@/components/episode-generator"
import StatusMonitor from "@/components/status-monitor"
import ApiStatus from "@/components/api-status"

export default function Dashboard() {
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const { toast } = useToast()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-center">Mischievous Cat Shopper</h1>
      <p className="text-center text-muted-foreground mb-8">
        AI-powered content generation platform for the Mischievous Cat Shopper series
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <ApiStatus setApiConnected={setApiConnected} />

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Generate content for your Mischievous Cat Shopper series</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (!apiConnected) {
                  toast({
                    title: "API not connected",
                    description: "Using preview mode. In a real app, this would connect to the Python backend.",
                  })
                  return
                }
                toast({
                  title: "Starting content plan generation",
                  description: "This may take a few moments...",
                })
              }}
            >
              Generate Content Plan
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                if (!apiConnected) {
                  toast({
                    title: "API not connected",
                    description: "Using preview mode. In a real app, this would connect to the Python backend.",
                  })
                  return
                }
                toast({
                  title: "Starting full pipeline",
                  description: "This will generate all content for episode 0",
                })
              }}
            >
              Run Full Pipeline (Episode 0)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="content-plan" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="content-plan">Content Plan</TabsTrigger>
          <TabsTrigger value="episode-generator">Episode Generator</TabsTrigger>
          <TabsTrigger value="status">Status Monitor</TabsTrigger>
          <TabsTrigger value="preview">Content Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="content-plan">
          <ContentPlanForm apiConnected={apiConnected} />
        </TabsContent>

        <TabsContent value="episode-generator">
          <EpisodeGenerator apiConnected={apiConnected} />
        </TabsContent>

        <TabsContent value="status">
          <StatusMonitor />
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Content Preview</CardTitle>
              <CardDescription>Preview generated content for your episodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-muted-foreground">Select an episode to preview its content</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

