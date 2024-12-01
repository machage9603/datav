"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export function TopArtists({ data }) {
  // Robust data transformation
  const artistStreams = data.reduce((acc, song) => {
    // Use 'artist(s)_name' instead of 'artist_name'
    const artistNames = song['artist(s)_name']?.split(', ') || ['Unknown'];
    const streams = Number(song.streams) || 0;

    // If multiple artists, distribute streams equally
    artistNames.forEach(artist => {
      acc[artist] = (acc[artist] || 0) + (streams / artistNames.length);
    });

    return acc;
  }, {})

  // Prepare chart data with explicit mapping
  const chartData = Object.entries(artistStreams)
    .map(([name, value]) => ({
      name,
      streams: value
    }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Top Artists by Total Streams</CardTitle>
        <CardDescription>Ranking of top 10 artists based on total stream count</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 80, right: 20, top: 20, bottom: 20 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => {
                if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
                if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
                return value.toFixed(0)
              }}
            />
            <YAxis
              dataKey="name"
              type="category"
              interval={0}
              width={150}
            />
            <Tooltip
              formatter={(value) => [
                value.toLocaleString(),
                'Total Streams'
              ]}
            />
            <Bar
              dataKey="streams"
              fill="#3B82F6"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}