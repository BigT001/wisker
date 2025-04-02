"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Save } from "lucide-react"

interface ContentPlanFormProps {
  apiConnected: boolean | null
}

export default function ContentPlanForm({ apiConnected }: ContentPlanFormProps) {
  const [title, setTitle] = useState("Mischievous Cat Shopper")
  const [episodes, setEpisodes] = useState(5)
  const [description, setDescription] = useState("")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <CardTitle>Content Plan</CardTitle>
        </div>
        <CardDescription>Create a content plan for your series</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Series Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter series title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="episodes">Number of Episodes</Label>
          <Input
            id="episodes"
            type="number"
            min={1}
            max={10}
            value={episodes}
            onChange={(e) => setEpisodes(Number.parseInt(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Series Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your series concept"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="ml-auto gap-2" disabled={!apiConnected}>
          <Save className="h-4 w-4" />
          Save Content Plan
        </Button>
      </CardFooter>
    </Card>
  )
}
