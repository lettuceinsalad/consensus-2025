"use client"

import { useEffect, useRef } from "react"

interface PriceChartProps {
  data: number[]
  color: string
}

export default function PriceChart({ data, color }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (data.length <= 1) return

    // Find min and max for scaling
    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1 // Avoid division by zero

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 3

    // Move to first point
    const xStep = canvas.width / (data.length - 1)
    const firstY = canvas.height - ((data[0] - min) / range) * canvas.height
    ctx.moveTo(0, firstY)

    // Draw lines to each point
    for (let i = 1; i < data.length; i++) {
      const x = i * xStep
      const y = canvas.height - ((data[i] - min) / range) * canvas.height
      ctx.lineTo(x, y)
    }

    ctx.stroke()

    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, `${color}30`) // 30 is hex for 19% opacity
    gradient.addColorStop(1, `${color}05`) // 05 is hex for 2% opacity

    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.fillStyle = gradient
    ctx.fill()
  }, [data, color])

  return <canvas ref={canvasRef} className="w-full h-full" width={400} height={200} />
}
