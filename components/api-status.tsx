"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

interface ApiStatusProps {
  setApiConnected: (connected: boolean | null) => void
}

export default function ApiStatus({ setApiConnected }: ApiStatusProps) {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        // Add a timeout to the fetch request to prevent long waiting times
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch("http://localhost:8000/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          setStatus("connected")
          setApiConnected(true)
        } else {
          setStatus("disconnected")
          setApiConnected(false)
        }
      } catch (error) {
        console.error("Error checking API status:", error)
        setStatus("disconnected")
        setApiConnected(false)

        // In preview environments, we can simulate a connected state for demo purposes
        if (
          window.location.hostname.includes("vercel.app") ||
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          console.log("Preview environment detected, simulating API connection")
          // Uncomment the following lines to simulate a connected API in preview
          // setStatus('connected');
          // setApiConnected(true);
        }
      }
    }

    checkApiStatus()

    // Set up polling for API status with a longer interval to reduce console errors
    const interval = setInterval(() => {
      checkApiStatus()
    }, 60000) // Check every minute instead of every 30 seconds

    return () => clearInterval(interval)
  }, [setApiConnected])

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Status</CardTitle>
        <CardDescription>Connection to Python backend</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center p-4">
          {status === "checking" && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <p className="mt-2 text-sm text-muted-foreground">Checking connection...</p>
            </div>
          )}

          {status === "connected" && (
            <div className="flex flex-col items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <p className="mt-2 text-sm text-muted-foreground">Connected to API</p>
            </div>
          )}

          {status === "disconnected" && (
            <div className="flex flex-col items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <p className="mt-2 text-sm text-muted-foreground">API not connected</p>
              <div className="text-xs text-muted-foreground mt-1 text-center">
                <p>Make sure the Python backend is running at:</p>
                <p className="font-mono mt-1">http://localhost:8000</p>
                <p className="mt-2">You can still explore the UI without a backend connection.</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

