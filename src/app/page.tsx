'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleGenerate = async () => {
    if (!prompt || !file) {
      alert("Please provide a prompt and a PDF file")
      return
    }

    const formData = new FormData()
    formData.append("prompt", prompt)
    formData.append("file", file)

    const response = await fetch("/api/generate", {
      method: "POST",
      body: formData
    })

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "presentation.pptx"
      link.click()
    } else {
      alert("Something went wrong while generating the presentation.")
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-16 space-y-6 p-4">
      <h1 className="text-3xl font-bold text-center">AI Presentation Builder</h1>

      <div className="space-y-2">
        <Label htmlFor="prompt">Enter Topic or Instructions</Label>
        <Textarea
          id="prompt"
          placeholder="Welcome ! on what topic would you like to make presentation on"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="file">Upload PDF</Label>
        <Input
          id="file"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </div>

      <Button onClick={handleGenerate} className="w-full">Generate Presentation</Button>
    </main>
  )
}