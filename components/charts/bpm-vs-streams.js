"use client"

import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export function BPMVsStreams({ data }) {
  // Color palette for variety
  const getColor = (streams) => {
    if (streams > 500000000) return "#FF4136" // Red for mega hits
    if (streams > 200000000) return "#2ECC40" // Green for big hits
    if (streams > 50000000) return "#0074D9" // Blue for popular songs
    return "#B10DC9" // Purple for less streamed songs
  }

  // Format large numbers to be more readable
  const formatStreams = (streams) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`
    }
    if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`
    }
    return streams.toString()
  }

  // Parse the data and convert to chart-friendly format
  const chartData = (Array.isArray(data) ? data : [])
    .filter(song =>
      song.bpm &&
      song.streams &&
      !isNaN(Number(song.bpm)) &&
      !isNaN(Number(song.streams))
    )
    .map(song => {
      const streams = Number(song.streams)
      return {
        x: Number(song.bpm), // Ensure numeric BPM
        y: streams, // Ensure numeric streams
        name: song.track_name,
        artist: song.artist,
        bpm: Number(song.bpm),
        streams: streams,
        color: getColor(streams)
      }
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Song BPM vs Total Streams</CardTitle>
        <CardDescription>Relationship between song tempo and popularity</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="BPM"
              tick={{ fontSize: 10 }}
              label={{
                value: "Beats Per Minute (BPM)",
                position: "insideBottom",
                offset: -15
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Streams"
              tick={{ fontSize: 10 }}
              tickFormatter={formatStreams}
              label={{
                value: "Total Streams",
                angle: -90,
                position: "insideLeft",
                offset: 20
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-2 border rounded shadow">
                      <p><strong>Song:</strong> {data.name}</p>
                      <p><strong>Artist:</strong> {data.artist}</p>
                      <p><strong>BPM:</strong> {data.bpm}</p>
                      <p><strong>Streams:</strong> {data.streams.toLocaleString()}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            {chartData.map((song, index) => (
              <Scatter
                key={index}
                name="Songs"
                data={[song]}
                fill={song.color}
                fillOpacity={0.7}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}