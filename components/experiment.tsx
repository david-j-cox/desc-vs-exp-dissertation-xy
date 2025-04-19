"use client"

import { useState, useEffect } from "react"
import ConsentPage from "./phases/consent-page"
import InstructionsPage from "./phases/instructions-page"
import ForcedTrialsWithImages from "./phases/forced-trials-with-images"
import ChoiceTrials from "./phases/choice-trials"
import ForcedBlueAndOrange from "./phases/forced-blue-and-orange"
import BlueOrangeTrials from "./phases/blue-orange-trials"
import SingleChoice from "./phases/single-choice"
import FinalSurvey from "./phases/final-survey"
import InterConditionInterval from "./phases/inter-condition-interval"
import { useLocalStorage } from "@/hooks/use-local-storage"

export type Phase = 
  | "consent"
  | "instructions"
  | "forced-trials-with-images"
  | "forced-trials-with-images-interval"
  | "choice-trials"
  | "choice-trials-interval"
  | "forced-blue-and-orange"
  | "forced-blue-and-orange-interval"
  | "blue-orange-trials"
  | "blue-orange-trials-interval"
  | "single-choice"
  | "final-choice-trials"
  | "final-survey"

export type ExperimentData = {
  participantId: string
  currentPhase: Phase
  trials: {
    phase: Phase
    trialNumber: number
    condition?: string
    stimulus?: string
    choice?: string
    outcome?: boolean
    points?: number
    timestamp: number
  }[]
  totalPoints: number
}

export default function Experiment({ onComplete }: { onComplete?: () => void }) {
  const [experimentData, setExperimentData] = useLocalStorage<ExperimentData>("experiment-data", {
    participantId: Math.random().toString(36).substring(2, 15),
    currentPhase: "consent",
    trials: [],
    totalPoints: 0,
  })

  const [currentPhase, setCurrentPhase] = useState<Phase>(() => experimentData.currentPhase)

  const updatePhase = (newPhase: Phase) => {
    setCurrentPhase(newPhase)
    setExperimentData((prev) => ({
      ...prev,
      currentPhase: newPhase,
      totalPoints: 0,
    }))
  }

  const advancePhase = () => {
    const phases: Phase[] = [
      "consent",
      "instructions",
      "forced-trials-with-images",
      "forced-trials-with-images-interval",
      "choice-trials",
      "choice-trials-interval",
      "forced-blue-and-orange",
      "forced-blue-and-orange-interval",
      "blue-orange-trials",
      "blue-orange-trials-interval",
      "single-choice",
      "final-choice-trials",
      "final-survey"
    ]
    const currentIndex = phases.indexOf(currentPhase)
    if (currentIndex < phases.length - 1) {
      updatePhase(phases[currentIndex + 1])
    }
  }

  const repeatPhase2 = () => {
    updatePhase("instructions")
  }

  const addTrialData = (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => {
    setExperimentData((prev) => ({
      ...prev,
      trials: [
        ...prev.trials,
        {
          ...trialData,
          timestamp: Date.now(),
        },
      ],
      totalPoints: prev.totalPoints + (trialData.points || 0),
    }))
  }

  useEffect(() => {
    if (currentPhase === "blue-orange-trials") {
      console.log("Current phase:", currentPhase, "Total Points:", experimentData.totalPoints)
    }
  }, [currentPhase, experimentData.totalPoints])

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Only show Total Points during specific phases */}
      {(currentPhase === "forced-trials-with-images" || 
        currentPhase === "choice-trials" || 
        currentPhase === "forced-blue-and-orange" || 
        currentPhase === "blue-orange-trials" || 
        currentPhase === "single-choice") && (
        <div className="mb-4 text-center">
          <p className="text-4xl font-bold text-black-900">Total Points: {experimentData.totalPoints}</p>
        </div>
      )}

      {currentPhase === "consent" && <ConsentPage onAdvance={advancePhase} />}

      {currentPhase === "instructions" && <InstructionsPage onAdvance={advancePhase} />}

      {currentPhase === "forced-trials-with-images" && (
        <ForcedTrialsWithImages onAdvance={advancePhase} addTrialData={addTrialData} onFail={repeatPhase2} />
      )}

      {currentPhase === "forced-trials-with-images-interval" && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === "choice-trials" && (
        <ChoiceTrials
          onAdvance={advancePhase}
          addTrialData={addTrialData}
          probabilityPairs={[{ p1: 1, p2: 0.5 }]}
          phase="choice-trials"
        />
      )}

      {currentPhase === "choice-trials-interval" && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === "forced-blue-and-orange" && (
        <ForcedBlueAndOrange onAdvance={advancePhase} addTrialData={addTrialData} />
      )}

      {currentPhase === "forced-blue-and-orange-interval" && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === "blue-orange-trials" && <BlueOrangeTrials onAdvance={advancePhase} addTrialData={addTrialData} />}

      {currentPhase === "blue-orange-trials-interval" && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === "single-choice" && <SingleChoice onAdvance={advancePhase} addTrialData={addTrialData} />}

      {currentPhase === "final-choice-trials" && (
        <ChoiceTrials
          onAdvance={advancePhase}
          addTrialData={addTrialData}
          probabilityPairs={[{ p1: 1, p2: 0.5 }]}
          phase="final-choice-trials"
        />
      )}

      {currentPhase === "final-survey" && (
        <FinalSurvey
          onComplete={() => {
            alert("Experiment completed! Thank you for your participation.")
            setExperimentData({
              participantId: Math.random().toString(36).substring(2, 15),
              currentPhase: "consent",
              trials: [],
              totalPoints: 0,
            })
            setCurrentPhase("consent")
            onComplete?.()
          }}
          addTrialData={addTrialData}
        />
      )}
    </div>
  )
}
