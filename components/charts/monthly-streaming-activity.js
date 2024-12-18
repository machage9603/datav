import Link from 'next/link'
import React, { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MonthlyStreamingActivity({ data }) {
  // Ensure data is an array and not empty
  const validData = useMemo(() =>
    Array.isArray(data) ? data.filter(song => song && song.released_date) : [],
    [data]
  )

  const years = useMemo(() => {
    const uniqueYears = [...new Set(
      validData
        .map(song => song.released_date.getFullYear())
        .filter(year => year != null && !isNaN(year) && year > 2006)
    )].sort()
    return uniqueYears
  }, [validData])

  // Safely select initial year
  const [selectedYear, setSelectedYear] = useState(() =>
    years.length > 0 ? years[years.length - 1].toString() : ''
  )

  const monthlyData = useMemo(() => {
    if (!selectedYear) return []

    const filteredData = validData.filter(song =>
      song.released_date.getFullYear().toString() === selectedYear
    )

    // Hardcoded potential streaming values
    const hardcodedStreams = {
      0: 500000000,   // January
      1: 300000000,   // February
      2: 705000000,   // March
      3: 820000000,   // April
      4: 105000000,   // May
      5: 690000000,   // June
      6: 880000000,   // July
      7: 940000000,   // August
      8: 225000000,   // September
      9: 81000000,   // October
      10: 993500000,  // November
      11: 890000000   // December
    }

    return Array.from({ length: 12 }, (_, month) => {
      const monthData = filteredData.filter(song =>
        song.released_date.getMonth() === month
      )

      const calculatedStreams = monthData.reduce((sum, song) => sum + (Number(song.streams) || 0), 0)

      // Prioritize actual streams, fall back to hardcoded if zero
      const streams = calculatedStreams > 0
        ? calculatedStreams
        : hardcodedStreams[month]

      return {
        month: new Date(2000, month, 1).toLocaleString('default', { month: 'short' }),
        streams: streams,
        hasActualStreams: calculatedStreams > 0,
        fill: calculatedStreams > 0
          ? "url(#colorStreamsActual)"
          : "url(#colorStreamsPredicted)"
      }
    })
  }, [validData, selectedYear])

  // Format large numbers
  const formatStreams = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
    return value.toString()
  }

  // Total streams for the year
  const totalYearStreams = useMemo(() =>
    monthlyData.reduce((sum, entry) => sum + entry.streams, 0),
    [monthlyData]
  )

  // Active months (with actual streams from data)
  const activeMonths = useMemo(() =>
    monthlyData.filter(month => month.hasActualStreams).length,
    [monthlyData]
  )

  // If no years are available, return null or a placeholder
  if (years.length === 0) {
    return null
  }

  console.log('BarChart Data:', monthlyData);

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/barto" className="blocked">
            <CardTitle className="text-2xl font-bold text-gray-900">Monthly Streaming Activity</CardTitle>
            </Link>
            <CardDescription className="text-gray-600 mt-2">
              Streams Distribution Across Months
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500 text-white px-4 py-2 rounded-full">
              {activeMonths} Actual Months
            </div>
            <Select
              value={selectedYear || ''}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px] bg-white/70 hover:bg-white/90 transition-all duration-200">
                <SelectValue placeholder="Select Year">
                  {selectedYear}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {years.map((year, index) => (
                  <SelectItem
                    key={`year-${year}-${index}`}
                    value={year.toString()}
                  >
                    {String(year)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <defs>
                <linearGradient id="colorStreamsActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorStreamsPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="colorStreamsHardcoded" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.8}/>
    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.3}/>
  </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="month"
                axisLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
              />

              <YAxis
                tickFormatter={formatStreams}
                axisLine={{ stroke: 'rgba(0,0,0,0.3)' }}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
                label={{
                  value: 'Streams',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 10,
                  fill: 'rgba(0,0,0,0.7)',
                  fontWeight: 'bold'
                }}
              />

              <Tooltip
                formatter={(value, name, props) => {
                  const formattedValue = formatStreams(value)
                  const isActual = props.payload.hasActualStreams
                  return [
                    formattedValue,
                    isActual ? 'Actual Streams' : 'Estimated Streams'
                  ]
                }}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />

              <Bar
                dataKey="streams"
                fill={(entry) => entry.payload.fill}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Color Legend */}
        <div className="flex justify-center space-x-6 mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <div
              className="w-6 h-4 mr-2 rounded"
              style={{
                background: 'linear-gradient(to bottom, #8884d8 5%, #8884d8 95%)'
              }}
            />
            <span className="text-sm text-gray-700">Actual Streams</span>
          </div>
          <div className="flex items-center">
            <div
              className="w-6 h-4 mr-2 rounded"
              style={{
                background: 'linear-gradient(to bottom, #82ca9d 5%, #82ca9d 95%)'
              }}
            />
            <span className="text-sm text-gray-700">Estimated Streams</span>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total Streams</p>
            <p className="text-lg font-bold text-purple-800">{formatStreams(totalYearStreams)}</p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Peak Month</p>
            <p className="text-lg font-bold text-purple-800">
              {monthlyData.reduce((prev, current) =>
                (prev.streams || 0) > (current.streams || 0) ? prev : current
              ).month}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Avg Monthly Streams</p>
            <p className="text-lg font-bold text-purple-800">
              {formatStreams(totalYearStreams / 12)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}