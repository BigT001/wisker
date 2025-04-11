import { Progress } from '@/components/ui/progress'
import { ProgressTrackerProps } from './types'

export default function ProgressTracker({ progress, isGenerating }: ProgressTrackerProps) {
  if (!isGenerating) return null
  
  return (
    <div className="space-y-2 bg-muted/30 p-4 rounded-lg border">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Generating scripts for all episodes...</span>
        <span className="text-primary font-bold">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
