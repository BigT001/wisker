"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface EpisodeGeneratorProps {
  apiConnected: boolean | null
}

export default function EpisodeGenerator({ apiConnected }: EpisodeGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [selectedEpisode, setSelectedEpisode] = useState("0")
  const [contentPlan, setContentPlan] = useState<any>(null)
  const [generationSteps, setGenerationSteps] = useState({
    script: false,
    visualPrompts: false,
    images: false,
    voiceovers: false,
    video: false,
    socialMedia: false,
  })
  const { toast } = useToast()

  const fetchContentPlan = async () => {
    if (!apiConnected) {
      // In preview mode, use mock data
      const mockData = {
        series_concept: "A mischievous cat named Whiskers who secretly orders items online while the owners are away.",
        cat_personality: {
          traits: ["Clever", "Sneaky", "Playful", "Curious"],
          quirks: ["Loves to sit on keyboards", "Knocks things off shelves", "Hides in boxes"],
          catchphrases: ["Purr-fect purchase!", "Add to cart, right meow!", "Shipping? Cat-astrophic!"],
        },
        episodes: [
          {
            title: "The First Order",
            premise: "Whiskers discovers online shopping and orders a giant cat tree.",
          },
          {
            title: "Toy Trouble",
            premise: "A massive shipment of cat toys arrives, overwhelming the living room.",
          },
          {
            title: "Gourmet Cat",
            premise: "Whiskers orders expensive cat food from around the world.",
          },
          {
            title: "Delivery Day Disaster",
            premise: "Multiple deliveries arrive at once, causing chaos at the front door.",
          },
          {
            title: "The Return Policy",
            premise: "The owners try to return items, but Whiskers has other plans.",
          },
        ],
      }
      setContentPlan(mockData)
      return
    }

    try {
      const response = await fetch("http://localhost:8000/outputs/content_plan.json")
      if (response.ok) {
        const data = await response.json()
        setContentPlan(data)
      }
    } catch (error) {
      console.error("Error fetching content plan:", error)
    }
  }

  const generateScript = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, script: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/script/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate script")
      }

      setGenerationSteps({ ...generationSteps, script: true })

      toast({
        title: "Script generated",
        description: "Your episode script has been successfully created",
      })
    } catch (error) {
      console.error("Error generating script:", error)
      toast({
        title: "Error",
        description: "Failed to generate script. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateVisualPrompts = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, visualPrompts: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/visual-prompts/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate visual prompts")
      }

      setGenerationSteps({ ...generationSteps, visualPrompts: true })

      toast({
        title: "Visual prompts generated",
        description: "Your visual prompts have been successfully created",
      })
    } catch (error) {
      console.error("Error generating visual prompts:", error)
      toast({
        title: "Error",
        description: "Failed to generate visual prompts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const startImageGeneration = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, images: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/images/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start image generation")
      }

      const data = await response.json()

      toast({
        title: "Image generation started",
        description: `Job ID: ${data.job_id}. Check the Status Monitor tab for progress.`,
      })

      // For demo purposes, we'll just set this to true
      // In a real app, you'd check the job status
      setTimeout(() => {
        setGenerationSteps({ ...generationSteps, images: true })
        setLoading(false)
      }, 3000)
    } catch (error) {
      console.error("Error starting image generation:", error)
      toast({
        title: "Error",
        description: "Failed to start image generation. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const startVoiceoverGeneration = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, voiceovers: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/voiceovers/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start voiceover generation")
      }

      const data = await response.json()

      toast({
        title: "Voiceover generation started",
        description: `Job ID: ${data.job_id}. Check the Status Monitor tab for progress.`,
      })

      // For demo purposes, we'll just set this to true
      // In a real app, you'd check the job status
      setTimeout(() => {
        setGenerationSteps({ ...generationSteps, voiceovers: true })
        setLoading(false)
      }, 3000)
    } catch (error) {
      console.error("Error starting voiceover generation:", error)
      toast({
        title: "Error",
        description: "Failed to start voiceover generation. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  const generateVideo = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, video: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/video/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate video")
      }

      setGenerationSteps({ ...generationSteps, video: true })

      toast({
        title: "Video generated",
        description: "Your episode video has been successfully created",
      })
    } catch (error) {
      console.error("Error generating video:", error)
      toast({
        title: "Error",
        description: "Failed to generate video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generateSocialMedia = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please ensure the Python backend is running",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setGenerationSteps({ ...generationSteps, socialMedia: false })

    try {
      const response = await fetch(`http://localhost:8000/generate/social-media/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to generate social media plan")
      }

      setGenerationSteps({ ...generationSteps, socialMedia: true })

      toast({
        title: "Social media plan generated",
        description: "Your social media plan has been successfully created",
      })
    } catch (error) {
      console.error("Error generating social media plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate social media plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const runFullPipeline = async () => {
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Using preview mode. In a real app, this would connect to the Python backend.",
      })

      // In preview mode, simulate a successful pipeline run
      setLoading(true)

      // Simulate progress updates
      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, script: true }))
        toast({
          title: "Script generated (Preview)",
          description: "Mock script created for demonstration",
        })
      }, 1000)

      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, visualPrompts: true }))
        toast({
          title: "Visual prompts generated (Preview)",
          description: "Mock visual prompts created for demonstration",
        })
      }, 2000)

      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, images: true }))
        toast({
          title: "Images generated (Preview)",
          description: "Mock images created for demonstration",
        })
      }, 3000)

      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, voiceovers: true }))
        toast({
          title: "Voiceovers generated (Preview)",
          description: "Mock voiceovers created for demonstration",
        })
      }, 4000)

      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, video: true }))
        toast({
          title: "Video generated (Preview)",
          description: "Mock video created for demonstration",
        })
      }, 5000)

      setTimeout(() => {
        setGenerationSteps((prev) => ({ ...prev, socialMedia: true }))
        toast({
          title: "Social media plan generated (Preview)",
          description: "Mock social media plan created for demonstration",
        })
        setLoading(false)
      }, 6000)

      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:8000/generate/full-pipeline/${selectedEpisode}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to start full pipeline")
      }

      const data = await response.json()

      toast({
        title: "Full pipeline started",
        description: `Job ID: ${data.job_id}. Check the Status Monitor tab for progress.`,
      })

      // For demo purposes, we'll just set all steps to true
      // In a real app, you'd check the job status
      setTimeout(() => {
        setGenerationSteps({
          script: true,
          visualPrompts: true,
          images: true,
          voiceovers: true,
          video: true,
          socialMedia: true,
        })
        setLoading(false)
      }, 5000)
    } catch (error) {
      console.error("Error starting full pipeline:", error)
      toast({
        title: "Error",
        description: "Failed to start full pipeline. Please try again.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // Fetch content plan on component mount
  useEffect(() => {
    fetchContentPlan()
  }, [apiConnected])

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Episode Generator</CardTitle>
          <CardDescription>Generate content for a specific episode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="episode">Select Episode</Label>
            <Select value={selectedEpisode} onValueChange={setSelectedEpisode} disabled={loading}>
              <SelectTrigger id="episode">
                <SelectValue placeholder="Select episode" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((index) => (
                  <SelectItem key={index} value={index.toString()}>
                    Episode {index}{" "}
                    {contentPlan?.episodes?.[index]?.title ? `- ${contentPlan.episodes[index].title}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={generationSteps.script ? "outline" : "default"}
              onClick={generateScript}
              disabled={loading || !apiConnected}
              className="justify-start"
            >
              {generationSteps.script ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              1. Generate Script
            </Button>

            <Button
              variant={generationSteps.visualPrompts ? "outline" : "default"}
              onClick={generateVisualPrompts}
              disabled={loading || !apiConnected || !generationSteps.script}
              className="justify-start"
            >
              {generationSteps.visualPrompts ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              2. Generate Visual Prompts
            </Button>

            <Button
              variant={generationSteps.images ? "outline" : "default"}
              onClick={startImageGeneration}
              disabled={loading || !apiConnected || !generationSteps.visualPrompts}
              className="justify-start"
            >
              {generationSteps.images ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              3. Generate Images
            </Button>

            <Button
              variant={generationSteps.voiceovers ? "outline" : "default"}
              onClick={startVoiceoverGeneration}
              disabled={loading || !apiConnected || !generationSteps.script}
              className="justify-start"
            >
              {generationSteps.voiceovers ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              4. Generate Voiceovers
            </Button>

            <Button
              variant={generationSteps.video ? "outline" : "default"}
              onClick={generateVideo}
              disabled={loading || !apiConnected || !generationSteps.images || !generationSteps.voiceovers}
              className="justify-start"
            >
              {generationSteps.video ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              5. Generate Video
            </Button>

            <Button
              variant={generationSteps.socialMedia ? "outline" : "default"}
              onClick={generateSocialMedia}
              disabled={loading || !apiConnected || !generationSteps.script}
              className="justify-start"
            >
              {generationSteps.socialMedia ? (
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              ) : loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              6. Generate Social Media Plan
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runFullPipeline} disabled={loading || !apiConnected} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Full Pipeline...
              </>
            ) : (
              "Run Full Pipeline"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

