"use client"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function MusicCharacteristics({ data }) {
  const characteristics = [
    'danceability_%', 'valence_%', 'energy_%', 'acousticness_%',
    'instrumentalness_%', 'liveness_%', 'speechiness_%'
  ]

  // Safely calculate average characteristics
  const averageCharacteristics = characteristics.reduce((acc, char) => {
    // Check if data is not empty and contains the characteristic
    acc[char.replace('_%', '')] = data && data.length > 0
      ? data.reduce((sum, song) => sum + (parseFloat(song[char]) || 0), 0) / data.length
      : 0
    return acc
  }, {})

  const chartData = Object.entries(averageCharacteristics).map(([char, value]) => ({
    characteristic: char,
    value: value
  }))

  console.log(chartData)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Music Characteristics</CardTitle>
        <CardDescription>Average values for various music features</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={chartData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="characteristic" />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tickCount={5}
              />
              <Radar
                name="Average"
                dataKey="value"
                stroke="var(--color-primary)"
                fill="var(--color-primary)"
                fillOpacity={0.6}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default MusicCharacteristics