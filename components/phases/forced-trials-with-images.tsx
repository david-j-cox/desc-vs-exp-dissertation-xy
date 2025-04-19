"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ForcedTrialsWithImagesProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
  onFail: () => void
}

interface Stimulus {
  id: string
  probability: number
  color: string
  points: number
  imageUrl: string
}

export default function ForcedTrialsWithImages({ onAdvance, addTrialData, onFail }: ForcedTrialsWithImagesProps) {
  const [currentTrial, setCurrentTrial] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<"success" | "failure">("success")

  const stimuli: Stimulus[] = [
    { id: "A", probability: 1, color: "bg-red-500", points: 50, imageUrl: "/images/stimulus-a.png" },
    { id: "B", probability: 0.5, color: "bg-blue-500", points: 100, imageUrl: "/images/stimulus-b.png" },
    { id: "C", probability: 0.85, color: "bg-green-500", points: 100, imageUrl: "/images/stimulus-c.png" },
    { id: "D", probability: 0.1, color: "bg-purple-500", points: 100, imageUrl: "/images/stimulus-d.png" },
  ]

  const handleChoice = (choice: string) => {
    const isCorrect = choice === "A"
    const points = isCorrect ? 100 : 0
    addTrialData({
      phase: "forced-trials-with-images",
      trialNumber: currentTrial + 1,
      condition: "forced",
      stimulus: stimuli[currentTrial].id,
      choice,
      outcome: isCorrect,
      points,
    })

    if (isCorrect) {
      setShowOutcome(true)
      setOutcome("success")
      setTimeout(() => {
        setShowOutcome(false)
        if (currentTrial < stimuli.length - 1) {
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
        onFail()
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
          <p className="text-xl font-bold">Trial {currentTrial + 1} of {stimuli.length}</p>
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
