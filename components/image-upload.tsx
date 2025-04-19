"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ImageUploadProps {
  onImageUpload: (imageFile: File, stimulusId: string) => void
  stimulusId: string
  label: string
}

export default function ImageUpload({ onImageUpload, stimulusId, label }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Pass the file to the parent component
    onImageUpload(file, stimulusId)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={`image-${stimulusId}`}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={`image-${stimulusId}`}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          Choose Image
        </Button>
        {preview && (
          <div className="w-16 h-16 relative border rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview || "/placeholder.svg"}
              alt={`Preview for ${stimulusId}`}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
