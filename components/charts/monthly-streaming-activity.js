import React, { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MonthlyStreamingActivity({ data }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

  const years = useMemo(() => [...new Set(data.map(song => song.released_date.getFullYear()))].sort(), [data])

  const monthlyData = useMemo(() => {
    const filteredData = data.filter(song => song.released_date.getFullYear().toString() === selectedYear)
    return Array.from({ length: 12 }, (_, month) => {
      const monthData = filteredData.filter(song => song.released_date.getMonth() === month)
      return {
        month: new Date(2000, month, 1).toLocaleString('default', { month: 'short' }),
        streams: monthData.reduce((sum, song) => sum + song.streams, 0)
      }
    })
  }, [data, selectedYear])

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
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="streams" fill="var(--color-streams)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
