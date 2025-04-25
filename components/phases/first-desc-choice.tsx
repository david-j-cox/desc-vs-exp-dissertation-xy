"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface FirstDescChoiceProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function FirstDescChoice({ onAdvance, addTrialData }: FirstDescChoiceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingChoice, setPendingChoice] = useState<null | { choiceIndex: 0 | 1 }>(null)

  const choicePair = {
    left: { stimulus: "stimulus-a", image: "/images/stimulus-a.png" },
    right: { stimulus: "stimulus-b", image: "/images/stimulus-b.png" }
  }

  const handleChoice = (choiceIndex: 0 | 1) => {
    if (isLoading) return
    setPendingChoice({ choiceIndex })
    setIsLoading(true)

    // Record trial data
    addTrialData({
      phase: "first-desc-choice",
      trialNumber: 1,
      condition: "choice_a_vs_b",
      stimulus: choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
      choice: choiceIndex === 0 ? choicePair.left.stimulus : choicePair.right.stimulus,
      points: 0,
    })

    setTimeout(() => {
      onAdvance()
    }, 1500)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-xl font-bold">Next condition loading...</p>
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
            className="w-32 h-32 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
            onClick={() => handleChoice(0)}
            disabled={isLoading}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={choicePair.left.image}
                alt={`Stimulus ${choicePair.left.stimulus}`}
                width={800}
                height={800}
                className="object-contain"
              />
            </div>
          </Button>

          <Button
            className="w-32 h-32 bg-white border border-gray-300 text-white text-2xl relative overflow-hidden"
            onClick={() => handleChoice(1)}
            disabled={isLoading}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={choicePair.right.image}
                alt={`Stimulus ${choicePair.right.stimulus}`}
                width={800}
                height={800}
                className="object-contain"
              />
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
} 