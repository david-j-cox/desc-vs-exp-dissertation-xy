"use client"

import { useState } from "react"
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
export type ExperimentData = {
  participantId: string
  currentPhase: number
  trials: {
    phase: number
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
    currentPhase: 1,
    trials: [],
    totalPoints: 0,
  })

  const [currentPhase, setCurrentPhase] = useState<number>(() => experimentData.currentPhase)

  // Only update experimentData when phase changes, but avoid the circular dependency
  const updatePhase = (newPhase: number) => {
    // Reset points when advancing to a new phase
    setCurrentPhase(newPhase)
    setExperimentData((prev) => ({
      ...prev,
      currentPhase: newPhase,
      totalPoints: 0, // Reset points between phases
    }))
  }

  // Replace all instances of setCurrentPhase with updatePhase
  const advancePhase = () => {
    updatePhase(currentPhase + 1)
  }

  const repeatPhase2 = () => {
    updatePhase(2)
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

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      {/* Only show Total Points during phases 3-7 */}
      {(currentPhase >= 3 && currentPhase <= 7) && (
        <div className="mb-4 text-center">
          <p className="text-4xl font-bold text-black-900">Total Points: {experimentData.totalPoints}</p>
        </div>
      )}

      {currentPhase === 1 && <ConsentPage onAdvance={advancePhase} />}

      {currentPhase === 2 && <InstructionsPage onAdvance={advancePhase} />}

      {currentPhase === 3 && (
        <ForcedTrialsWithImages onAdvance={advancePhase} addTrialData={addTrialData} onFail={repeatPhase2} />
      )}

      {currentPhase === 4 && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === 5 && (
        <ChoiceTrials
          onAdvance={advancePhase}
          addTrialData={addTrialData}
          probabilityPairs={[{ p1: 1, p2: 0.5 }]}
          phase={4}
        />
      )}

      {currentPhase === 6 && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === 7 && (
        <ForcedBlueAndOrange onAdvance={advancePhase} addTrialData={addTrialData} />
      )}

      {currentPhase === 8 && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === 9 && <BlueOrangeTrials onAdvance={advancePhase} addTrialData={addTrialData} />}

      {currentPhase === 10 && <InterConditionInterval onComplete={advancePhase} />}

      {currentPhase === 11 && <SingleChoice onAdvance={advancePhase} addTrialData={addTrialData} />}

      {currentPhase === 12 && (
        <ChoiceTrials
          onAdvance={advancePhase}
          addTrialData={addTrialData}
          probabilityPairs={[{ p1: 1, p2: 0.5 }]}
          phase={8}
        />
      )}

      {currentPhase === 13 && (
        <FinalSurvey
          onComplete={() => {
            alert("Experiment completed! Thank you for your participation.")
            // Reset experiment for future use
            setExperimentData({
              participantId: Math.random().toString(36).substring(2, 15),
              currentPhase: 1,
              trials: [],
              totalPoints: 0,
            })
            setCurrentPhase(1)
            onComplete?.()
          }}
          addTrialData={addTrialData}
        />
      )}
    </div>
  )
}
