"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Formatter for large numbers (streams)
const formatStreamCount = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}

// Custom tick formatter for years
const yearTickFormatter = (year) => {
  return `'${year.toString().slice(-2)}`
}

export function StreamingTrends({ data }) {
  const streamsByYear = data.reduce((acc, song) => {
    const year = song.released_date.getFullYear()
    acc[year] = (acc[year] || 0) + song.streams
    return acc
  }, {})

  const chartData = Object.entries(streamsByYear)
    .map(([year, streams]) => ({ year: parseInt(year), streams }))
    .sort((a, b) => a.year - b.year)

  return (
    <Card className="shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 p-4">
        <CardTitle className="text-xl font-bold text-gray-800">Streaming Trends Over Time</CardTitle>
        <CardDescription className="text-gray-600">Total streams per year</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer
          config={{
            streams: {
              label: "Streams",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ left: 20, right: 20, top: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
              />
              <XAxis
                dataKey="year"
                tickFormatter={yearTickFormatter}
                label={{
                  value: 'Year',
                  position: 'insideBottom',
                  offset: -10,
                  fill: 'rgba(0,0,0,0.6)'
                }}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(0,0,0,0.6)'
                }}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              />
              <YAxis
                tickFormatter={formatStreamCount}
                label={{
                  value: 'Total Streams',
                  angle: -90,
                  position: 'insideLeft',
                  dx: -15,
                  style: {
                    textAnchor: 'middle',
                    fill: 'rgba(0,0,0,0.6)'
                  }
                }}
                tick={{
                  fontSize: 10,
                  fill: 'rgba(0,0,0,0.6)'
                }}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="streams"
                stroke="blue"
                strokeWidth={3}
                dot={{
                  stroke: 'green',
                  strokeWidth: 2,
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: 'url(#streamGradient)'
                }}
              />
              <defs>
                <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}