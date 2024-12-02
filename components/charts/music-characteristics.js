"use client"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from 'lucide-react'

export function MusicCharacteristics({ data }) {
  const characteristics = [
    { key: 'danceability_%', label: 'Danceability', description: 'How suitable a track is for dancing' },
    { key: 'valence_%', label: 'Valence', description: 'Musical positiveness conveyed by a track' },
    { key: 'energy_%', label: 'Energy', description: 'Intensity and activity of the track' },
    { key: 'acousticness_%', label: 'Acousticness', description: 'Amount of acoustic sound in the track' },
    { key: 'instrumentalness_%', label: 'Instrumentalness', description: 'Predicts if a track contains vocals' },
    { key: 'liveness_%', label: 'Liveness', description: 'Presence of audience in the recording' },
    { key: 'speechiness_%', label: 'Speechiness', description: 'Spoken words in the track' }
  ]

  // Safely calculate average characteristics
  const averageCharacteristics = characteristics.reduce((acc, char) => {
    acc[char.label] = data && data.length > 0
      ? data.reduce((sum, song) => sum + (parseFloat(song[char.key]) || 0), 0) / data.length
      : 0
    return acc
  }, {})

  const chartData = Object.entries(averageCharacteristics).map(([char, value]) => ({
    characteristic: char,
    value: value
  }))

  // Calculate total characteristics score
  const totalScore = chartData.reduce((sum, item) => sum + item.value, 0)
  const averageScore = totalScore / chartData.length

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-teal-100 to-teal-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Music Characteristics</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Comprehensive Analysis of Musical Features
            </CardDescription>
          </div>
          <div className="bg-teal-500 text-white px-4 py-2 rounded-full">
            {chartData.length} Features
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              cx="50%"
              cy="50%"
              outerRadius="80%"
              data={chartData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <PolarGrid
                stroke="rgba(79,209,197,0.3)"
                strokeOpacity={0.5}
                strokeDasharray="3 3"
              />

              <PolarAngleAxis
                dataKey="characteristic"
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.7)' }}
              />

              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tickCount={5}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
              />

              <Radar
                name="Average Characteristics"
                dataKey="value"
                stroke="#4FD1C5"
                fill="#4FD1C5"
                fillOpacity={0.3}
                strokeWidth={2}
              />

              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const item = payload[0].payload
                    const feature = characteristics.find(c => c.label === item.characteristic)
                    return (
                      <div className="bg-white p-4 rounded-xl shadow-lg border">
                        <p className="font-bold text-gray-800">{item.characteristic}</p>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                        <p className="mt-2 text-teal-700">
                          Value: {item.value.toFixed(1)}%
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Insights Section */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 flex items-center">
              Average Score
              <Info className="ml-2 h-4 w-4 text-teal-500" />
            </p>
            <p className="text-lg font-bold text-teal-800">
              {averageScore.toFixed(1)}%
            </p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Highest Feature</p>
            <p className="text-lg font-bold text-teal-800">
              {chartData.reduce((prev, current) =>
                (prev.value || 0) > (current.value || 0) ? prev : current
              ).characteristic}
            </p>
          </div>
          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600">Lowest Feature</p>
            <p className="text-lg font-bold text-teal-800">
              {chartData.reduce((prev, current) =>
                (prev.value || 0) < (current.value || 0) ? prev : current
              ).characteristic}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MusicCharacteristics