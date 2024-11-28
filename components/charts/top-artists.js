"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function TopArtists({ data }) {
  const artistStreams = data.reduce((acc, song) => {
    acc[song.artist_name] = (acc[song.artist_name] || 0) + song.streams
    return acc
  }, {})

  const chartData = Object.entries(artistStreams)
    .map(([artist, streams]) => ({ artist, streams }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Artists by Total Streams</CardTitle>
        <CardDescription>Top 10 artists based on total streams</CardDescription>
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
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="artist" type="category" width={150} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="streams" fill="var(--color-streams)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

