"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"

interface ApiStatusProps {
  setApiConnected: (status: boolean) => void
}

export default function ApiStatus({ setApiConnected }: ApiStatusProps) {
  useEffect(() => {
    // Simulate API connection check
    const checkApiConnection = async () => {
      try {
        // In a real app, you would make an actual API call here
        // For demo purposes, we'll simulate a successful connection
        await new Promise((resolve) => setTimeout(resolve, 1500))
        setApiConnected(true)
      } catch (_error) {
        setApiConnected(false)
      }
    }
    checkApiConnection()
  }, [setApiConnected])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">API Status</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <CardDescription>Content Generation API</CardDescription>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Connected
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

