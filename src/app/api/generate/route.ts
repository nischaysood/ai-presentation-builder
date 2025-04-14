import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const prompt = formData.get("prompt") as string

  if (!file || !prompt) {
    return NextResponse.json({ error: "Missing file or prompt" }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), "uploads")
  const filePath = path.join(uploadsDir, file.name)

  await writeFile(filePath, buffer)

  return new Promise((resolve) => {
    const py = spawn('python3', ['backend/main.py', filePath, prompt])

    py.on('close', (code) => {
      const outputFilePath = path.join(process.cwd(), 'output', 'presentation.pptx')
      return resolve(
        new NextResponse(
          fs.createReadStream(outputFilePath) as any,
          {
            headers: {
              'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'Content-Disposition': 'attachment; filename="presentation.pptx"',
            },
          }
        )
      )
    })
  })
}