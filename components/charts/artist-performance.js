"use client"

import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function ArtistPerformance({ data }) {
  const artistData = data.reduce((acc, song) => {
    if (!acc[song.artist_name]) {
      acc[song.artist_name] = { totalStreams: 0, avgDanceability: 0, songCount: 0 }
    }
    acc[song.artist_name].totalStreams += song.streams
    acc[song.artist_name].avgDanceability += song.danceability
    acc[song.artist_name].songCount++
    return acc
  }, {})

  const chartData = Object.entries(artistData)
    .map(([artist, data]) => ({
      artist,
      totalStreams: data.totalStreams,
      avgDanceability: data.avgDanceability / data.songCount,
      songCount: data.songCount
    }))
    .sort((a, b) => b.totalStreams - a.totalStreams)
    .slice(0, 20)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Artist Performance</CardTitle>
        <CardDescription>Total streams vs. average danceability (bubble size: song count)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            totalStreams: {
              label: "Total Streams",
              color: "hsl(var(--chart-1))",
            },
            avgDanceability: {
              label: "Avg. Danceability",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="avgDanceability" name="Average Danceability" unit="%" />
              <YAxis type="number" dataKey="totalStreams" name="Total Streams" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Scatter
                name="Artists"
                data={chartData}
                fill="var(--color-totalStreams)"
                fillOpacity={0.7}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${index * 20}, 70%, 50%)`}
                    r={Math.sqrt(entry.songCount) * 2}  // Adjust the multiplier as needed
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

