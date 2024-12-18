"use client"

import Link from 'next/link'
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function BPMVsStreams({ data }) {
  // Enhanced color palette with gradients
  const COLORS = [
    { start: '#3B82F6', end: '#2563EB' },   // Blue gradient
    { start: '#10B981', end: '#059669' },   // Green gradient
    { start: '#F43F5E', end: '#E11D48' },   // Rose gradient
    { start: '#6366F1', end: '#4338CA' },   // Indigo gradient
    { start: '#F59E0B', end: '#D97706' }    // Amber gradient
  ]

  // Format large numbers to be more readable
  //refactor this later
  const formatStreams = (streams) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`
    }
    if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`
    }
    return streams.toString()
  }

  // Parse and process data
  const chartData = (Array.isArray(data) ? data : [])
    .filter(song =>
      song.bpm &&
      song.streams &&
      !isNaN(Number(song.bpm)) &&
      !isNaN(Number(song.streams))
    )
    .map((song, index) => {
      const streams = Number(song.streams)
      return {
        x: Number(song.bpm),
        y: streams,
        name: song.track_name,
        artist: song['artist(s)_name'],
        bpm: Number(song.bpm),
        streams: streams,
        color: COLORS[index % COLORS.length]
      }
    });

  // Total songs for context
  const totalSongs = chartData.length

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/scatter" className="block">
            <CardTitle className="text-2xl font-bold text-gray-900">BPM vs Streams</CardTitle>
            </Link>
            <CardDescription className="text-gray-600 mt-2">
              Exploring the Relationship Between Song Tempo and Popularity
            </CardDescription>
          </div>
          <div className="bg-indigo-500 text-white px-4 py-2 rounded-full">
            {totalSongs} Songs
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0%" y1="0%" x2="100%" y2="0%"
                  >
                    <stop offset="0%" stopColor={color.start} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={color.end} stopOpacity={0.9} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                strokeOpacity={0.5}
              />

              <XAxis
                type="number"
                dataKey="x"
                name="BPM"
                domain={['dataMin - 10', 'dataMax + 10']}
                tickCount={8}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
                label={{
                  value: "Beats Per Minute (BPM)",
                  position: "insideBottom",
                  offset: -15,
                  fill: 'rgba(0,0,0,0.7)',
                  fontWeight: 'bold'
                }}
              />

              <YAxis
                type="number"
                dataKey="y"
                name="Streams"
                domain={['auto', 'auto']}
                tickFormatter={formatStreams}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
                label={{
                  value: "Total Streams",
                  angle: -90,
                  position: "insideLeft",
                  dx: -25,
                  offset: 20,
                  fill: 'rgba(0,0,0,0.7)',
                  fontWeight: 'bold'
                }}
              />

              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border rounded-xl shadow-lg">
                        <p><strong className="text-gray-700">Song:</strong> {data.name}</p>
                        <p><strong className="text-gray-700">Artist:</strong> {data.artist}</p>
                        <p><strong className="text-gray-700">BPM:</strong> {data.bpm}</p>
                        <p><strong className="text-gray-700">Streams:</strong> {data.streams.toLocaleString()}</p>
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
                  fill={`url(#gradient-${index % COLORS.length})`}
                  fillOpacity={0.7}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}