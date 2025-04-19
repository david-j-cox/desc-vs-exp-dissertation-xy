"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ChoiceTrialsProps {
  onAdvance: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp">) => void
  probabilityPairs: { p1: number; p2: number }[]
  phase: number
}

export default function ChoiceTrials({ onAdvance, addTrialData, probabilityPairs, phase }: ChoiceTrialsProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (showOutcome) return

    const currentPair = probabilityPairs[currentPairIndex]
    const selectedProbability = choiceIndex === 0 ? currentPair.p1 : currentPair.p2

    // Determine outcome based on probability
    const success = Math.random() < selectedProbability
    setOutcome(success)
    setShowOutcome(true)

    // Record trial data
    addTrialData({
      phase,
      trialNumber: currentPairIndex + 1,
      condition: `final_probability_choice_p${currentPair.p1}_vs_p${currentPair.p2}`,
      stimulus: choiceIndex === 0 ? "stimulus-a" : "stimulus-c",
      choice: choiceIndex === 0 ? "left" : "right",
      outcome: success,
      points: success ? 100 : 0,
    })

    // Move to next trial or advance phase after delay
    setTimeout(() => {
      setShowOutcome(false)
      setMessage(null)

      if (currentPairIndex < probabilityPairs.length - 1) {
        setCurrentPairIndex((prev) => prev + 1)
      } else {
        setMessage("Moving to the next phase...")
        setTimeout(() => {
          onAdvance()
        }, 1500)
      }
    }, 1000)
  }

  const currentPair = probabilityPairs[currentPairIndex]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Choice Trial</h1>

      <div className="text-center mb-4">
        <p>Which would you prefer?</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        {!showOutcome && (
          <div className="flex space-x-8">
            <Button
              className="w-32 h-32 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
              onClick={() => handleChoice(0)}
              disabled={showOutcome}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/stimulus-a.png"
                  alt="Stimulus A"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </Button>

            <Button
              className="w-32 h-32 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
              onClick={() => handleChoice(1)}
              disabled={showOutcome}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/stimulus-c.png"
                  alt="Stimulus C"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </Button>
          </div>
        )}

        {message && <p className="text-lg">{message}</p>}
      </div>
    </div>
  )
}
