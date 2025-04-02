"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Film, Wand2 } from "lucide-react"
import { Label } from "@/components/ui/label"

interface EpisodeGeneratorProps {
  apiConnected: boolean | null
}

export default function EpisodeGenerator({ apiConnected }: EpisodeGeneratorProps) {
  const isDisabled = !apiConnected

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" />
          <CardTitle>Episode Generator</CardTitle>
        </div>
        <CardDescription>Generate content for specific episodes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="episode">Select Episode</Label>
          <Select defaultValue="0">
            <SelectTrigger id="episode">
              <SelectValue placeholder="Select episode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Episode 0: Introduction</SelectItem>
              <SelectItem value="1">Episode 1: The First Adventure</SelectItem>
              <SelectItem value="2">Episode 2: Unexpected Challenges</SelectItem>
              <SelectItem value="3">Episode 3: New Friends</SelectItem>
              <SelectItem value="4">Episode 4: The Big Surprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <Button variant="outline" className="gap-2" disabled={isDisabled}>
            <Wand2 className="h-4 w-4" />
            Generate Script
          </Button>
          <Button variant="outline" className="gap-2" disabled={isDisabled}>
            <Wand2 className="h-4 w-4" />
            Generate Images
          </Button>
          <Button variant="outline" className="gap-2" disabled={isDisabled}>
            <Wand2 className="h-4 w-4" />
            Generate Voiceover
          </Button>
          <Button variant="outline" className="gap-2" disabled={isDisabled}>
            <Wand2 className="h-4 w-4" />
            Generate Video
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto" disabled={isDisabled}>Generate All</Button>
      </CardFooter>
    </Card>
  )
}
