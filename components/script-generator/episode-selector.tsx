import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'
import { EpisodeSelectorProps } from './types'

export default function EpisodeSelector({
  episodes,
  currentEpisodeIndex,
  savedScripts,
  onEpisodeChange,
  disabled = false
}: EpisodeSelectorProps) {
  return (
    <div className="space-y-2 flex-1">
      <Label htmlFor="episode" className="text-sm font-medium">Select Episode</Label>
      <Select
        value={currentEpisodeIndex.toString()}
        onValueChange={(value) => onEpisodeChange(parseInt(value))}
        disabled={disabled}
      >
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select an episode" />
        </SelectTrigger>
        <SelectContent>
          {episodes.map((episode, index) => (
            <SelectItem key={index} value={index.toString()}>
              <div className="flex items-center">
                <span>Episode {index + 1}: {episode.title}</span>
                {savedScripts[index] && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Scripted
                  </Badge>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
