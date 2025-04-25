"use client"

import { useEffect, useState } from "react"
import OSFUploader from "../osf-uploader"
import type { ExperimentData } from "../experiment"
import { useRouter } from "next/navigation"

export default function CompletionPage() {
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null)
  const [countdown, setCountdown] = useState(5)
  const router = useRouter()

  // Load and process experiment data
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        const data = JSON.parse(storedData)
        setExperimentData(data)
      }
    } catch (error) {
      console.error("Error loading data for OSF upload:", error)
    }
  }, [])

  // Handle countdown, data clearing, and window closing
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Clear the experiment data after upload
      localStorage.removeItem("experiment-data")
      window.location.href = "about:blank"
    }
  }, [countdown])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold">Thank you for participating!</h1>
        <p className="text-xl">
          Your responses have been recorded and will be automatically submitted.
        </p>
        <p className="text-lg">
          This window will close automatically in {countdown} seconds.
        </p>
        <p className="text-sm text-gray-500">
          If the window does not close automatically, you may close it manually.
        </p>
      </div>
      {/* Hidden OSF Uploader that will auto-upload when data is available */}
      <div className="hidden">
        <OSFUploader experimentData={experimentData} autoUpload={true} />
      </div>
    </div>
  )
} 