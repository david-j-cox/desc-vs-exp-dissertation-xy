"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface SecondDescChoiceProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
}

export default function SecondDescChoice({ onAdvance, addTrialData }: SecondDescChoiceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingChoice, setPendingChoice] = useState<null | { choiceIndex: 0 | 1 }>(null)

  const choicePair = {
    left: { stimulus: "stimulus-a", image: "/images/stimulus-a.png" },
    right: { stimulus: "stimulus-b", image: "/images/stimulus-b.png" }
  }

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (isLoading) return
    
    // Record trial data before setting loading state
    const chosenStimulus = choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus
    const otherStimulus = choiceIndex === 0 ? choicePair.right.stimulus : choicePair.left.stimulus
    
    addTrialData({
      phase: "second-desc-choice",
      condition: "second-description-choice",
      stimulus: `${chosenStimulus}-vs-${otherStimulus}`,
      choice: chosenStimulus,
      outcome: undefined, 
      points: 0,
    })

    // Set loading state and advance after a short delay
    setPendingChoice({ choiceIndex })
    setIsLoading(true)
    setTimeout(() => {
      onAdvance()
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
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
                src={choicePair.left.image}
                alt={`Stimulus ${choicePair.left.stimulus}`}
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
                src={choicePair.right.image}
                alt={`Stimulus ${choicePair.right.stimulus}`}
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