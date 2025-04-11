import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2 } from 'lucide-react'
import { ScriptStatusProps } from './types'

export default function ScriptStatus({ completedCount, totalCount }: ScriptStatusProps) {
  const percentage = (completedCount / totalCount) * 100
  
  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <span className="font-medium">Script Status</span>
        </div>
        <Badge variant={completedCount === totalCount ? "default" : "secondary"}>
          {completedCount} of {totalCount} episodes scripted
        </Badge>
      </div>
      <Progress 
        value={percentage} 
        className="h-2 mt-2" 
      />
    </div>
  )
}
