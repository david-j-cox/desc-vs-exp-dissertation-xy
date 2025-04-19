"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface ForcedBlueAndOrangeProps {
  onAdvance: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

interface ButtonConfig {
  id: string
  color: string
  probability: number
  points: number
}

export default function ForcedBlueAndOrange({ onAdvance, addTrialData }: ForcedBlueAndOrangeProps) {
  const buttons: ButtonConfig[] = [
    { id: "blue", color: "bg-blue-500", probability: 0.5, points: 100 },
    { id: "orange", color: "bg-orange-500", probability: 1.0, points: 50 },
  ]

  const [currentButtonIndex, setCurrentButtonIndex] = useState(0)
  const [trialCount, setTrialCount] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const trialsPerButton = 10

  const currentButton = buttons[currentButtonIndex]

  const handleButtonClick = () => {
    if (showOutcome) return

    // Determine outcome based on probability
    const success = Math.random() < currentButton.probability
    setOutcome(success)
    setShowOutcome(true)

    // Record trial data
    addTrialData({
      phase: "forced-blue-and-orange",
      trialNumber: trialCount + 1,
      condition: `forced_${currentButton.id}`,
      stimulus: currentButton.id,
      choice: currentButton.id,
      outcome: success,
      points: success ? currentButton.points : 0,
    })

    // Show message
    setMessage(success ? `Success! You earned ${currentButton.points} points.` : "No points this time.")

    // Move to next trial after delay
    setTimeout(() => {
      setShowOutcome(false)
      setMessage(null)

      if (trialCount < trialsPerButton - 1) {
        // Continue with current button
        setTrialCount(prev => prev + 1)
      } else if (currentButtonIndex < buttons.length - 1) {
        // Move to next button
        setCurrentButtonIndex(prev => prev + 1)
        setTrialCount(0)
      } else {
        // All buttons completed
        setMessage("Moving to the next phase...")
        setTimeout(onAdvance, 1500)
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center"></h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          className={`w-32 h-32 ${currentButton.color} text-white text-2xl`}
          onClick={handleButtonClick}
          disabled={showOutcome}
        >
        </Button>

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