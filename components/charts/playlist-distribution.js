"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

export function PlaylistDistribution({ data }) {
  // Define playlist columns to track
  const playlistColumns = [
    { key: 'in_spotify_playlists', name: 'Spotify Playlists' },
    { key: 'in_apple_playlists', name: 'Apple Playlists' },
    { key: 'in_deezer_playlists', name: 'Deezer Playlists' },
    { key: 'in_spotify_charts', name: 'Spotify Charts' },
    { key: 'in_apple_charts', name: 'Apple Charts' },
    { key: 'in_deezer_charts', name: 'Deezer Charts' },
    { key: 'in_shazam_charts', name: 'Shazam Charts' }
  ]

  // Calculate total appearances for each playlist/chart
  const playlistCounts = playlistColumns.map(column => ({
    name: column.name,
    count: data.reduce((sum, song) => sum + (Number(song[column.key]) || 0), 0)
  }))

  // Sort and take top 5, ensuring only entries with non-zero counts are included
  const chartData = playlistCounts
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Custom color palette with more distinct colors
  const COLORS = [
    '#3B82F6',  // Vibrant Blue
    '#10B981',  // Emerald Green
    '#F43F5E',  // Rose Red
    '#6366F1',  // Indigo
    '#F59E0B',  // Amber
  ]

  // Custom label renderer with improved readability
  const renderCustomizedLabel = ({ name, count }) => {
    const percentage = ((count / totalAppearances) * 100).toFixed(1); // Consistent formula
    return (
      <text
        fill="rgba(0,0,0,0.7)"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    );
  };


  // Total appearances for context
  const totalAppearances = chartData.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Playlist Distribution</CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Top Playlist and Chart Appearances
            </CardDescription>
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full">
            {chartData.length} Platforms
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.9} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                paddingAngle={3}
                label={renderCustomizedLabel}
                labelLine
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => [
                  value.toLocaleString(),
                  `${name} Appearances`
                ]}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }}
              />

              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                wrapperStyle={{
                  paddingLeft: '20px',
                  fontSize: '14px',
                  color: 'rgba(0,0,0,0.7)'
                }}
                formatter={(value, entry) => {
                  const percentage = (entry.payload.count / totalAppearances * 100).toFixed(1)
                  return `${value} (${percentage}%)`
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}