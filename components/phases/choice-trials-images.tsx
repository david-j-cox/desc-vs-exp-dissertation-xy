"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ChoiceTrialsImagesProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
  probabilityPairs: { p1: number; p2: number }[]
  phase: ExperimentData["currentPhase"]
  onFail?: (() => void) | undefined
}

type ChoicePair = {
  left: { stimulus: string; image: string }
  right: { stimulus: string; image: string }
}

export default function ChoiceTrialsImages({ onAdvance, addTrialData, probabilityPairs, phase, onFail }: ChoiceTrialsImagesProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingChoice, setPendingChoice] = useState<null | { choiceIndex: 0 | 1 }>(null)
  const [correctChoices, setCorrectChoices] = useState<boolean[]>([])

  const choicePairs: ChoicePair[] = [
    {
      left: { stimulus: "stimulus-a", image: "/images/stimulus-a.png" },
      right: { stimulus: "stimulus-c", image: "/images/stimulus-c.png" }
    },
    {
      left: { stimulus: "stimulus-d", image: "/images/stimulus-d.png" },
      right: { stimulus: "stimulus-b", image: "/images/stimulus-b.png" }
    }
  ]

  useEffect(() => {
    if (pendingChoice !== null) {
      const currentPair = probabilityPairs[0]
      const selectedProbability = pendingChoice.choiceIndex === 0 ? currentPair.p1 : currentPair.p2
      const choicePair = choicePairs[currentPairIndex]
      
      // Determine outcome based on probability
      const success = Math.random() < selectedProbability
      setOutcome(success)
      setShowOutcome(true)

      // Check if the choice was correct
      const isCorrectChoice = (currentPairIndex === 0 && pendingChoice.choiceIndex === 0) || // Should choose A over C
                            (currentPairIndex === 1 && pendingChoice.choiceIndex === 1)    // Should choose B over D
      setCorrectChoices(prev => [...prev, isCorrectChoice])

      // Record trial data
      addTrialData({
        phase,
        trialNumber: currentPairIndex + 1,
        condition: `choice_${choicePair.left.stimulus}_vs_${choicePair.right.stimulus}`,
        stimulus: pendingChoice.choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
        choice: pendingChoice.choiceIndex === 0 ? "left" : "right",
        outcome: success,
        points: success ? 100 : 0,
      })

      // Reset pending choice
      setPendingChoice(null)

      // Move to next trial or advance phase after delay
      setTimeout(() => {
        setShowOutcome(false)
        setMessage(null)

        if (currentPairIndex < choicePairs.length - 1) {
          setIsLoading(true)
          setTimeout(() => {
            setCurrentPairIndex((prev) => prev + 1)
            setIsLoading(false)
          }, 3000)
        } else {
          // Check if all choices were correct
          const allCorrect = correctChoices.every(choice => choice)
          if (!allCorrect && typeof onFail === 'function') {
            setIsLoading(true)
            setTimeout(() => {
              onFail()
            }, 1500)
          } else {
            setIsLoading(true)
            setMessage("Moving to the next phase...")
            setTimeout(() => {
              onAdvance()
            }, 1500)
          }
        }
      }, 1000)
    }
  }, [pendingChoice, currentPairIndex, probabilityPairs, choicePairs, phase, addTrialData, onAdvance, onFail, correctChoices])

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (showOutcome) return
    setPendingChoice({ choiceIndex })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-xl font-bold">Next choice loading...</p>
      </div>
    )
  }

  const currentChoicePair = choicePairs[currentPairIndex]

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-2xl font-medium">Which would you prefer?</p>
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
                  src={currentChoicePair.left.image}
                  alt={`Stimulus ${currentChoicePair.left.stimulus}`}
                  width={800}
                  height={800}
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
                  src={currentChoicePair.right.image}
                  alt={`Stimulus ${currentChoicePair.right.stimulus}`}
                  width={800}
                  height={800}
                  className="object-contain"
                />
              </div>
            </Button>
          </div>
        )}

        {showOutcome && (
          <div className="text-center">
            <p className={`text-4xl font-bold ${outcome ? "text-green-600" : "text-red-600"}`}>
              {outcome ? "✓" : "✗"}
            </p>
          </div>
        )}

        {message && <p className="text-lg">{message}</p>}
      </div>
    </div>
  )
} 