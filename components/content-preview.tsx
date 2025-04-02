"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function ContentPreview() {
  const [selectedEpisode, setSelectedEpisode] = useState("0")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <CardTitle>Content Preview</CardTitle>
        </div>
        <CardDescription>Preview generated content for your episodes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="preview-episode">Select an episode to preview its content</Label>
          <Select 
            value={selectedEpisode} 
            onValueChange={setSelectedEpisode}
          >
            <SelectTrigger id="preview-episode">
              <SelectValue placeholder="Choose Episode" />
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

        {selectedEpisode && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Episode {selectedEpisode} Script</h3>
              <p className="text-gray-600">
                {selectedEpisode === "0" 
                  ? "Meet Whiskers, a mischievous cat with a passion for shopping. In this introductory episode, we discover how Whiskers first discovered online shopping and the chaos that ensued."
                  : "Content not yet generated for this episode."}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Images</h3>
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500">Preview not available</p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Video</h3>
                <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500">Preview not available</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
