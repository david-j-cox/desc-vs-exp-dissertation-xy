"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUpload from "@/components/image-upload"
import { useRouter } from "next/navigation"

export default function SetupPage() {
  const router = useRouter()
  const [images, setImages] = useState<Record<string, File | null>>({
    A: null,
    B: null,
    C: null,
    D: null,
  })

  const handleImageUpload = (imageFile: File, stimulusId: string) => {
    setImages((prev) => ({
      ...prev,
      [stimulusId]: imageFile,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would upload these files to a server or storage service
    // For this example, we'll just store them in localStorage as base64 strings
    const imagePromises = Object.entries(images).map(async ([id, file]) => {
      if (!file) return [id, null]

      return new Promise<[string, string]>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve([id, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    })

    const imageResults = await Promise.all(imagePromises)
    const imageUrls = Object.fromEntries(imageResults.filter(([_, url]) => url !== null))

    // Store in localStorage
    localStorage.setItem("stimulus-images", JSON.stringify(imageUrls))

    // Redirect to the experiment
    router.push("/")
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Experiment Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <ImageUpload onImageUpload={handleImageUpload} stimulusId="A" label="Upload image for Stimulus A" />
            <ImageUpload onImageUpload={handleImageUpload} stimulusId="B" label="Upload image for Stimulus B" />
            <ImageUpload onImageUpload={handleImageUpload} stimulusId="C" label="Upload image for Stimulus C" />
            <ImageUpload onImageUpload={handleImageUpload} stimulusId="D" label="Upload image for Stimulus D" />

            <Button type="submit" className="w-full">
              Start Experiment
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
