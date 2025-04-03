"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Save, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateContentPlan } from "@/lib/api"

interface ContentPlanFormProps {
  apiConnected: boolean | null
}

export default function ContentPlanForm({ apiConnected }: ContentPlanFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [contentPlan, setContentPlan] = useState<any>(null)
  const { toast } = useToast()
  
  // Form state
  const [formData, setFormData] = useState({
    series_title: "Mischievous Cat Shopper",
    episodes: 5,
    cat_name: "Whiskers",
    content_style: "humorous, family-friendly, 30-60 seconds per episode",
    description: ""
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "episodes" ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!apiConnected) {
      toast({
        title: "API not connected",
        description: "Please check your API connection and try again.",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      toast({
        title: "Generating content plan",
        description: "This may take a few moments...",
      })
      
      const config = {
        series_title: formData.series_title,
        num_episodes: formData.episodes,
        cat_name: formData.cat_name,
        content_style: formData.content_style || formData.description,
        theme: formData.content_style || formData.description
      }
      
      const data = await generateContentPlan(config)
      setContentPlan(data)
      
      toast({
        title: "Success!",
        description: "Content plan generated successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Error generating content plan:", error)
      toast({
        title: "Error",
        description: "Failed to generate content plan. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Content Plan</CardTitle>
          </div>
          <CardDescription>Create a content plan for your series</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="series_title">Series Title</Label>
                <Input 
                  id="series_title" 
                  name="series_title"
                  value={formData.series_title} 
                  onChange={handleChange} 
                  placeholder="Enter series title" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="episodes">Number of Episodes</Label>
                <Input
                  id="episodes"
                  name="episodes"
                  type="number"
                  min={1}
                  max={10}
                  value={formData.episodes}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cat_name">Cat Name</Label>
                <Input
                  id="cat_name"
                  name="cat_name"
                  value={formData.cat_name}
                  onChange={handleChange}
                  placeholder="Name of the cat character"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content_style">Content Style</Label>
                <Input
                  id="content_style"
                  name="content_style"
                  value={formData.content_style}
                  onChange={handleChange}
                  placeholder="e.g., humorous, family-friendly"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Additional Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your series concept in more detail"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              type="submit"
              className="ml-auto gap-2 bg-primary text-white" 
              disabled={isLoading || !apiConnected}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Content Plan
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {contentPlan && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Generated Content Plan</CardTitle>
            <CardDescription>
              Series: {contentPlan.series_concept}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Cat Personality</h3>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-md bg-muted p-3">
                    <h4 className="font-medium">Traits</h4>
                    <ul className="mt-1 list-disc pl-4 text-sm">
                      {contentPlan.cat_personality.traits.map((trait: string, i: number) => (
                        <li key={i}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="rounded-md bg-muted p-3">
                    <h4 className="font-medium">Quirks</h4>
                    <ul className="mt-1 list-disc pl-4 text-sm">
                      {contentPlan.cat_personality.quirks.map((quirk: string, i: number) => (
                        <li key={i}>{quirk}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="rounded-md bg-muted p-3">
                    <h4 className="font-medium">Catchphrases</h4>
                    <ul className="mt-1 list-disc pl-4 text-sm">
                      {contentPlan.cat_personality.catchphrases.map((phrase: string, i: number) => (
                        <li key={i}>"{phrase}"</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Episodes</h3>
                <div className="mt-2 space-y-3">
                  {contentPlan.episodes.map((episode: any, i: number) => (
                    <div key={i} className="rounded-md border p-3">
                      <h4 className="font-medium">{i+1}. {episode.title}</h4>
                      <p className="text-sm text-muted-foreground">{episode.premise}</p>
                      <div className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        <div>
                          <span className="font-medium">Setting:</span> {episode.setting}
                        </div>
                        <div>
                          <span className="font-medium">Items:</span> {episode.items.join(", ")}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">Conflict:</span> {episode.conflict}
                        </div>
                        <div className="sm:col-span-2">
                          <span className="font-medium">Resolution:</span> {episode.resolution}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => {
                // Save to local storage or download as JSON
                const dataStr = JSON.stringify(contentPlan, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                
                const exportFileDefaultName = 'content-plan.json';
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
                
                toast({
                  title: "Content plan saved",
                  description: "The content plan has been downloaded as JSON",
                  variant: "success",
                });
              }}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Content Plan
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
