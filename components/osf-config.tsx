"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface OSFConfigProps {
  onConfigSaved: () => void
}

export default function OSFConfig({ onConfigSaved }: OSFConfigProps) {
  const [osfConfig, setOSFConfig] = useLocalStorage<{
    token: string
    projectId: string
    nodeId: string
  }>("osf-config", {
    token: "",
    projectId: "",
    nodeId: "",
  })

  const [formData, setFormData] = useState({
    token: osfConfig.token || "",
    projectId: osfConfig.projectId || "",
    nodeId: osfConfig.nodeId || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOSFConfig(formData)
    onConfigSaved()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>OSF Configuration</CardTitle>
        <CardDescription>Enter your OSF API credentials to enable data upload to your OSF project</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">OSF API Token</Label>
            <Input
              id="token"
              name="token"
              type="password"
              value={formData.token}
              onChange={handleChange}
              placeholder="Enter your OSF personal access token"
              required
            />
            <p className="text-xs text-gray-500">
              You can create a personal access token in your OSF account settings.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectId">OSF Project ID</Label>
            <Input
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              placeholder="e.g., abcde"
              required
            />
            <p className="text-xs text-gray-500">
              This is the 5-character ID found in your project URL: https://osf.io/[project-id]
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nodeId">Storage Node ID (Optional)</Label>
            <Input
              id="nodeId"
              name="nodeId"
              value={formData.nodeId}
              onChange={handleChange}
              placeholder="e.g., abcde"
            />
            <p className="text-xs text-gray-500">
              If you want to store files in a specific component/node, enter its ID. Leave blank to use the project
              root.
            </p>
          </div>

          <Button type="submit" className="w-full">
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
