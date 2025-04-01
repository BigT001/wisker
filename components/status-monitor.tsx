"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw } from "lucide-react"

interface Job {
  job_id: string
  status: string
  progress: number | null
  result_path: string | null
  type: string
  episode: number
  created_at: string
}

export default function StatusMonitor() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // This is a mock function since we don't have actual job storage in the backend
  const fetchJobs = async () => {
    setLoading(true)

    // In a real app, you'd fetch this from the backend
    // For now, we'll use mock data
    setTimeout(() => {
      setJobs([
        {
          job_id: "images_0_1234567890",
          status: "completed",
          progress: 100,
          result_path: "./outputs/images/episode1/",
          type: "Image Generation",
          episode: 0,
          created_at: new Date().toISOString(),
        },
        {
          job_id: "voiceover_0_1234567891",
          status: "running",
          progress: 65,
          result_path: null,
          type: "Voiceover Generation",
          episode: 0,
          created_at: new Date().toISOString(),
        },
        {
          job_id: "pipeline_1_1234567892",
          status: "queued",
          progress: 0,
          result_path: null,
          type: "Full Pipeline",
          episode: 1,
          created_at: new Date().toISOString(),
        },
      ])
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    fetchJobs()

    // Set up polling for job status updates
    const interval = setInterval(() => {
      fetchJobs()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500"
      case "running":
        return "text-blue-500"
      case "queued":
        return "text-yellow-500"
      case "failed":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Status Monitor</CardTitle>
          <CardDescription>Monitor the status of your content generation jobs</CardDescription>
        </div>
        <Button variant="outline" size="icon" onClick={fetchJobs} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.job_id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-medium">
                      {job.type} - Episode {job.episode}
                    </h3>
                    <p className="text-xs text-muted-foreground">Job ID: {job.job_id}</p>
                  </div>
                  <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                {job.progress !== null && (
                  <div className="space-y-1">
                    <Progress value={job.progress} className="h-2" />
                    <p className="text-xs text-right text-muted-foreground">{job.progress}%</p>
                  </div>
                )}

                {job.result_path && (
                  <p className="text-xs mt-2">
                    Result path: <span className="font-mono">{job.result_path}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-muted-foreground">No jobs found</p>
            <p className="text-xs text-muted-foreground mt-2">Start a content generation job to see it here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

