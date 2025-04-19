"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface BlueOrangeTrialsProps {
  onAdvance: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function BlueOrangeTrials({ onAdvance, addTrialData }: BlueOrangeTrialsProps) {
  const [trialCount, setTrialCount] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const totalTrials = 40

  const handleChoice = (choice: "blue" | "orange") => {
    if (showOutcome) return

    // Blue: 100 points with p=0.5
    // Orange: 50 points with p=1.0
    const isBlue = choice === "blue"
    const probability = isBlue ? 0.5 : 1.0
    const points = isBlue ? 100 : 50

    // Determine outcome based on probability
    const success = Math.random() < probability
    setOutcome(success)
    setShowOutcome(true)

    // Record trial data
    addTrialData({
      phase: 4,
      trialNumber: trialCount + 1,
      condition: "blue vs orange",
      choice,
      outcome: success,
      points: success ? points : 0,
    })

    // Show message
    setMessage(success ? `Success! You earned ${points} points.` : "No points this time.")

    // Move to next trial or advance phase after delay
    setTimeout(() => {
      setShowOutcome(false)
      setMessage(null)

      if (trialCount < totalTrials - 1) {
        setTrialCount((prev) => prev + 1)
      } else {
        setMessage("Moving to the next phase...")
        setTimeout(() => {
          onAdvance()
        }, 1500)
      }
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center"></h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-8">
          <Button
            className="w-32 h-32 bg-blue-500 text-white text-2xl"
            onClick={() => handleChoice("blue")}
            disabled={showOutcome}
          >
          </Button>

          <Button
            className="w-32 h-32 bg-orange-500 text-white text-2xl"
            onClick={() => handleChoice("orange")}
            disabled={showOutcome}
          >
          </Button>
        </div>

        {showOutcome && (
          <div className="text-8xl"> 
            {outcome ? "✓" : "✗"}
          </div>
        )}

        {message && <p className="text-4xl font-bold">{message}</p>}
      </div>
    </div>
  )
}
