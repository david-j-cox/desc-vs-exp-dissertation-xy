"use client"

import { useEffect } from "react"

interface InterConditionIntervalProps {
  onComplete: () => void
}

export default function InterConditionInterval({ onComplete }: InterConditionIntervalProps) {
  useEffect(() => {
    // Automatically advance after 5 seconds
    const timer = setTimeout(() => {
      onComplete()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <p className="text-2xl font-bold text-center">Next condition loading...</p>
    </div>
  )
} 