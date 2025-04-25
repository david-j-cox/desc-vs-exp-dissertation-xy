"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Experiment from "@/components/experiment"

export default function Home() {
  const [isComplete, setIsComplete] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {isComplete && (
          <div className="mb-6 flex justify-end items-center">
            <Link href="/data">
              <Button variant="outline">Access Experiment Data</Button>
            </Link>
          </div>
        )}
        <Experiment onComplete={() => setIsComplete(true)} />
      </div>
    </div>
  )
}
