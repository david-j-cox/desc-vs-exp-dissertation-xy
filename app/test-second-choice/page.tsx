"use client"

import { useState, useEffect } from "react"
import SecondDescChoice from "@/components/phases/second-desc-choice"
import FinalSurvey from "@/components/phases/final-survey"
import type { ExperimentData, Phase } from "@/components/experiment"

export default function TestSecondChoicePage() {
  const [trialData, setTrialData] = useState<any[]>([])
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null)
  const [currentPhase, setCurrentPhase] = useState<"choice" | "survey">("choice")

  // Mock function to handle trial data
  const addTrialData = (data: any) => {
    setTrialData(prev => [...prev, data])
    console.log("Added trial data:", data)
    
    // Update localStorage with the new trial data
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        const currentData = JSON.parse(storedData)
        currentData.trials.push({
          ...data,
          timestamp: Date.now()
        })
        localStorage.setItem("experiment-data", JSON.stringify(currentData))
        setExperimentData(currentData)
      }
    } catch (error) {
      console.error("Error updating experiment data:", error)
    }
  }

  // Mock function for advancing
  const handleAdvance = () => {
    console.log("Choice made, advancing to survey...")
    setCurrentPhase("survey")
  }

  // Initialize localStorage with mock data if it doesn't exist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem("experiment-data")
      if (!storedData) {
        const mockData: ExperimentData = {
          participantId: "",
          currentPhase: "second-desc-choice" as Phase,
          trials: [],
          totalPoints: 0
        }
        localStorage.setItem("experiment-data", JSON.stringify(mockData))
        setExperimentData(mockData)
      } else {
        setExperimentData(JSON.parse(storedData))
      }
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Second Description Choice Test Page</h1>
      
      {currentPhase === "choice" ? (
        <SecondDescChoice 
          onAdvance={handleAdvance}
          addTrialData={addTrialData}
          trialNumber={1}
        />
      ) : (
        <FinalSurvey 
          onComplete={() => console.log("Survey completed")}
          addTrialData={addTrialData}
        />
      )}

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Recorded Trial Data:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(trialData, null, 2)}
        </pre>
      </div>
      {experimentData && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Current Experiment Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(experimentData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 