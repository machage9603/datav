"use client"

import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function SongLengthVsStreams({ data }) {
  const chartData = data.map(song => ({
    duration: song.duration_ms / 60000, // Convert to minutes
    streams: song.streams,
    name: song.track_name
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Song Length vs. Total Streams</CardTitle>
        <CardDescription>Relationship between song duration and popularity</CardDescription>
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
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="duration" name="Duration (minutes)" unit=" min" />
              <YAxis type="number" dataKey="streams" name="Streams" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter name="Songs" data={chartData} fill="var(--color-streams)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
