"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ContentPlanFormProps {
  apiConnected: boolean | null
}

export default function ContentPlanForm({ apiConnected }: ContentPlanFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    series_title: "Mischievous Cat Shopper",
    episodes: 5,
    cat_name: "Whiskers",
    content_style: "humorous, family-friendly, 30-60 seconds per episode",
  })
  const [contentPlan, setContentPlan] = useState<any>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Using preview mode. In a real app, this would connect to the Python backend.",
      })

      // In preview mode, simulate a successful response with mock data
      setLoading(true)
      setTimeout(() => {
        const mockData = {
          series_concept:
            "A mischievous cat named " +
            formData.cat_name +
            " who secretly orders items online while the owners are away, leading to hilarious situations when packages arrive.",
          cat_personality: {
            traits: ["Clever", "Sneaky", "Playful", "Curious"],
            quirks: ["Loves to sit on keyboards", "Knocks things off shelves", "Hides in boxes"],
            catchphrases: ["Purr-fect purchase!", "Add to cart, right meow!", "Shipping? Cat-astrophic!"],
          },
          episodes: [
            {
              title: "The First Order",
              premise: formData.cat_name + " discovers online shopping and orders a giant cat tree.",
            },
            {
              title: "Toy Trouble",
              premise: "A massive shipment of cat toys arrives, overwhelming the living room.",
            },
            {
              title: "Gourmet Cat",
              premise: formData.cat_name + " orders expensive cat food from around the world.",
            },
            {
              title: "Delivery Day Disaster",
              premise: "Multiple deliveries arrive at once, causing chaos at the front door.",
            },
            {
              title: "The Return Policy",
              premise: "The owners try to return items, but " + formData.cat_name + " has other plans.",
            },
          ],
        }

        setContentPlan(mockData)
        setLoading(false)

        toast({
          title: "Content plan generated (Preview)",
          description: "Mock content plan created for demonstration",
        })
      }, 2000)

      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:8000/generate/content-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content plan")
      }

      const data = await response.json()
      setContentPlan(data)

      toast({
        title: "Content plan generated",
        description: "Your content plan has been successfully created",
      })
    } catch (error) {
      console.error("Error generating content plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate content plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Plan Configuration</CardTitle>
          <CardDescription>Configure the parameters for your content plan</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="series_title">Series Title</Label>
              <Input
                id="series_title"
                value={formData.series_title}
                onChange={(e) => setFormData({ ...formData, series_title: e.target.value })}
                placeholder="Enter series title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cat_name">Cat Name</Label>
              <Input
                id="cat_name"
                value={formData.cat_name}
                onChange={(e) => setFormData({ ...formData, cat_name: e.target.value })}
                placeholder="Enter cat name"
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Episodes: {formData.episodes}</Label>
              <Slider
                value={[formData.episodes]}
                min={1}
                max={10}
                step={1}
                onValueChange={(value) => setFormData({ ...formData, episodes: value[0] })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_style">Content Style</Label>
              <Textarea
                id="content_style"
                value={formData.content_style}
                onChange={(e) => setFormData({ ...formData, content_style: e.target.value })}
                placeholder="Describe the content style"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !apiConnected}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Content Plan"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Plan Preview</CardTitle>
          <CardDescription>Preview of your generated content plan</CardDescription>
        </CardHeader>
        <CardContent>
          {contentPlan ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Series Concept</h3>
                <p className="text-sm text-muted-foreground">{contentPlan.series_concept}</p>
              </div>

              <div>
                <h3 className="font-medium">Cat Personality</h3>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">Traits:</span> {contentPlan.cat_personality.traits.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Quirks:</span> {contentPlan.cat_personality.quirks.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">Catchphrases:</span>{" "}
                    {contentPlan.cat_personality.catchphrases.join(", ")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium">Episodes</h3>
                <div className="space-y-2">
                  {contentPlan.episodes.map((episode: any, index: number) => (
                    <div key={index} className="text-sm border p-2 rounded">
                      <p className="font-medium">{episode.title}</p>
                      <p className="text-xs text-muted-foreground">{episode.premise}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-muted-foreground">No content plan generated yet</p>
              <p className="text-xs text-muted-foreground mt-2">
                Fill out the form and click Generate to create a content plan
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

