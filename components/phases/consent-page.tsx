"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface ConsentPageProps {
  onAdvance: () => void
}

export default function ConsentPage({ onAdvance }: ConsentPageProps) {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center">Informed Consent</h1>

      <div className="bg-gray-50 p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">INTRODUCTION</h2>
        <div className="mb-4">
          <p>
            In this study you will respond to a series of buttons that may or may not 
            lead to losing points with some programmed probability (e.g., 100% chance of losing 70 points or
            30% chance of losing 150 points). The purpose of this research project is to
            understand how your interaction with those buttons influences your 
            choices over time. 
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">PARTICIPATION</h2>
        <div className="mb-4">
          <p>
            Taking part in this study is completely voluntary. 
            You may stop your participation at any time by letting the researcher 
            know you would like to stop participating. There is no penalty for 
            ending participation. There are no right or wrong answers.  
            All answers will remain completely anonymous. Those who 
            complete the study will be eligible to receive extra credit 
            points that can be applied to a class. Participants from Prolific 
            will receive incentives through the Prolific platform. 
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">Risks</h2>
        <div className="mb-4">
          <p>
            There are no foreseeable risks involved in participating in this 
            study other than those minimal risks encountered in day-to-day life.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">BENEFITS</h2>
        <div className="mb-4">
          <p>
            There are no known direct benefits that you will receive 
            for participating in this study. The benefits of this 
            study are greater knowledge regarding how people approach 
            risky decision making. 
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">ANONYMITY</h2>
        <div className="mb-4">
          <p>
            Your name or identity will not be used in reports or 
            presentations of the findings of this research. 
            Information provided to the researchers will be kept anonymous. 
            This research project has been approved by the Institutional 
            Review Board at Endicott College. 
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">CONTACT</h2>
        <div className="mb-4">
          <p>
            For questions or concerns about the research, please contact 
            Laura Weil at lweil1@endicott.edu.
          </p>
        </div>
        <div>
          <p>
            Thank you for your help.
          </p>
        </div>
        <div>           
          <p>
            For concerns about your treatment as a research participant, please contact:
            <br />
            Institutional Review Board (IRB)
            <br />
            Endicott College
            <br />
            376 Hale Street
            <br />
            Beverly, MA 01915
            <br />
            irb@endicott.edu
          </p>
          <br />
          <p>
            This research project has been reviewed by the 
            Institutional Review Board at Endicott College in 
            accordance with US Department of Health and Human 
            Services Office of Human Research Protections 45 
            CFR part 46 and does not constitute approval by 
            the host institution.
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4">ELECTRONIC CONSENT</h2>
        <div>
          <p>
            Continuing with this survey indicates that you have read 
            the above information, that you are voluntarily agreeing 
            to participate and that you are 18 years of age or older.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="consent" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} />
        <label
          htmlFor="consent"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I have read and understood the information above and agree to participate in this study.
        </label>
      </div>

      <Button className="w-full" disabled={!agreed} onClick={onAdvance}>
        Begin Experiment
      </Button>
    </div>
  )
}
