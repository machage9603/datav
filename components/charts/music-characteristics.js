"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function MusicCharacteristics({ data }) {
  const characteristics = [
    'danceability', 'valence', 'energy', 'acousticness',
    'instrumentalness', 'liveness', 'speechiness'
  ]

  const averageCharacteristics = characteristics.reduce((acc, char) => {
    acc[char] = data.reduce((sum, song) => sum + song[char], 0) / data.length
    return acc
  }, {})

  const chartData = characteristics.map(char => ({
    characteristic: char,
    value: averageCharacteristics[char]
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Music Characteristics</CardTitle>
        <CardDescription>Average values for various music features</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="characteristic" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="Average" dataKey="value" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

