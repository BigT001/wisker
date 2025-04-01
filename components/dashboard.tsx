'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ContentGenerator from '@/components/content-generator'
import ScriptGenerator from '@/components/script-generator'
import VisualGenerator from '@/components/visual-generator'
import VoiceoverGenerator from '@/components/voiceover-generator'
import VideoGenerator from '@/components/video-generator'
import SocialMediaPlanner from '@/components/social-media-planner'
import Header from '@/components/header'
import { useToast } from '@/hooks/use-toast'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('content')
  const [contentPlan, setContentPlan] = useState<any>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<number>(0)
  const [scripts, setScripts] = useState<Record<number, string>>({})
  const [visualPrompts, setVisualPrompts] = useState<Record<number, any>>({})
  const { toast } = useToast()

  const handleContentGenerated = (data: any) => {
    setContentPlan(data)
    toast({
      title: 'Content plan generated',
      description: `Created plan for ${data.episodes.length} episodes`,
    })
  }

  const handleScriptGenerated = (episodeIndex: number, script: string) => {
    setScripts(prev => ({ ...prev, [episodeIndex]: script }))
    toast({
      title: 'Script generated',
      description: `Created script for episode ${episodeIndex + 1}`,
    })
  }

  const handleVisualPromptsGenerated = (episodeIndex: number, prompts: any) => {
    setVisualPrompts(prev => ({ ...prev, [episodeIndex]: prompts }))
    toast({
      title: 'Visual prompts generated',
      description: `Created visual prompts for episode ${episodeIndex + 1}`,
    })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="script" disabled={!contentPlan}>Script</TabsTrigger>
            <TabsTrigger value="visual" disabled={!scripts[selectedEpisode]}>Visual</TabsTrigger>
            <TabsTrigger value="voiceover" disabled={!visualPrompts[selectedEpisode]}>Voiceover</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Generation</CardTitle>
                <CardDescription>
                  Generate content ideas for the Mischievous Cat Shopper series
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentGenerator onContentGenerated={handleContentGenerated} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="script" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Script Generation</CardTitle>
                <CardDescription>
                  Generate scripts for episodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScriptGenerator 
                  contentPlan={contentPlan} 
                  onScriptGenerated={handleScriptGenerated}
                  onEpisodeSelect={setSelectedEpisode}
                  selectedEpisode={selectedEpisode}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="visual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Visual Generation</CardTitle>
                <CardDescription>
                  Generate visual prompts and images for episodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VisualGenerator 
                  episodeIndex={selectedEpisode}
                  script={scripts[selectedEpisode]}
                  onVisualPromptsGenerated={handleVisualPromptsGenerated}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="voiceover" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Voiceover Generation</CardTitle>
                <CardDescription>
                  Generate voiceovers for episodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceoverGenerator 
                  episodeIndex={selectedEpisode}
                  script={scripts[selectedEpisode]}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="video" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Video Generation</CardTitle>
                <CardDescription>
                  Generate videos by combining images and audio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoGenerator 
                  episodeIndex={selectedEpisode}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="social" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Planning</CardTitle>
                <CardDescription>
                  Generate social media plans for episodes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SocialMediaPlanner 
                  episodeIndex={selectedEpisode}
                  contentPlan={contentPlan}
                  script={scripts[selectedEpisode]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
