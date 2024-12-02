import React, { useState, useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown } from 'lucide-react'

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
        .filter(year => year != null && !isNaN(year))
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

    return Array.from({ length: 12 }, (_, month) => {
      const monthData = filteredData.filter(song =>
        song.released_date.getMonth() === month
      )

      return {
        month: new Date(2000, month, 1).toLocaleString('default', { month: 'short' }),
        streams: monthData.reduce((sum, song) => sum + (Number(song.streams) || 0), 0)
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

  // If no years are available, return null or a placeholder
  if (years.length === 0) {
    return null
  }

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Monthly Streaming Activity</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Streams Distribution Across Months
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-purple-500 text-white px-4 py-2 rounded-full">
              {monthlyData.filter(m => m.streams > 0).length} Active Months
            </div>
            <Select
              value={selectedYear || ''}
              onValueChange={setSelectedYear}
            >
              <SelectTrigger className="w-[120px] bg-white/70 hover:bg-white/90 transition-all duration-200">
                <SelectValue placeholder="Select Year">
                  {selectedYear}
                </SelectValue>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
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
                <linearGradient id="colorStreams" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.3}/>
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
                formatter={(value) => [formatStreams(value), 'Streams']}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />

              <Bar
                dataKey="streams"
                fill="url(#colorStreams)"
                fillOpacity={0.7}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
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