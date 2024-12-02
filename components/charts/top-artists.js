"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"
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

  // Formatter for large numbers
  const formatStreamCount = (value) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toFixed(0)
  }

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Top Artists</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Top 10 artists by total stream count
            </CardDescription>
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
            {chartData.length} Artists
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ left: 100, right: 20, top: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="artistGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9} />
                </linearGradient>
              </defs>

              <CartesianGrid
                horizontal={false}
                stroke="rgba(0,0,0,0.1)"
              />

              <XAxis
                type="number"
                tickFormatter={formatStreamCount}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.6)' }}
              />

              <YAxis
                dataKey="name"
                type="category"
                interval={0}
                width={150}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.6)' }}
              />

              <Tooltip
                formatter={(value) => [formatStreamCount(value), 'Total Streams']}
                cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
              />

              <Bar
                dataKey="streams"
                fill="url(#artistGradient)"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={0.8}
                    stroke="white"
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}