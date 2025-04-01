'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { generateSocialMediaPlan } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface SocialMediaPlannerProps {
  episodeIndex: number
  contentPlan: any
  script: string
}

export default function SocialMediaPlanner({ 
  episodeIndex, 
  contentPlan,
  script
}: SocialMediaPlannerProps) {
  const [loading, setLoading] = useState(false)
  const [socialMediaPlan, setSocialMediaPlan] = useState<any>(null)

  const handleGeneratePlan = async () => {
    if (!contentPlan || !script) return
    
    setLoading(true)
    try {
      const data = await generateSocialMediaPlan(episodeIndex)
      setSocialMediaPlan(data)
    } catch (error) {
      console.error('Error generating social media plan:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!contentPlan || !script) {
    return <div>Please generate a content plan and script first</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Social Media Plan</h3>
        <Button onClick={handleGeneratePlan} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Plan...
            </>
          ) : (
            'Generate Social Media Plan'
          )}
        </Button>
      </div>

      {socialMediaPlan && (
        <div className="space-y-4">
          <Tabs defaultValue={socialMediaPlan.platforms[0].name.toLowerCase()}>
            <TabsList className="grid grid-cols-4">
              {socialMediaPlan.platforms.map((platform: any) => (
                <TabsTrigger 
                  key={platform.name} 
                  value={platform.name.toLowerCase()}
                >
                  {platform.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {socialMediaPlan.platforms.map((platform: any) => (
              <TabsContent 
                key={platform.name} 
                value={platform.name.toLowerCase()}
                className="space-y-4"
              >
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <h4 className="font-medium">Post Text</h4>
                      <p className="text-sm mt-1">{platform.post_text}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Hashtags</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {platform.hashtags.map((tag: string) => (
                          <Badge key={tag} variant="secondary">#{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Best Time to Post</h4>
                      <p className="text-sm mt-1">{platform.best_time_to_post}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Engagement Prompt</h4>
                      <p className="text-sm mt-1">{platform.engagement_prompt}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="space-y-2 mt-6">
            <h3 className="text-lg font-medium">Content Variations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialMediaPlan.content_variations.map((variation: any, index: number) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{variation.type}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{variation.description}</p>
                    <p className="text-sm mt-2"><strong>Purpose:</strong> {variation.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
