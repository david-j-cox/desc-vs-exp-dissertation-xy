"use client"

import { useEffect, useState } from "react"
import OSFUploader from "../osf-uploader"
import type { ExperimentData } from "../experiment"

export default function CompletionPage() {
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Load experiment data from localStorage
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        setExperimentData(JSON.parse(storedData))
      }
    } catch (error) {
      console.error("Error loading experiment data:", error)
    }

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Close the window when countdown reaches 0
          window.close()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p className="mb-4">
          Your responses have been recorded. Thank you for participating in our experiment.
        </p>
        <p className="text-gray-600">
          This window will close automatically in {countdown} seconds...
        </p>
        
        {/* Hidden OSF Uploader that will auto-upload when data is available */}
        <div className="hidden">
          <OSFUploader experimentData={experimentData} autoUpload={true} />
        </div>
      </div>
    </div>
  )
} 