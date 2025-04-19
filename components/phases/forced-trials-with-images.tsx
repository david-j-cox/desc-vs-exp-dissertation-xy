"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { ExperimentData } from "../experiment"

interface ForcedTrialsProps {
  onAdvance: () => void
  onFail: () => void
  addTrialData: (data: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

type Stimulus = {
  id: string
  probability: number
  color: string
  points: number
  imageUrl: string
}

export default function ForcedTrialsWithImages({ onAdvance, onFail, addTrialData }: ForcedTrialsProps) {
  const stimuli: Stimulus[] = [
    { id: "A", probability: 1, color: "bg-red-500", points: 100, imageUrl: "/images/stimulus-a.png" },
    { id: "B", probability: 0.85, color: "bg-green-500", points: 100, imageUrl: "/images/stimulus-b.png" },
    { id: "C", probability: 0.5, color: "bg-yellow-500", points: 100, imageUrl: "/images/stimulus-c.png" },
    { id: "D", probability: 0.1, color: "bg-purple-500", points: 100, imageUrl: "/images/stimulus-d.png" },
  ]

  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0)
  const [trialCount, setTrialCount] = useState<Record<string, number>>({
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  })
  const [stage, setStage] = useState<"forced" | "choice">("forced")
  const [choiceTrials, setChoiceTrials] = useState<number>(0)
  const [message, setMessage] = useState<string | null>(null)
  const [showOutcome, setShowOutcome] = useState(false)
  const [outcome, setOutcome] = useState<boolean>(false)
  const [choicePairs, setChoicePairs] = useState<[Stimulus, Stimulus][]>([])
  const [needsRepeat, setNeedsRepeat] = useState(false)
  const [currentStimulus, setCurrentStimulus] = useState<Stimulus | null>(null)

  // Initialize the first stimulus
  useEffect(() => {
    if (stage === "forced") {
      // Start with the first stimulus
      setCurrentStimulus(stimuli[currentStimulusIndex])
    } else if (stage === "choice" && choicePairs.length === 0) {
      // Set up the choice pairs
      setChoicePairs([
        [stimuli[0], stimuli[1]], // p=1 vs p=0.85
        [stimuli[2], stimuli[3]], // p=0.5 vs p=0.1
      ])
    }
  }, [stage, currentStimulusIndex])

  const handleStimulusClick = () => {
    if (!currentStimulus || showOutcome) return

    // Determine outcome based on probability
    const success = Math.random() < currentStimulus.probability
    setOutcome(success)
    setShowOutcome(true)

    // Record trial data
    addTrialData({
      phase: 3,
      trialNumber: trialCount[currentStimulus.id] + 1,
      stimulus: currentStimulus.id,
      outcome: success,
      points: success ? currentStimulus.points : 0,
    })

    // Update trial count
    const newTrialCount = {
      ...trialCount,
      [currentStimulus.id]: trialCount[currentStimulus.id] + 1,
    }
    setTrialCount(newTrialCount)

    // Show message
    setMessage(success ? `Success! You earned ${currentStimulus.points} points.` : "No points this time.")

    // Move to next trial after delay
    setTimeout(() => {
      if (newTrialCount[currentStimulus.id] >= 10) {
        // Move to the next stimulus if we've completed 10 trials
        const nextIndex = currentStimulusIndex + 1
        if (nextIndex < stimuli.length) {
          setCurrentStimulusIndex(nextIndex)
          setCurrentStimulus(stimuli[nextIndex])
        } else {
          // All stimuli have had 10 trials, move to choice stage
          setStage("choice")
        }
      }
      setShowOutcome(false)
      setMessage(null)
    }, 1500)
  }

  const handleChoiceClick = (choiceIndex: number) => {
    if (choiceTrials >= choicePairs.length || showOutcome) return

    const currentPair = choicePairs[choiceTrials]
    const selectedStimulus = currentPair[choiceIndex]
    const otherStimulus = currentPair[1 - choiceIndex]

    // Determine if choice was correct (higher probability)
    const correctChoice = selectedStimulus.probability >= otherStimulus.probability

    // Determine outcome based on probability but don't show it
    const success = Math.random() < selectedStimulus.probability

    // Record trial data
    addTrialData({
      phase: 3,
      trialNumber: choiceTrials + 1,
      condition: "choice",
      stimulus: `${currentPair[0].id} vs ${currentPair[1].id}`,
      choice: selectedStimulus.id,
      outcome: success,
      points: success ? selectedStimulus.points : 0,
    })

    // Store whether choice was correct
    if (!correctChoice) {
      // If any choice is incorrect, we'll need to repeat phase 2
      setNeedsRepeat(true)
    }

    // No outcome feedback for choice trials
    setShowOutcome(true)
    setMessage("Choice recorded")

    // Move to next trial after delay
    setTimeout(() => {
      setShowOutcome(false)
      setMessage(null)

      if (choiceTrials < choicePairs.length - 1) {
        setChoiceTrials((prev) => prev + 1)
      } else {
        // Check if we need to repeat phase 2
        if (needsRepeat) {
          setMessage("You need to repeat the learning phase.")
          setTimeout(() => {
            // Reset for repeating phase 2
            setCurrentStimulusIndex(0)
            setTrialCount({ A: 0, B: 0, C: 0, D: 0 })
            setStage("forced")
            setChoiceTrials(0)
            setNeedsRepeat(false)
            setChoicePairs([])
            onFail()
          }, 2000)
        } else {
          setMessage("Great job! Moving to the next phase.")
          setTimeout(() => {
            onAdvance()
          }, 2000)
        }
      }
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">{stage === "forced" ? "" : ""}</h1>

      <div className="text-center mb-4">
        {stage === "forced" && (
          <p>
          </p>
        )}
        {stage === "choice" && <p>Which would you prefer?</p>}
      </div>

      {stage === "forced" && currentStimulus && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Button
            className={`w-32 h-32 bg-white text-white text-2xl relative overflow-hidden border border-gray-300`}
            onClick={handleStimulusClick}
            disabled={showOutcome}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={currentStimulus.imageUrl || "/placeholder.svg"}
                alt={`Stimulus ${currentStimulus.id}`}
                width={100}
                height={100}
                className="object-contain"
              />
            </div>
          </Button>
        </div>
      )}

      {stage === "choice" && choiceTrials < choicePairs.length && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-8">
            {choicePairs[choiceTrials].map((stimulus, index) => (
              <Button
                key={stimulus.id}
                className={`w-32 h-32 bg-white text-white text-2xl relative overflow-hidden border border-gray-300`}
                onClick={() => handleChoiceClick(index)}
                disabled={showOutcome}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={stimulus.imageUrl || "/placeholder.svg"}
                    alt={`Stimulus ${stimulus.id}`}
                    width={100}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Single message display for all states */}
      {message && (
        <div className="text-center mt-8">
          <div className="text-4xl font-bold">
            {message}
          </div>
        </div>
      )}
    </div>
  )
}
