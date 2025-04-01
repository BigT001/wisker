'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { generateScript } from '@/lib/api'
import { Textarea } from '@/components/ui/textarea'

interface ScriptGeneratorProps {
  contentPlan: any
  onScriptGenerated: (episodeIndex: number, script: string) => void
  onEpisodeSelect: (episodeIndex: number) => void
  selectedEpisode: number
}

export default function ScriptGenerator({ 
  contentPlan, 
  onScriptGenerated,
  onEpisodeSelect,
  selectedEpisode
}: ScriptGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<string>('')

  const handleEpisodeChange = (value: string) => {
    const episodeIndex = parseInt(value)
    onEpisodeSelect(episodeIndex)
    setScript('')
  }

  const handleGenerateScript = async () => {
    setLoading(true)
    try {
      const data = await generateScript(selectedEpisode)
      setScript(data.script)
      onScriptGenerated(selectedEpisode, data.script)
    } catch (error) {
      console.error('Error generating script:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!contentPlan) {
    return <div>Please generate a content plan first</div>
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="episode">Select Episode</Label>
        <Select 
          value={selectedEpisode.toString()} 
          onValueChange={handleEpisodeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an episode" />
          </SelectTrigger>
          <SelectContent>
            {contentPlan.episodes.map((episode: any, index: number) => (
              <SelectItem key={index} value={index.toString()}>
                Episode {index + 1}: {episode.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Episode Details</h3>
          <Button onClick={handleGenerateScript} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Script'
            )}
          </Button>
        </div>
        
        {contentPlan.episodes[selectedEpisode] && (
          <div className="space-y-2 p-4 border rounded-md">
            <p><strong>Title:</strong> {contentPlan.episodes[selectedEpisode].title}</p>
            <p><strong>Premise:</strong> {contentPlan.episodes[selectedEpisode].premise}</p>
            <p><strong>Setting:</strong> {contentPlan.episodes[selectedEpisode].setting}</p>
            <p><strong>Items:</strong> {contentPlan.episodes[selectedEpisode].items.join(', ')}</p>
            <p><strong>Conflict:</strong> {contentPlan.episodes[selectedEpisode].conflict}</p>
            <p><strong>Resolution:</strong> {contentPlan.episodes[selectedEpisode].resolution}</p>
          </div>
        )}
      </div>

      {script && (
        <div className="space-y-2">
          <Label htmlFor="script">Generated Script</Label>
          <Textarea
            id="script"
            value={script}
            readOnly
            className="h-[400px] font-mono"
          />
        </div>
      )}
    </div>
  )
}
