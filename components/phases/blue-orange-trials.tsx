"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface BlueOrangeTrialsProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
}

export default function BlueOrangeTrials({ onAdvance, addTrialData }: BlueOrangeTrialsProps) {
  const [currentTrial, setCurrentTrial] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<"success" | "failure">("success")
  const [points, setPoints] = useState(0)
  const [buttonOrder, setButtonOrder] = useState<"blue-orange" | "orange-blue">(
    Math.random() < 0.5 ? "blue-orange" : "orange-blue"
  )
  const [shouldAdvancePhase, setShouldAdvancePhase] = useState(false)

  const handleChoice = (choice: string) => {
    const isBlue = choice === "blue"
    const success = isBlue ? true : Math.random() < 0.5
    const points = isBlue ? 50 : (success ? 100 : 0)
    
    addTrialData({
      phase: "blue-orange-trials",
      condition: "blue-orange-trials",
      choice: choice,
      outcome: success,
      points,
    })

    setShowOutcome(true)
    setOutcome(success ? "success" : "failure")
    if (success) {
      setPoints(points)
    }

    setTimeout(() => {
      setShowOutcome(false)
      setButtonOrder(Math.random() < 0.5 ? "blue-orange" : "orange-blue")
      
      if (currentTrial < 40) {
        setCurrentTrial(prev => prev + 1)
      } else {
        setShouldAdvancePhase(true)
      }
    }, 2000)
  }

  useEffect(() => {
    if (shouldAdvancePhase) {
      onAdvance()
      setShouldAdvancePhase(false)
    }
  }, [shouldAdvancePhase, onAdvance])

  return (
    <div className="flex flex-col items-center space-y-8">
      {showOutcome ? (
        <div className="text-center w-32 h-32 flex flex-col items-center justify-center">
          <p className={`text-4xl font-bold ${outcome === "success" ? "text-green-600" : "text-red-600"}`}>
            {outcome === "success" ? "✓" : "✗"}
          </p>
          <p className="text-xl mt-2">
            {outcome === "success" ? `${points} Points Earned` : "No Points Earned"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8">
          <div className="flex gap-8">
            <Button
              variant="outline"
              size="lg"
              className={`w-64 h-64 text-2xl bg-blue-500 text-white hover:bg-blue-500`}
              onClick={() => handleChoice("blue")}
            >
              
            </Button>
            <Button
              variant="outline"
              size="lg"
              className={`w-64 h-64 text-2xl bg-orange-500 text-white hover:bg-orange-500`}
              onClick={() => handleChoice("orange")}
            >
              
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
