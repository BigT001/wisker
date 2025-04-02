"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server } from "lucide-react"
import { checkApiStatus } from "@/lib/api" // Import the API utility
import { motion } from 'framer-motion';


interface ApiStatusProps {
  setApiConnected: (status: boolean) => void
}

export default function ApiStatus({ setApiConnected }: ApiStatusProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    // Make an actual API call to check connection
    const verifyApiConnection = async () => {
      setIsLoading(true);
      try {
        // Use the checkApiStatus function from your API utilities
        const isConnected = await checkApiStatus();
        
        setApiConnected(isConnected);
        setConnectionError(isConnected ? null : 'API is not operational');
      } catch (error) {
        console.error('API connection check failed:', error);
        setApiConnected(false);
        setConnectionError(
          error instanceof Error 
            ? error.message 
            : 'Failed to connect to the API'
        );
      } finally {
        setIsLoading(false);
      }
    }

    verifyApiConnection();

    // Set up a periodic check every 30 seconds
    const intervalId = setInterval(verifyApiConnection, 30000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [setApiConnected]);

  return (
    <motion.div 
    initial={{ scale: 0.95 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.3 }}
  >
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
          
          {isLoading ? (
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              Checking...
            </Badge>
          ) : connectionError ? (
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                Disconnected
              </Badge>
              <span className="text-xs text-red-600 mt-1">{connectionError}</span>
            </div>
          ) : (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Connected
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>

  )
 
}


