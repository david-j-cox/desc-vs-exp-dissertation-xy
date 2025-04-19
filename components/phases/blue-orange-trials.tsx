"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface BlueOrangeTrialsProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function BlueOrangeTrials({ onAdvance, addTrialData }: BlueOrangeTrialsProps) {
  const [currentTrial, setCurrentTrial] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<"success" | "failure">("success")

  const handleChoice = (choice: string) => {
    const isCorrect = choice === "blue"
    const points = isCorrect ? 100 : 0
    addTrialData({
      phase: "blue-orange-trials",
      trialNumber: currentTrial + 1,
      condition: "choice",
      choice,
      outcome: isCorrect,
      points,
    })

    if (isCorrect) {
      setShowOutcome(true)
      setOutcome("success")
      setTimeout(() => {
        setShowOutcome(false)
        if (currentTrial < 9) {
          setCurrentTrial(currentTrial + 1)
        } else {
          onAdvance()
        }
      }, 2000)
    } else {
      setShowOutcome(true)
      setOutcome("failure")
      setTimeout(() => {
        setShowOutcome(false)
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-8">
      {showOutcome ? (
        <div className="text-center">
          <p className={`text-4xl font-bold ${outcome === "success" ? "text-green-600" : "text-red-600"}`}>
            {outcome === "success" ? "✓" : "✗"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl font-bold">Trial {currentTrial + 1} of 10</p>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={() => handleChoice("blue")}
            >
              Blue
            </button>
            <button
              className="px-4 py-2 text-white bg-orange-500 rounded hover:bg-orange-600"
              onClick={() => handleChoice("orange")}
            >
              Orange
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
