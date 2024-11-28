"use client"

import { useState } from 'react'
import { ResponsiveContainer, Tooltip, HeatMap } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MonthlyStreamingActivity({ data }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const monthlyData = data.reduce((acc, song) => {
    const year = song.released_date.getFullYear()
    const month = song.released_date.getMonth()
    if (year.toString() === selectedYear) {
      acc[month] = (acc[month] || 0) + song.streams
    }
    return acc
  }, {})

  const chartData = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(2000, i, 1).toLocaleString('default', { month: 'short' }),
    streams: monthlyData[i] || 0
  }))

  const years = [...new Set(data.map(song => song.released_date.getFullYear()))].sort()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Streaming Activity</CardTitle>
        <CardDescription>Streams by month for selected year</CardDescription>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            streams: {
              label: "Streams",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <HeatMap
              data={chartData}
              keys={["streams"]}
              indexBy="month"
              margin={{ top: 20, right: 0, bottom: 60, left: 80 }}
              forceSquare={true}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -90,
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 36
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Streams',
                legendPosition: 'middle',
                legendOffset: -72
              }}
              cellOpacity={1}
              cellBorderColor={{ from: 'color', modifiers: [ [ 'darker', 0.4 ] ] }}
              labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.8 ] ] }}
              defs={[
                {
                  id: 'lines',
                  type: 'patternLines',
                  background: 'inherit',
                  color: 'rgba(0, 0, 0, 0.1)',
                  rotation: -45,
                  lineWidth: 4,
                  spacing: 7
                }
              ]}
              fill={[{ id: 'lines' }]}
              animate={true}
              motionStiffness={80}
              motionDamping={9}
              hoverTarget="cell"
              cellHoverOthersOpacity={0.25}
            />
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

