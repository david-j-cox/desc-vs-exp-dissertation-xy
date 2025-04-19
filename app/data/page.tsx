"use client"

import DataExport from "@/components/data-export"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DataPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Data Export & Upload Testing</h1>
      <DataExport />
    </div>
  )
}
