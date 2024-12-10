"use client"

import { useState } from 'react'
import { Scatter, ScatterChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function BPMVsStreams({ data }) {
  // Enhanced color palette with gradients and labels
  const COLOR_CONFIGS = [
    {
      start: '#3B82F6',
      end: '#2563EB',
      label: 'Pop Tempo',
      range: { min: 60, max: 100 }
    },
    {
      start: '#10B981',
      end: '#059669',
      label: 'Dance/EDM',
      range: { min: 100, max: 140 }
    },
    {
      start: '#F43F5E',
      end: '#E11D48',
      label: 'High Energy',
      range: { min: 140, max: 180 }
    },
    {
      start: '#6366F1',
      end: '#4338CA',
      label: 'Intense/Rock',
      range: { min: 180, max: 220 }
    },
    {
      start: '#F59E0B',
      end: '#D97706',
      label: 'Experimental',
      range: { min: 220, max: 300 }
    }
  ]

  // Zoom state
  const [zoomDomain, setZoomDomain] = useState({
    x: [0, 300],
    y: [0, 1000000000]
  })

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
      const bpm = Number(song.bpm)

      // Determine color config based on BPM
      const colorConfig = COLOR_CONFIGS.find(config =>
        bpm >= config.range.min && bpm < config.range.max
      ) || COLOR_CONFIGS[0]

      return {
        x: bpm,
        y: streams,
        name: song.track_name,
        artist: song.artist,
        year: song.year,
        bpm: bpm,
        streams: streams,
        color: colorConfig,
        colorIndex: COLOR_CONFIGS.indexOf(colorConfig)
      }
    });

  // Total songs for context
  const totalSongs = chartData.length

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">BPM vs Streams</CardTitle>
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
        {/* Zoom Slider */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">BPM Range</label>
            <Slider
              defaultValue={[0, 300]}
              min={0}
              max={300}
              step={10}
              onValueChange={(value) => setZoomDomain(prev => ({
                ...prev,
                x: value
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Streams Range</label>
            <Slider
              defaultValue={[0, 1000000000]}
              min={0}
              max={1000000000}
              step={10000000}
              onValueChange={(value) => setZoomDomain(prev => ({
                ...prev,
                y: value
              }))}
            />
          </div>
        </div>

        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
              <defs>
                {COLOR_CONFIGS.map((color, index) => (
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
                domain={zoomDomain.x}
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
                domain={zoomDomain.y}
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

              <Legend
                content={() => (
                  <div className="flex justify-center space-x-4 mt-2">
                    {COLOR_CONFIGS.map((config, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2"
                      >
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            background: `linear-gradient(to right, ${config.start}, ${config.end})`
                          }}
                        />
                        <span className="text-xs text-gray-600">
                          {config.label} ({config.range.min}-{config.range.max} BPM)
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
                        <p><strong className="text-gray-700">Year:</strong> {data.year}</p>
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
                  fill={`url(#gradient-${song.colorIndex})`}
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