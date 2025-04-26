"use client"

import { Button } from "@/components/ui/button"

interface InstructionsPageProps {
  onAdvance: () => void
}

export default function InstructionsPage({ onAdvance }: InstructionsPageProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">INSTRUCTIONS</h2>
        <p className="mb-4"></p>
        <div className="space-y-4">
          <p className="text-center">Please read these instructions carefully</p>
          <p className="mb-6"></p>
          <p className="text-center">In this experience you will see a series of buttons 
            and we are interested which one you would prefer. 
            There are no right or wrong answers. The point bank 
            at the top of the screen indicates how many points 
            you collected for each button choice. The points are 
            cumulative for each condition (e.g., the total 
            points will reset to 0 at the start of a new condition).
            To do well you should pay attention to how often you 
            earn points AND how many points you earn from each button.
          </p>
        </div>
      </div>

      <Button onClick={onAdvance} className="w-full">
        Continue
      </Button>
    </div>
  )
} 