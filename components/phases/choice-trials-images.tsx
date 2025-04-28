"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ChoiceTrialsImagesProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
  probabilityPairs: { p1: number; p2: number }[]
  phase: ExperimentData["currentPhase"]
  onFail?: (() => void) | undefined
  attemptCount?: number
  maxAttempts?: number
  setExperimentData: (callback: (prev: ExperimentData) => ExperimentData) => void
}

type ChoicePair = {
  left: { stimulus: string; image: string }
  right: { stimulus: string; image: string }
}

export default function ChoiceTrialsImages({ 
  onAdvance, 
  addTrialData, 
  probabilityPairs, 
  phase, 
  onFail,
  attemptCount = 0,
  maxAttempts = 5,
  setExperimentData
}: ChoiceTrialsImagesProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingChoice, setPendingChoice] = useState<null | { choiceIndex: 0 | 1 }>(null)
  const [currentAttemptChoices, setCurrentAttemptChoices] = useState<boolean[]>([])
  const [shouldAdvancePhase, setShouldAdvancePhase] = useState(false)

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
    if (shouldAdvancePhase) {
      // If we've hit max attempts and not all correct, update phase to final survey
      if (attemptCount >= maxAttempts - 1 && !currentAttemptChoices.every(choice => choice)) {
        // Update the experiment phase to final-survey and call onFail
        setExperimentData((prev) => ({
          ...prev,
          currentPhase: "final-survey"
        }))
        if (onFail) {
          onFail()
        }
      } else {
        // Only advance normally if we haven't hit max attempts or all choices were correct
        onAdvance()
      }
      setShouldAdvancePhase(false)
    }
  }, [shouldAdvancePhase, onAdvance, attemptCount, maxAttempts, currentAttemptChoices, setExperimentData, onFail])

  useEffect(() => {
    if (pendingChoice !== null && !isLoading) {
      const currentPair = probabilityPairs[0]
      const selectedProbability = pendingChoice.choiceIndex === 0 ? currentPair.p1 : currentPair.p2
      const choicePair = choicePairs[currentPairIndex]
      
      // Determine outcome based on probability
      const success = Math.random() < selectedProbability

      // Check if the choice was correct
      const isCorrectChoice = (currentPairIndex === 0 && pendingChoice.choiceIndex === 0) || // Should choose A over C
                            (currentPairIndex === 1 && pendingChoice.choiceIndex === 1)    // Should choose B over D
      setCurrentAttemptChoices(prev => [...prev, isCorrectChoice])

      // Record trial data with sequential trial number
      addTrialData({
        phase,
        condition: "choice-trials-images",
        stimulus: `choice_${choicePair.left.stimulus}_vs_${choicePair.right.stimulus}`,
        choice: pendingChoice.choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
        outcome: success,
        points: success ? 0 : 0,
      })

      // Reset pending choice
      setPendingChoice(null)

      // Move to next trial or handle completion
      if (currentPairIndex < choicePairs.length - 1) {
        setIsLoading(true)
        setTimeout(() => {
          setCurrentPairIndex((prev) => prev + 1)
          setIsLoading(false)
        }, 1000)
      } else {
        // Check if all choices in current attempt were correct
        const allCorrect = [...currentAttemptChoices, isCorrectChoice].every(choice => choice)
        
        setIsLoading(true)
        setTimeout(() => {
          if (!allCorrect && attemptCount >= maxAttempts - 1) {
            // If this was the last attempt and not all correct, go to final survey
            setExperimentData((prev) => ({
              ...prev,
              currentPhase: "final-survey"
            }))
            if (onFail) {
              onFail()
            }
          } else if (!allCorrect) {
            // If not all correct but attempts remain, reset and try again
            setCurrentAttemptChoices([])
            setCurrentPairIndex(0)
            if (onFail) {
              onFail()
            }
          } else {
            // All correct, advance normally
            setShouldAdvancePhase(true)
          }
          setIsLoading(false)
        }, 500)
      }
    }
  }, [pendingChoice, currentPairIndex, probabilityPairs, choicePairs, phase, addTrialData, currentAttemptChoices, isLoading, attemptCount, maxAttempts, setExperimentData, onFail])

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (isLoading) return;
    setPendingChoice({ choiceIndex });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-xl font-bold">Next choice loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-2xl font-medium">Which would you prefer?</p>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="flex space-x-8">
          <Button
            className="w-64 h-64 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
            onClick={() => handleChoice(0)}
            disabled={isLoading}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={choicePairs[currentPairIndex].left.image}
                alt={`Stimulus ${choicePairs[currentPairIndex].left.stimulus}`}
                width={256}
                height={256}
                className="w-64 h-64 object-contain"
              />
            </div>
          </Button>

          <Button
            className="w-64 h-64 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
            onClick={() => handleChoice(1)}
            disabled={isLoading}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={choicePairs[currentPairIndex].right.image}
                alt={`Stimulus ${choicePairs[currentPairIndex].right.stimulus}`}
                width={256}
                height={256}
                className="w-64 h-64 object-contain"
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
} 