"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ForcedTrialsWithImagesProps {
  onAdvance: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp" | "trialNumber">) => void
  onFail: () => void
  setExperimentData: (callback: (prev: ExperimentData) => ExperimentData) => void
  experimentData: ExperimentData
}

interface Stimulus {
  id: string
  probability: number
  color: string
  points: number
  imageUrl: string
}

// Define the exact outcomes for each trial of each stimulus
const TRIAL_OUTCOMES: Record<string, boolean[]> = {
  A: [true, true, true, true, true, true, true, true, true, true], // 10 trials, all true
  B: [true, false, false, true, true, false, true, false, true, false], // 10 trials, 5 true
  C: [true, false, false, true, false, false, false, true, false, false], // 10 trials, 3 true
  D: [false, false, false, false, false, true, false, false, false, false], // 10 trials, 1 true
}

export default function ForcedTrialsWithImages({ onAdvance, addTrialData, onFail, setExperimentData, experimentData }: ForcedTrialsWithImagesProps) {
  const [currentTrial, setCurrentTrial] = useState(0)
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<"success" | "failure">("success")
  const [isLoading, setIsLoading] = useState(false)
  const [shouldAdvancePhase, setShouldAdvancePhase] = useState(false)

  const TRIALS_PER_STIMULUS = 10
  const TOTAL_TRIALS = TRIALS_PER_STIMULUS * 4 // 4 stimuli, 10 trials each

  const stimuli: Stimulus[] = [
    { id: "A", probability: 1, color: "bg-red-500", points: -50, imageUrl: "/images/stimulus-a.png" },
    { id: "B", probability: 0.5, color: "bg-blue-500", points: -100, imageUrl: "/images/stimulus-b.png" },
    { id: "C", probability: 0.3, color: "bg-green-500", points: -100, imageUrl: "/images/stimulus-c.png" },
    { id: "D", probability: 0.1, color: "bg-purple-500", points: -100, imageUrl: "/images/stimulus-d.png" },
  ]

  const handleChoice = () => {
    if (showOutcome || isLoading) return

    const currentStimulus = stimuli[currentStimulusIndex]
    const trialInBlock = currentTrial % TRIALS_PER_STIMULUS
    const isCorrect = TRIAL_OUTCOMES[currentStimulus.id][trialInBlock]
    const points = isCorrect ? currentStimulus.points : 0

    // Record data with sequential trial number
    addTrialData({
      phase: "forced-trials-with-images",
      condition: "forced-trials-with-images",
      stimulus: currentStimulus.id,
      choice: currentStimulus.id,
      outcome: isCorrect,
      points,
    })

    setShowOutcome(true)
    setOutcome(isCorrect ? "success" : "failure")

    setTimeout(() => {
      setShowOutcome(false)
      if (currentTrial < TOTAL_TRIALS - 1) {
        const nextTrial = currentTrial + 1
        // Check if we need to move to the next stimulus
        if (nextTrial % TRIALS_PER_STIMULUS === 0 && nextTrial < TOTAL_TRIALS) {
          setIsLoading(true)
          setTimeout(() => {
            // Reset points when moving to a new stimulus
            setExperimentData((prev: ExperimentData) => ({
              ...prev,
              totalPoints: 0
            }))
            setCurrentStimulusIndex(prev => prev + 1)
            setCurrentTrial(nextTrial)
            setIsLoading(false)
          }, 3000)
        } else {
          setCurrentTrial(nextTrial)
        }
      } else {
        // At the end of the 40 total trials, reset totalPoints to 0
        setExperimentData((prev: ExperimentData) => ({
          ...prev,
          totalPoints: 0
        }))
        setShouldAdvancePhase(true)
      }
    }, 1000)
  }

  const currentStimulus = stimuli[currentStimulusIndex]
  const trialsInCurrentBlock = (currentTrial % TRIALS_PER_STIMULUS) + 1
  
  useEffect(() => {
    if (shouldAdvancePhase) {
      onAdvance()
      setShouldAdvancePhase(false)
    }
  }, [shouldAdvancePhase, onAdvance])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-xl font-bold">Next image loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px]">
      {showOutcome ? (
        <div className="text-center">
          <p className={`text-4xl font-bold ${outcome === "success" ? "text-red-600" : "text-green-600"}`}>
            {outcome === "success" ? "✗" : "✓"}
          </p>
          <p className="text-xl mt-2">
            {outcome === "success" ? `${Math.abs(currentStimulus.points)} Points Lost` : "No Points Lost"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div 
            className="relative w-64 h-64 mb-4 cursor-pointer"
            onClick={handleChoice}
          >
            <Image
              src={currentStimulus.imageUrl}
              alt={`Stimulus ${currentStimulus.id}`}
              width={256}
              height={256}
              className="w-64 h-64 object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  )
}
