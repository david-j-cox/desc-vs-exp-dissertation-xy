"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface FinalChoiceBlueOrangeProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function FinalChoiceBlueOrange({ onAdvance, addTrialData }: FinalChoiceBlueOrangeProps) {
  const handleChoice = (choice: string) => {
    const isBlue = choice === "blue"
    const success = isBlue ? true : Math.random() < 0.5
    const points = isBlue ? 50 : (success ? 100 : 0)
    
    addTrialData({
      phase: "final-choice-blue-orange",
      trialNumber: 1,
      condition: "final-choice-blue-orange",
      choice,
      outcome: success,
      points,
    })

    onAdvance()
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center space-y-8">
        <p className="text-xl font-bold text-center">If you only had one choice between these two buttons, which would you prefer?</p>
        <div className="flex space-x-8">
          <Button
            className="w-64 h-64 bg-blue-500 text-white text-2xl hover:bg-blue-500"
            onClick={() => handleChoice("blue")}
          >
          </Button>
          <Button
            className="w-64 h-64 bg-orange-500 text-white text-2xl hover:bg-orange-500"
            onClick={() => handleChoice("orange")}
          >
          </Button>
        </div>
      </div>
    </div>
  )
} 