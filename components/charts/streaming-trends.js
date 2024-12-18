"use client"
import Link from "next/link"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Formatter for large numbers (streams)
const formatStreamCount = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}

// Custom tick formatter for years
const yearTickFormatter = (year) => {
  return `'${year.toString().slice(-2)}`
}

export function StreamingTrends({ data }) {
  // Filter out data before 2006 and aggregate streams
  const streamsByYear = data
    .filter(song => song.released_year >= 2006)
    .reduce((acc, song) => {
      const year = song.released_year
      acc[year] = (acc[year] || 0) + song.streams
      return acc
    }, {})

  const chartData = Object.entries(streamsByYear)
    .map(([year, streams]) => ({ year: parseInt(year), streams }))
    .sort((a, b) => a.year - b.year)

  return (
    <Link href="/line" className="block">
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Streaming Trends</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Total streams aggregated by release year
            </CardDescription>
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
            {chartData.length} Years
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ left: 10, right: 10, top: 20, bottom: 10 }}
            >
              <defs>
                <linearGradient id="streamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0.9} />
                </linearGradient>
                <linearGradient id="fillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                vertical={false}
              />

              <XAxis
                dataKey="year"
                tickFormatter={yearTickFormatter}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.6)' }}
              />

              <YAxis
                tickFormatter={formatStreamCount}
                axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
                tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.6)' }}
              />

              <Tooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [formatStreamCount(value), 'Streams']}
                  />
                }
              />

              <Line
                type="monotone"
                dataKey="streams"
                stroke="url(#streamGradient)"
                strokeWidth={4}
                fill="url(#fillGradient)"
                fillOpacity={0.3}
                activeDot={{
                  r: 8,
                  stroke: 'white',
                  strokeWidth: 3,
                  fill: 'url(#streamGradient)'
                }}
                dot={{
                  r: 4,
                  fill: 'url(#streamGradient)',
                  stroke: 'white',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}