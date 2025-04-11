import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, RefreshCw, FileText } from 'lucide-react'
import { EpisodeDetailsProps } from './types'

export default function EpisodeDetails({
  episode,
  episodeIndex,
  hasScript,
  onGenerateScript,
  onViewScript,
  isGenerating,
  isSaving
}: EpisodeDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Episode {episodeIndex + 1}: {episode.title}</h3>
        <Button
          onClick={onGenerateScript}
          disabled={isGenerating || isSaving}
          className="gap-2 shadow-sm hover:shadow-md transition-all"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : hasScript ? (
            <>
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate Script
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-1" />
              Generate Script
            </>
          )}
        </Button>
      </div>
      
      <Card className="overflow-hidden border bg-card shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Premise</h4>
              <p className="text-card-foreground">{episode.premise}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Setting</h4>
              <p className="text-card-foreground">{episode.setting}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Items</h4>
            <div className="flex flex-wrap gap-2">
              {episode.items.map((item: string, idx: number) => (
                <Badge key={idx} variant="outline" className="bg-background">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Conflict</h4>
              <p className="text-card-foreground">{episode.conflict}</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground">Resolution</h4>
              <p className="text-card-foreground">{episode.resolution}</p>
            </div>
          </div>
          
          {hasScript && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewScript}
                className="w-full"
              >
                View Generated Script
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
