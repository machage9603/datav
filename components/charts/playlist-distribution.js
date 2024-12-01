"use client"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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

  // Sort and take top 5
  const chartData = playlistCounts
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Color palette
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  // Custom label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="12px"
        fontWeight="bold"
      >
        {`${percent.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Playlist Distribution</CardTitle>
        <CardDescription>Top 5 Playlist/Chart Appearances</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [value.toLocaleString(), 'Appearances']}
                  />
                }
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}