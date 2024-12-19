"use client"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MusicReleaseYearsChart({ data }) {
  // Group data by release year
  const yearCounts = data.reduce((acc, song) => {
    const year = new Date(song.release_date).getFullYear()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {})

  // Convert to chart-friendly format
  const chartData = Object.entries(yearCounts)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year)

  // Color palette for years
  const getYearColor = (year) => {
    const baseColors = [
      '#4FD1C5',   // Teal
      '#3182CE',   // Blue
      '#48BB78',   // Green
      '#ED64A6',   // Pink
      '#F6AD55',   // Orange
      '#9F7AEA',   // Purple
    ]
    return baseColors[year % baseColors.length]
  }

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-6">
        <Link
          href="/lineto"
          className="block transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <CardTitle className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
            Music Release Years Distribution
          </CardTitle>
        </Link>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
              />

              <XAxis
                dataKey="year"
                label={{
                  value: 'Release Year',
                  position: 'insideBottom',
                  offset: -20
                }}
              />

              <YAxis
                label={{
                  value: 'Number of Tracks',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
                labelStyle={{ fontWeight: 'bold' }}
              />

              <Line
                type="monotone"
                dataKey="count"
                stroke={getYearColor(chartData[0]?.year || 0)}
                strokeWidth={3}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Total Years: {chartData.length}</p>
          <p>Tracks Range: {chartData[0]?.year} - {chartData[chartData.length - 1]?.year}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default MusicReleaseYearsChart