import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Copy, Save } from 'lucide-react'
import { ScriptViewerProps } from './types'

export default function ScriptViewer({
  script,
  episodeTitle,
  episodeIndex,
  onCopy,
  onDownload,
  onBackToDetails
}: ScriptViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Script for Episode {episodeIndex + 1}: {episodeTitle}
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCopy}
            className="gap-1 shadow-sm hover:shadow-md transition-all"
          >
            <Copy className="h-4 w-4" /> Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="gap-1 shadow-sm hover:shadow-md transition-all"
          >
            <Save className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden border bg-card shadow-sm">
        <ScrollArea className="h-[500px] w-full rounded-md">
          <CardContent className="p-0">
            <pre className="p-6 text-sm font-mono whitespace-pre-wrap break-words bg-muted/30 rounded-md">
              {script}
            </pre>
          </CardContent>
        </ScrollArea>
      </Card>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Script automatically saved to content plan
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackToDetails}
          className="gap-1"
        >
          Back to Details
        </Button>
      </div>
    </div>
  )
}

