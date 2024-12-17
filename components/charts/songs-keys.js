"use client"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MusicKeyHistogram({ data }) {
  // Group and count songs by key
  const keyDistribution = data.reduce((acc, song) => {
    const key = song.key || 'Unknown'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  // Convert to chart-friendly format
  const chartData = Object.entries(keyDistribution)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => {
      // Custom sorting for musical keys
      const keyOrder = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Unknown']
      return keyOrder.indexOf(a.key) - keyOrder.indexOf(b.key)
    })

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-purple-100 to-purple-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Music Key Distribution</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Frequency of Songs by Musical Key
            </CardDescription>
          </div>
          <div className="bg-purple-500 text-white px-4 py-2 rounded-full">
            {data.length} Tracks
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(128,90,213,0.2)"
              />

              <XAxis
                dataKey="key"
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.7)' }}
              >
                <Label
                  value="Musical Keys"
                  offset={-10}
                  position="insideBottom"
                  fill="rgba(0,0,0,0.6)"
                />
              </XAxis>

              <YAxis
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
              >
                <Label
                  value="Number of Songs"
                  angle={-90}
                  position="insideLeft"
                  fill="rgba(0,0,0,0.6)"
                  style={{ textAnchor: 'middle' }}
                />
              </YAxis>

              <Tooltip
                cursor={{ fill: 'rgba(128,90,213,0.1)' }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px'
                }}
                labelStyle={{ fontWeight: 'bold', color: 'black' }}
              />

              <Bar
                dataKey="count"
                fill="rgba(128,90,213,0.7)"
                activeBar={{ fill: 'rgba(128,90,213,1)' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Additional Insights */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Most Common Key</p>
            <p className="text-lg font-bold text-purple-800">
              {chartData.reduce((prev, current) =>
                (prev.count || 0) > (current.count || 0) ? prev : current
              ).key}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Total Keys</p>
            <p className="text-lg font-bold text-purple-800">
              {chartData.length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Songs Without Key</p>
            <p className="text-lg font-bold text-purple-800">
              {keyDistribution['Unknown'] || 0}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MusicKeyHistogram