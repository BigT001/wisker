"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, Clock, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function StatusMonitor() {
  // Sample data for the status monitor
  const tasks = [
    { id: 1, name: "Script Generation", status: "completed", progress: 100 },
    { id: 2, name: "Image Generation", status: "in-progress", progress: 65 },
    { id: 3, name: "Voiceover Synthesis", status: "waiting", progress: 0 },
    { id: 4, name: "Video Rendering", status: "waiting", progress: 0 },
    { id: 5, name: "Final Compilation", status: "waiting", progress: 0 },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">In Progress</Badge>
      case "waiting":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Waiting</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Failed</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in-progress":
        return <Activity className="h-5 w-5 text-blue-500" />
      case "waiting":
        return <Clock className="h-5 w-5 text-gray-500" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle>Status Monitor</CardTitle>
        </div>
        <CardDescription>Track the progress of your content generation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="font-medium">{task.name}</span>
                </div>
                {getStatusBadge(task.status)}
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

