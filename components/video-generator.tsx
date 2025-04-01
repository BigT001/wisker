'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Play } from 'lucide-react'
import { generateVideo } from '@/lib/api'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface VideoGeneratorProps {
  episodeIndex: number
}

export default function VideoGenerator({ episodeIndex }: VideoGeneratorProps) {
  const [generating, setGenerating] = useState(false)
  const [videoPath, setVideoPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateVideo = async () => {
    setGenerating(true)
    setError(null)
    try {
      const data = await generateVideo(episodeIndex)
      setVideoPath(data.path)
    } catch (error: any) {
      console.error('Error generating video:', error)
      setError(error.message || 'Failed to generate video')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generate Video</h3>
        <Button 
          onClick={handleGenerateVideo} 
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Video...
            </>
          ) : (
            'Generate Video'
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {videoPath && (
        <div className="space-y-2">
          <h4 className="font-medium">Video Generated</h4>
          <p className="text-sm text-muted-foreground">Video has been generated successfully.</p>
          <Button variant="outline" className="mt-2">
            <Play className="mr-2 h-4 w-4" />
            Play Video
          </Button>
        </div>
      )}
    </div>
  )
}
