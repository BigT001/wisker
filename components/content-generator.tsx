'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { generateContentPlan } from '@/lib/api'

interface ContentGeneratorProps {
  onContentGenerated: (data: any) => void
}

export default function ContentGenerator({ onContentGenerated }: ContentGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    series_title: 'Mischievous Cat Shopper',
    episodes: 5,
    cat_name: 'Whiskers',
    content_style: 'humorous, family-friendly, 30-60 seconds per episode'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'episodes' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await generateContentPlan(formData)
      onContentGenerated(data)
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="series_title">Series Title</Label>
            <Input
              id="series_title"
              name="series_title"
              value={formData.series_title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="episodes">Number of Episodes</Label>
            <Input
              id="episodes"
              name="episodes"
              type="number"
              min="1"
              max="10"
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
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Content...
            </>
          ) : (
            'Generate Content Plan'
          )}
        </Button>
      </form>
    </div>
  )
}
