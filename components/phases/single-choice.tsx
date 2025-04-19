"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { ExperimentData } from "../experiment"

interface SingleChoiceProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function SingleChoice({ onAdvance, addTrialData }: SingleChoiceProps) {
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<"success" | "failure">("success")

  const handleChoice = (choice: string) => {
    const isCorrect = choice === "A"
    const points = isCorrect ? 100 : 0
    addTrialData({
      phase: "single-choice",
      trialNumber: 1,
      condition: "single",
      choice,
      outcome: isCorrect,
      points,
    })

    if (isCorrect) {
      setShowOutcome(true)
      setOutcome("success")
      setTimeout(() => {
        setShowOutcome(false)
        onAdvance()
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
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {showOutcome ? (
        <div className="text-center">
          <p className={`text-4xl font-bold ${outcome === "success" ? "text-green-600" : "text-red-600"}`}>
            {outcome === "success" ? "✓" : "✗"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <p className="text-xl font-bold">Make your choice</p>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => handleChoice("A")}
          >
            Choose A
          </button>
        </div>
      )}
    </div>
  )
}
