"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { OSF_CONFIG } from "@/lib/osf-config"
import type { ExperimentData } from "./experiment"

interface OSFUploaderProps {
  experimentData: ExperimentData | null
  autoUpload?: boolean
}

export default function OSFUploader({ experimentData, autoUpload = false }: OSFUploaderProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)

  const generateCSV = (data: ExperimentData): string => {
    // Create CSV header (remove outcome)
    let csv = "participant_id,phase,trial_number,condition,stimulus,choice,points,timestamp\n"

    // Add each trial as a row
    data.trials.forEach((trial) => {
      const row = [
        data.participantId,
        trial.phase,
        trial.trialNumber,
        trial.condition || "",
        trial.stimulus || "",
        trial.choice || "",
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

    return csv
  }

  const uploadToOSF = async () => {
    if (!experimentData) {
      setErrorMessage("No experiment data available")
      setUploadStatus("error")
      return
    }

    try {
      setUploadStatus("uploading")
      setErrorMessage(null)

      // Use the hardcoded OSF configuration
      const osfConfig = OSF_CONFIG

      if (!osfConfig.projectId) {
        throw new Error("OSF configuration is incomplete. Please check the OSF configuration in the code.")
      }

      // Generate CSV data
      const csvData = generateCSV(experimentData)
      const fileName = `experiment-data-${experimentData.participantId}-${new Date().toISOString().split("T")[0]}.csv`

      // Upload through our API route
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csvContent: csvData,
          fileName: fileName,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload Error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        })
        throw new Error(errorData.error || `Failed to upload file: ${response.statusText}`)
      }

      const responseData = await response.json()
      setUploadedFileUrl(responseData.data?.links?.download)
      setUploadStatus("success")
    } catch (error) {
      console.error("Error uploading to OSF:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred")
      setUploadStatus("error")
    }
  }

  // Helper to trigger CSV download
  const downloadCSV = () => {
    if (!experimentData) return
    const csvData = generateCSV(experimentData)
    const fileName = `experiment-data-${experimentData.participantId}-${new Date().toISOString().split("T")[0]}.csv`
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // If autoUpload is true and we have data but haven't started uploading yet, trigger the upload
  if (autoUpload && experimentData && uploadStatus === "idle") {
    uploadToOSF()
  }

  return (
    <div className="space-y-4">
      {uploadStatus !== "success" && (
        <Button
          onClick={uploadStatus === "error" ? downloadCSV : uploadToOSF}
          disabled={uploadStatus === "uploading" || !experimentData}
          className="w-full"
        >
          {uploadStatus === "uploading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading to OSF...
            </>
          ) : uploadStatus === "error" ? (
            "Download Data as CSV"
          ) : (
            "Upload Data to OSF"
          )}
        </Button>
      )}

      {uploadStatus === "success" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Upload Successful</AlertTitle>
          <AlertDescription>Your data has been successfully uploaded to the research project.</AlertDescription>
        </Alert>
      )}

      {uploadStatus === "error" && (
        <Alert className="bg-red-50 border-red-200">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>Upload Failed</AlertTitle>
          <AlertDescription>
            {errorMessage || "Failed to upload data to OSF."}
            <p className="mt-2 text-sm">
              Please download your data using the "Download Data as CSV" button and send it to the researcher at lweil1@endicott.edu.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
