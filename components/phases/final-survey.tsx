"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import OSFUploader from "../osf-uploader"
import type { ExperimentData } from "../experiment"

interface FinalSurveyProps {
  onComplete: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
}

export default function FinalSurvey({ onComplete, addTrialData }: FinalSurveyProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null)

  // Load experiment data for OSF upload
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        setExperimentData(JSON.parse(storedData))
      }
    } catch (error) {
      console.error("Error loading data for OSF upload:", error)
    }
  }, [])

  const handleSubmit = () => {
    // Record survey responses with detailed data
    const questions = [
      { number: 1, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-a", type: "probability" as const },
      { number: 2, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-b", type: "probability" as const },
      { number: 3, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-c", type: "probability" as const },
      { number: 4, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-d", type: "probability" as const },
      { number: 5, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-a", type: "consistency" as const },
      { number: 6, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-b", type: "consistency" as const },
      { number: 7, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-c", type: "consistency" as const },
      { number: 8, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-d", type: "consistency" as const },
    ]

    questions.forEach((q, index) => {
      const responseKey = index < 4 ? `q1B${index + 1}` : `q2B${index - 3}`
      addTrialData({
        phase: "final-survey",
        trialNumber: q.number,
        condition: q.text,
        stimulus: q.stimulus,
        choice: responses[responseKey] || "",
        questionType: q.type,
        points: 0,
      })
    })

    // Store Prolific ID in localStorage for data export
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        const data = JSON.parse(storedData)
        data.participantId = responses.prolificId
        localStorage.setItem("experiment-data", JSON.stringify(data))
      }
    } catch (error) {
      console.error("Error updating Prolific ID:", error)
    }

    setSubmitted(true)
    onComplete()
  }

  const renderQuestion = () => {
    switch(currentQuestion) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-a.png" alt="Button 1" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              If you pressed this button 100 times, how many times do you think you would earn points?
            </label>
            <Input
              type="number"
              value={responses.q1B1 || ""}
              onChange={(e) => setResponses({ ...responses, q1B1: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-b.png" alt="Button 2" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              If you pressed this button 100 times, how many times do you think you would earn points?
            </label>
            <Input
              type="number"
              value={responses.q1B2 || ""}
              onChange={(e) => setResponses({ ...responses, q1B2: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-c.png" alt="Button 3" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              If you pressed this button 100 times, how many times do you think you would earn points?
            </label>
            <Input
              type="number"
              value={responses.q1B3 || ""}
              onChange={(e) => setResponses({ ...responses, q1B3: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-d.png" alt="Button 4" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              If you pressed this button 100 times, how many times do you think you would earn points?
            </label>
            <Input
              type="number"
              value={responses.q1B4 || ""}
              onChange={(e) => setResponses({ ...responses, q1B4: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-a.png" alt="Button 1" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              How consistently do you think points are earned from this button?
            </label>
            <Textarea
              value={responses.q2B1 || ""}
              onChange={(e) => setResponses({ ...responses, q2B1: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 6:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-b.png" alt="Button 2" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              How consistently do you think points are earned from this button?
            </label>
            <Textarea
              value={responses.q2B2 || ""}
              onChange={(e) => setResponses({ ...responses, q2B2: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 7:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-c.png" alt="Button 3" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              How consistently do you think points are earned from this button?
            </label>
            <Textarea
              value={responses.q2B3 || ""}
              onChange={(e) => setResponses({ ...responses, q2B3: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 8:
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Image src="/images/stimulus-d.png" alt="Button 4" width={256} height={256} className="w-64 h-64" />
            </div>
            <label className="block font-medium text-center">
              How consistently do you think points are earned from this button?
            </label>
            <Textarea
              value={responses.q2B4 || ""}
              onChange={(e) => setResponses({ ...responses, q2B4: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 9:
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <Image src="/images/stimulus-a.png" alt="Button 1" width={100} height={100} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={100} height={100} />
              <Image src="/images/stimulus-c.png" alt="Button 3" width={100} height={100} />
              <Image src="/images/stimulus-d.png" alt="Button 4" width={100} height={100} />
            </div>
            <label className="block font-medium text-center">
              Which button do you think gives the BEST outcome? (Button 1, Button 2, Button 3, Button 4)
            </label>
            <Input
              value={responses.q3 || ""}
              onChange={(e) => setResponses({ ...responses, q3: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 10:
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <Image src="/images/stimulus-a.png" alt="Button 1" width={100} height={100} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={100} height={100} />
              <Image src="/images/stimulus-c.png" alt="Button 3" width={100} height={100} />
              <Image src="/images/stimulus-d.png" alt="Button 4" width={100} height={100} />
            </div>
            <label className="block font-medium text-center">
              Which button do you think gives the WORST outcome? (Button 1, Button 2, Button 3, Button 4)
            </label>
            <Input
              value={responses.q4 || ""}
              onChange={(e) => setResponses({ ...responses, q4: e.target.value })}
              className="max-w-[200px] mx-auto"
            />
          </div>
        )
      case 11:
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <Image src="/images/stimulus-a.png" alt="Button 1" width={100} height={100} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={100} height={100} />
            </div>
            <label className="block font-medium text-center">
              What strategy did you use to pick between these two buttons?
            </label>
            <Textarea
              value={responses.q5 || ""}
              onChange={(e) => setResponses({ ...responses, q5: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 12:
        return (
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <div className="w-32 h-32 bg-blue-500 rounded-md"></div>
              <div className="w-32 h-32 bg-orange-500 rounded-md"></div>
            </div>
            <label className="block font-medium text-center">
              What strategy did you use to pick between these two buttons?
            </label>
            <Textarea
              value={responses.q6 || ""}
              onChange={(e) => setResponses({ ...responses, q6: e.target.value })}
              className="max-w-[400px] mx-auto"
            />
          </div>
        )
      case 13:
        return (
          <div className="space-y-4">
            <label className="block font-medium text-center">
              Enter Your Prolific ID Here:
            </label>
            <Input
              value={responses.prolificId || ""}
              onChange={(e) => setResponses({ ...responses, prolificId: e.target.value })}
              className="max-w-[400px] mx-auto"
              placeholder="Enter your Prolific ID"
            />
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => {
                  if (responses.prolificId && responses.prolificId.trim()) {
                    handleSubmit()
                    // Close the browser tab
                    window.close()
                  }
                }}
                disabled={!responses.prolificId || !responses.prolificId.trim()}
                className={`px-8 py-3 ${
                  !responses.prolificId || !responses.prolificId.trim() 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Submit Your Prolific ID
              </Button>
            </div>
            {/* Hidden OSF Uploader that will auto-upload when data is available */}
            <div className="hidden">
              <OSFUploader experimentData={experimentData} autoUpload={true} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Final Questions</h1>

      {!submitted ? (
        <div className="space-y-6">
          {renderQuestion()}
          {currentQuestion !== 13 && (
            <div className="flex justify-between">
              <Button
                onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                disabled={currentQuestion === 1}
              >
                Previous
              </Button>
              {currentQuestion < 13 ? (
                <Button
                  onClick={() => setCurrentQuestion(prev => prev + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  Submit Survey
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl">You may now close this window in your browser.</p>
        </div>
      )}
    </div>
  )
}
