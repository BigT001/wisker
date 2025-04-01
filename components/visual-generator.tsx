'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { generateVisualPrompts, generateImages, getJobStatus } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface VisualGeneratorProps {
  episodeIndex: number
  script: string
  onVisualPromptsGenerated: (episodeIndex: number, prompts: any) => void
}

export default function VisualGenerator({ 
  episodeIndex, 
  script,
  onVisualPromptsGenerated
}: VisualGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [visualPrompts, setVisualPrompts] = useState<any>(null)
  const [generatingImages, setGeneratingImages] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (jobId) {
      interval = setInterval(async () => {
        try {
          const status = await getJobStatus(jobId)
          setProgress(status.progress || 0)
          
          if (status.status === 'completed' || status.status === 'failed') {
            clearInterval(interval)
            setGeneratingImages(false)
            setJobId(null)
          }
        } catch (error) {
          console.error('Error checking job status:', error)
        }
      }, 2000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [jobId])

  const handleGenerateVisualPrompts = async () => {
    if (!script) return
    
    setLoading(true)
    try {
      const data = await generateVisualPrompts(episodeIndex)
      setVisualPrompts(data)
      onVisualPromptsGenerated(episodeIndex, data)
    } catch (error) {
      console.error('Error generating visual prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateImages = async () => {
    if (!visualPrompts) return
    
    setGeneratingImages(true)
    setProgress(0)
    try {
      const data = await generateImages(episodeIndex)
      setJobId(data.job_id)
    } catch (error) {
      console.error('Error generating images:', error)
      setGeneratingImages(false)
    }
  }

  if (!script) {
    return <div>Please generate a script first</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Visual Prompts</h3>
        <Button onClick={handleGenerateVisualPrompts} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Prompts...
            </>
          ) : (
            'Generate Visual Prompts'
          )}
        </Button>
      </div>

      {visualPrompts && (
        <>
          <div className="space-y-4">
            {visualPrompts.scenes.map((scene: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <h4 className="font-medium">Scene {index + 1}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{scene.description}</p>
                  <p className="text-sm"><strong>Prompt:</strong> {scene.stable_diffusion_prompt}</p>
                  <p className="text-sm"><strong>Style:</strong> {scene.style}</p>
                  <p className="text-sm"><strong>Shot Type:</strong> {scene.shot_type}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Generate Images</h3>
              <Button 
                onClick={handleGenerateImages} 
                disabled={generatingImages}
              >
                {generatingImages ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Images...
                  </>
                ) : (
                  'Generate Images'
                )}
              </Button>
            </div>
            
            {generatingImages && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center">{progress}% complete</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
