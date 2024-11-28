"use client";

import { useState } from "react";
import { ResponsiveHeatMap } from "@nivo/heatmap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MonthlyStreamingActivity({ data }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Compute monthly data
  const monthlyData = data.reduce((acc, song) => {
    const year = song.released_date.getFullYear();
    const month = song.released_date.getMonth();
    if (year.toString() === selectedYear) {
      acc[month] = (acc[month] || 0) + song.streams;
    }
    return acc;
  }, {});

  // Create data in the format Nivo HeatMap expects
  const chartData = [
    {
      id: 'Streams',
      data: Array.from({ length: 12 }, (_, i) => ({
        x: new Date(2000, i, 1).toLocaleString("default", { month: "short" }),
        y: monthlyData[i] || 0
      }))
    }
  ];

  const years = [...new Set(data.map((song) => song.released_date.getFullYear()))].sort();

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
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
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
          <ResponsiveHeatMap
            data={chartData}
            keys={['Streams']}
            indexBy="x"
            margin={{ top: 20, right: 0, bottom: 60, left: 80 }}
            forceSquare={true}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -90,
              legend: "Month",
              legendPosition: "middle",
              legendOffset: 36,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Streams",
              legendPosition: "middle",
              legendOffset: -72,
            }}
            colors={{
              type: 'sequential',
              colors: ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
            }}
            cellOpacity={1}
            cellBorderWidth={1}
            cellBorderColor={{ from: "color", modifiers: [["darker", 0.4]] }}
            animate={true}
            motionStiffness={80}
            motionDamping={9}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  );
}