"use client"

import Link from "next/link"
import React, { useState } from 'react'
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TopArtists({ data }) {
  // State to manage number of top artists
  const [topCount, setTopCount] = useState(10)

  // Robust data transformation
  const artistStreams = data.reduce((acc, song) => {
    const artistNames = song['artist(s)_name']?.split(', ') || ['Unknown'];
    const streams = Number(song.streams) || 0;

    artistNames.forEach(artist => {
      acc[artist] = (acc[artist] || 0) + (streams / artistNames.length);
    });

    return acc;
  }, {})

  // Prepare chart data with explicit mapping and dynamic slicing
  const chartData = Object.entries(artistStreams)
    .map(([name, value]) => ({
      name,
      streams: value
    }))
    .sort((a, b) => b.streams - a.streams)
    .slice(0, topCount);

  // Formatter for large numbers
  const formatStreamCount = (value) => {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return value.toFixed(0)
  }

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href={"/bar"} className="block">
            <CardTitle className="text-2xl font-bold text-gray-900">Top Artists</CardTitle>
            </Link>
            <CardDescription className="text-gray-600 mt-2">
              Top Artists by Total Stream Count
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={topCount.toString()} onValueChange={(value) => setTopCount(Number(value))}>
              <SelectTrigger className="w-[120px] bg-indigo-500 text-white">
                <SelectValue placeholder="Select Top" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Top {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="bg-indigo-600 text-white px-4 py-2 rounded-full">
              {chartData.length} Artists
            </div>
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
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4338CA" stopOpacity={1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                horizontal={false}
                stroke="rgba(0,0,0,0.15)"
                strokeDasharray="3 3"
              />

              <XAxis
                type="number"
                tickFormatter={formatStreamCount}
                axisLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.7)' }}
              />

              <YAxis
                dataKey="name"
                type="category"
                interval={0}
                width={topCount > 50 ? 20 : 150}
                axisLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tick={topCount > 50 ? false : { fontSize: 12, fill: 'rgba(0,0,0,0.7)' }}
              />

              <Tooltip
                formatter={(value) => [formatStreamCount(value), 'Total Streams']}
                cursor={{ fill: 'rgba(99, 102, 241, 0.2)' }}
              />

              <Bar
                dataKey="streams"
                fill="url(#artistGradient)"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fillOpacity={0.9}
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