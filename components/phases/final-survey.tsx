"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import OSFUploader from "../osf-uploader"
import type { ExperimentData } from "../experiment"

interface FinalSurveyProps {
  onComplete: () => void
  addTrialData: (trialData: Omit<ExperimentData["trials"][0], "timestamp">) => void
  currentTrialNumber: number
}

export default function FinalSurvey({ onComplete, addTrialData, currentTrialNumber }: FinalSurveyProps) {
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [experimentData, setExperimentData] = useState<ExperimentData | null>(null)
  const router = useRouter()

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

  const handleNext = () => {
    // Save the current question's response before moving to next
    const currentResponse = getCurrentQuestionResponse()
    if (currentResponse) {
      addTrialData({
        phase: "final-survey",
        trialNumber: currentTrialNumber,
        condition: currentResponse.text,
        stimulus: currentResponse.stimulus,
        choice: currentResponse.response,
        outcome: undefined,
        points: 0,
      })

      // Update localStorage
      try {
        const storedData = localStorage.getItem("experiment-data")
        if (storedData) {
          const data = JSON.parse(storedData)
          if (!data.surveyResponses) {
            data.surveyResponses = {}
          }
          
          // Add the current response to surveyResponses
          data.surveyResponses[currentResponse.key] = currentResponse.response
          localStorage.setItem("experiment-data", JSON.stringify(data))
        }
      } catch (error) {
        console.error("Error updating experiment data:", error)
      }
    }
    
    setCurrentQuestion(prev => prev + 1)
  }

  const getCurrentQuestionResponse = () => {
    const questions = [
      { number: 1, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-a", key: "q1B1" },
      { number: 2, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-b", key: "q1B2" },
      { number: 3, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-c", key: "q1B3" },
      { number: 4, text: "If you pressed this button 100 times, how many times do you think you would earn points?", stimulus: "stimulus-d", key: "q1B4" },
      { number: 5, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-a", key: "q2B1" },
      { number: 6, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-b", key: "q2B2" },
      { number: 7, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-c", key: "q2B3" },
      { number: 8, text: "How consistently do you think points are earned from this button?", stimulus: "stimulus-d", key: "q2B4" },
      { number: 9, text: "Which button do you think gives the BEST outcome?", stimulus: "all-images", key: "q3" },
      { number: 10, text: "Which button do you think gives the WORST outcome?", stimulus: "all-images", key: "q4" },
      { number: 11, text: "What strategy did you use to pick between these two buttons?", stimulus: "stimulus-a-b", key: "q5" },
      { number: 12, text: "What strategy did you use to pick between these two buttons?", stimulus: "blue-orange", key: "q6" },
      { number: 13, text: "Enter Your Prolific ID Here:", stimulus: "prolific", key: "prolificId" }
    ]

    const question = questions[currentQuestion - 1]
    if (!question) return null

    return {
      ...question,
      response: responses[question.key] || ""
    }
  }

  const handleSubmit = () => {
    // For the final question (Prolific ID)
    const finalResponse = getCurrentQuestionResponse()
    if (finalResponse) {
      addTrialData({
        phase: "final-survey",
        trialNumber: currentTrialNumber,
        condition: finalResponse.text,
        stimulus: finalResponse.stimulus,
        choice: finalResponse.response,
        outcome: undefined,
        points: 0,
      })

      try {
        const storedData = localStorage.getItem("experiment-data")
        if (storedData) {
          const data = JSON.parse(storedData)
          if (!data.surveyResponses) {
            data.surveyResponses = {}
          }
          
          // Add the Prolific ID
          data.surveyResponses[finalResponse.key] = finalResponse.response
          data.participantId = finalResponse.response
          
          // Add timestamp
          data.surveyResponses.timestamp = Date.now()
          
          localStorage.setItem("experiment-data", JSON.stringify(data))
          setExperimentData(data)
        }
      } catch (error) {
        console.error("Error updating experiment data:", error)
      }
    }

    setSubmitted(true)
    setTimeout(() => {
      router.push("/completion")
    }, 1000)
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
              <Image src="/images/stimulus-a.png" alt="Button 1" width={200} height={200} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={200} height={200} />
              <Image src="/images/stimulus-c.png" alt="Button 3" width={200} height={200} />
              <Image src="/images/stimulus-d.png" alt="Button 4" width={200} height={200} />
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
              <Image src="/images/stimulus-a.png" alt="Button 1" width={200} height={200} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={200} height={200} />
              <Image src="/images/stimulus-c.png" alt="Button 3" width={200} height={200} />
              <Image src="/images/stimulus-d.png" alt="Button 4" width={200} height={200} />
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
              <Image src="/images/stimulus-a.png" alt="Button 1" width={200} height={200} />
              <Image src="/images/stimulus-b.png" alt="Button 2" width={200} height={200} />
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
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    if (responses.prolificId && responses.prolificId.trim()) {
                      handleSubmit()
                    }
                  }}
                  disabled={!responses.prolificId || !responses.prolificId.trim()}
                >
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
