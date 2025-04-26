"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface FinalChoiceBlueOrangeProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
}

export default function FinalChoiceBlueOrange({ 
  onAdvance, 
  addTrialData
}: FinalChoiceBlueOrangeProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAdvancePhase, setShouldAdvancePhase] = useState(false)

  const handleChoice = (choice: string) => {
    if (isLoading) return

    const isBlue = choice === "blue"
    const success = isBlue ? true : Math.random() < 0.5
    const points = isBlue ? 50 : (success ? 100 : 0)
    
    // Record trial data
    addTrialData({
      phase: "final-choice-blue-orange",
      condition: "final-choice-blue-orange",
      stimulus: "blue vs. orange",
      choice: choice,
      outcome: success,
      points,
    })

    // Set loading state and advance after a short delay
    setIsLoading(true)
    setTimeout(() => {
      setShouldAdvancePhase(true)
    }, 500)
  }

  useEffect(() => {
    if (shouldAdvancePhase) {
      onAdvance()
      setShouldAdvancePhase(false)
    }
  }, [shouldAdvancePhase, onAdvance])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-8">
        <p className="text-xl font-bold text-center">If you only had one choice between these two buttons, which would you prefer?</p>
        <div className="flex space-x-8">
          <Button
            className="w-64 h-64 bg-blue-500 text-white text-2xl hover:bg-blue-500"
            onClick={() => handleChoice("blue")}
            disabled={isLoading}
          >
          </Button>
          <Button
            className="w-64 h-64 bg-orange-500 text-white text-2xl hover:bg-orange-500"
            onClick={() => handleChoice("orange")}
            disabled={isLoading}
          >
          </Button>
        </div>
      </div>
    </div>
  )
} 