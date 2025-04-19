"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface SingleChoiceProps {
  onAdvance: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function SingleChoice({ onAdvance, addTrialData }: SingleChoiceProps) {
  const [choice, setChoice] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Add 2-second delay before showing content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleChoice = (selectedChoice: string) => {
    setChoice(selectedChoice)

    // Record trial data with more detailed information
    addTrialData({
      phase: 7,
      trialNumber: 1,
      condition: "final_blue_orange_choice",
      stimulus: "blue vs orange",
      choice: selectedChoice,
      points: 0, // No points for final choice
    })

    // Advance after delay
    setTimeout(onAdvance, 2000)
  }

  if (isLoading) {
    return <div className="min-h-[400px]"></div>  // Blank screen with minimum height
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Final Choice</h1>

      <div className="text-center mb-4">
        <p>If you had only one choice, which would you choose?</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-8">
          <Button
            className="w-32 h-32 bg-blue-500 text-white text-2xl"
            onClick={() => handleChoice("blue")}
            disabled={!!choice}
          >
          </Button>

          <Button
            className="w-32 h-32 bg-orange-500 text-white text-2xl"
            onClick={() => handleChoice("orange")}
            disabled={!!choice}
          >
          </Button>
        </div>

        {choice && <p className="text-lg">You chose {choice}. Moving to the next phase...</p>}
      </div>
    </div>
  )
}
