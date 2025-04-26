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
}

type ChoicePair = {
  left: { stimulus: string; image: string }
  right: { stimulus: string; image: string }
}

export default function ChoiceTrialsImages({ onAdvance, addTrialData, probabilityPairs, phase, onFail }: ChoiceTrialsImagesProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0)
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
    if (pendingChoice !== null && !isLoading) {
      const currentPair = probabilityPairs[0]
      const selectedProbability = pendingChoice.choiceIndex === 0 ? currentPair.p1 : currentPair.p2
      const choicePair = choicePairs[currentPairIndex]
      
      // Determine outcome based on probability
      const success = Math.random() < selectedProbability

      // Check if the choice was correct
      const isCorrectChoice = (currentPairIndex === 0 && pendingChoice.choiceIndex === 0) || // Should choose A over C
                            (currentPairIndex === 1 && pendingChoice.choiceIndex === 1)    // Should choose B over D
      setCorrectChoices(prev => [...prev, isCorrectChoice])

      // Record trial data with sequential trial number
      addTrialData({
        phase,
        condition: `choice_${choicePair.left.stimulus}_vs_${choicePair.right.stimulus}`,
        stimulus: pendingChoice.choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
        choice: pendingChoice.choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
        outcome: success,
        points: success ? 100 : 0,
      })

      // Reset pending choice
      setPendingChoice(null)

      // Move to next trial or advance phase after delay
      if (currentPairIndex < choicePairs.length - 1) {
        setIsLoading(true)
        setTimeout(() => {
          setCurrentPairIndex((prev) => prev + 1)
          setIsLoading(false)
        }, 1000)
      } else {
        // Check if all choices were correct
        const allCorrect = correctChoices.every(choice => choice)
        if (!allCorrect && typeof onFail === 'function') {
          setIsLoading(true)
          setTimeout(() => {
            onFail()
          }, 500)
        } else {
          onAdvance()
        }
      }
    }
  }, [pendingChoice, currentPairIndex, probabilityPairs, choicePairs, phase, addTrialData, onAdvance, onFail, correctChoices, isLoading])

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (isLoading) return;

    const currentPair = probabilityPairs[0];
    const selectedProbability = choiceIndex === 0 ? currentPair.p1 : currentPair.p2;
    const choicePair = choicePairs[currentPairIndex];
    const success = Math.random() < selectedProbability;

    // Log the trial
    addTrialData({
      phase,
      condition: `choice_${choicePair.left.stimulus}_vs_${choicePair.right.stimulus}`,
      stimulus: choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
      choice: choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
      outcome: success,
      points: success ? 100 : 0,
    });

    // Update state and advance phase as before:
    // If there are more trials, move to the next one after a delay
    if (currentPairIndex < choicePairs.length - 1) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPairIndex((prev) => prev + 1);
        setIsLoading(false);
      }, 1000);
    } else {
      // If this was the last trial, advance to the next phase
      onAdvance();
    }
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