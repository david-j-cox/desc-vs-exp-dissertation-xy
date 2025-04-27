"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"
import { useRouter } from "next/navigation"

interface ForcedBlueAndOrangeProps {
  onAdvance: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
  setExperimentData: (data: ExperimentData) => void
  experimentData: ExperimentData
}

interface ButtonConfig {
  id: string
  color: string
  probability: number
  points: number
}

export default function ForcedBlueAndOrange({ onAdvance, addTrialData, setExperimentData, experimentData }: ForcedBlueAndOrangeProps) {
  const router = useRouter()
  const buttons: ButtonConfig[] = [
    { id: "blue", color: "bg-blue-500", probability: 1.0, points: 50 },
    { id: "orange", color: "bg-orange-500", probability: 0.5, points: 100 },
  ]

  const [currentButtonIndex, setCurrentButtonIndex] = useState(0)
  const [trialCount, setTrialCount] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const trialsPerButton = 10
  const [shouldAdvancePhase, setShouldAdvancePhase] = useState(false)

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
      condition: `forced_${currentButton.id}`,
      stimulus: currentButton.id,
      choice: currentButton.id,
      outcome: success,
      points: success ? currentButton.points : 0,
    })

    // Move to next trial after delay
    setTimeout(() => {
      setShowOutcome(false)
      setMessage(null)

      if (trialCount < trialsPerButton - 1) {
        // Continue with current button
        setTrialCount(prev => prev + 1)
      } else if (currentButtonIndex < buttons.length - 1) {
        // Move to next button
        setIsLoading(true)
        setTimeout(() => {
          // Reset points when moving to the next button
          const newData: ExperimentData = {
            ...experimentData,
            totalPoints: 0
          }
          setExperimentData(newData)
          setCurrentButtonIndex(prev => prev + 1)
          setTrialCount(0)
          setIsLoading(false)
        }, 3000)
      } else {
        // All trials completed
        setShouldAdvancePhase(true)
      }
    }, 1500)
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
        <p className="text-xl font-bold">Next color loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center"></h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        {!showOutcome ? (
          <Button
            className={`w-64 h-64 ${currentButton.color} text-white text-2xl hover:bg-currentButton.color`}
            onClick={handleButtonClick}
            disabled={showOutcome}
          >
          </Button>
        ) : (
          <div className="text-center w-64 h-64 flex flex-col items-center justify-center">
            <p className={`text-4xl font-bold ${outcome ? "text-green-600" : "text-red-600"}`}>
              {outcome ? "✓" : "✗"}
            </p>
            <p className="text-xl mt-2">
              {outcome ? `${currentButton.points} Points Earned` : "No Points Earned"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 