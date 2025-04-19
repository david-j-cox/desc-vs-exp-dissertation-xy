"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OSFUploader from "./osf-uploader"
import type { ExperimentData } from "./experiment"

export default function DataExport() {
  const [data, setData] = useState<ExperimentData | null>(null)

  const loadData = () => {
    try {
      const storedData = localStorage.getItem("experiment-data")
      if (storedData) {
        setData(JSON.parse(storedData))
      } else {
        alert("No experiment data found in localStorage.")
      }
    } catch (error) {
      console.error("Error loading data:", error)
      alert("Error loading experiment data.")
    }
  }

  const exportAsJSON = () => {
    if (!data) {
      loadData()
      return
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `experiment-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportAsCSV = () => {
    if (!data) {
      loadData()
      return
    }

    // Create CSV header
    let csv = "participant_id,phase,trial_number,condition,stimulus,choice,outcome,points,timestamp\n"

    // Add each trial as a row
    data.trials.forEach((trial) => {
      const row = [
        data.participantId,
        trial.phase,
        trial.trialNumber,
        trial.condition || "",
        trial.stimulus || "",
        trial.choice || "",
        trial.outcome !== undefined ? trial.outcome : "",
        trial.points || 0,
        new Date(trial.timestamp).toISOString(),
      ]
        .map((value) => {
          // Escape commas and quotes in string values
          if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(",")

      csv += row + "\n"
    })

    const dataBlob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `experiment-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearData = () => {
    if (confirm("Are you sure you want to clear all experiment data? This cannot be undone.")) {
      localStorage.removeItem("experiment-data")
      setData(null)
      alert("Experiment data has been cleared.")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Experiment Data</CardTitle>
        <CardDescription>Access and export the collected experiment data for analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={loadData} variant="outline">
              Load Data
            </Button>
            <Button onClick={exportAsJSON} variant="outline">
              Export as JSON
            </Button>
            <Button onClick={exportAsCSV} variant="outline">
              Export as CSV
            </Button>
            <Button onClick={clearData} variant="destructive">
              Clear Data
            </Button>
          </div>

          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Upload to Research Database</h3>
            <p className="text-sm text-gray-500 mb-4">
              Send your experiment data directly to the research project database.
            </p>
            <OSFUploader experimentData={data} />
          </div>

          {data && (
            <Tabs defaultValue="summary" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="trials">Trials</TabsTrigger>
                <TabsTrigger value="raw">Raw Data</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <div className="rounded-md bg-muted p-4">
                  <h3 className="font-medium mb-2">Experiment Summary</h3>
                  <p>Participant ID: {data.participantId}</p>
                  <p>Current Phase: {data.currentPhase}</p>
                  <p>Total Points: {data.totalPoints}</p>
                  <p>Total Trials: {data.trials.length}</p>
                </div>
              </TabsContent>

              <TabsContent value="trials">
                <div className="rounded-md bg-muted p-4 max-h-96 overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Phase</th>
                        <th className="text-left p-2">Trial</th>
                        <th className="text-left p-2">Stimulus</th>
                        <th className="text-left p-2">Choice</th>
                        <th className="text-left p-2">Outcome</th>
                        <th className="text-left p-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.trials.map((trial, index) => (
                        <tr key={index} className="border-b border-muted-foreground/20">
                          <td className="p-2">{trial.phase}</td>
                          <td className="p-2">{trial.trialNumber}</td>
                          <td className="p-2">{trial.stimulus || "-"}</td>
                          <td className="p-2">{trial.choice || "-"}</td>
                          <td className="p-2">{trial.outcome !== undefined ? (trial.outcome ? "✓" : "✗") : "-"}</td>
                          <td className="p-2">{trial.points || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="raw">
                <div className="rounded-md bg-muted p-4 max-h-96 overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
