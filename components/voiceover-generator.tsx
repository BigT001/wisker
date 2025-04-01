'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { generateVoiceovers, getJobStatus } from '@/lib/api'
import { Progress } from '@/components/ui/progress'

interface VoiceoverGeneratorProps {
  episodeIndex: number
  script: string
}

export default function VoiceoverGenerator({ episodeIndex, script }: VoiceoverGeneratorProps) {
  const [generating, setGenerating] = useState(false)
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
            setGenerating(false)
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

  const handleGenerateVoiceovers = async () => {
    if (!script) return
    
    setGenerating(true)
    setProgress(0)
    try {
      const data = await generateVoiceovers(episodeIndex)
      setJobId(data.job_id)
    } catch (error) {
      console.error('Error generating voiceovers:', error)
      setGenerating(false)
    }
  }

  if (!script) {
    return <div>Please generate a script first</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generate Voiceovers</h3>
        <Button 
          onClick={handleGenerateVoiceovers} 
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Voiceovers...
            </>
          ) : (
            'Generate Voiceovers'
          )}
        </Button>
      </div>
      
      {generating && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-center">{progress}% complete</p>
        </div>
      )}
    </div>
  )
}
