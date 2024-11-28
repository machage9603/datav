"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
    <Card>
      <CardHeader>
        <CardTitle>Streaming Trends Over Time</CardTitle>
        <CardDescription>Total streams by year</CardDescription>
      </CardHeader>
      <CardContent>
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
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="streams" stroke="var(--color-streams)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
