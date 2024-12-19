"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function BPMHistogram({ data }) {
  // Enhanced color palette with gradients
  const COLORS = [
    { start: '#3B82F6', end: '#2563EB' },   // Blue gradient
    { start: '#10B981', end: '#059669' },   // Green gradient
    { start: '#F43F5E', end: '#E11D48' },   // Rose gradient
    { start: '#6366F1', end: '#4338CA' },   // Indigo gradient
    { start: '#F59E0B', end: '#D97706' }    // Amber gradient
  ]

  // Format large numbers to be more readable
  const formatStreams = (streams) => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`
    }
    if (streams >= 1000) {
      return `${(streams / 1000).toFixed(1)}K`
    }
    return streams.toString()
  }

  // Calculate BPM histogram bins
  const calculateBPMBins = (songs) => {
    if (!songs || songs.length === 0) return [];

    // Filter out invalid data
    const validSongs = songs.filter(song =>
      song.bpm &&
      song.streams &&
      !isNaN(Number(song.bpm)) &&
      !isNaN(Number(song.streams))
    );

    // Determine min and max BPM
    const bpms = validSongs.map(song => Number(song.bpm));
    const minBPM = Math.floor(Math.min(...bpms) / 10) * 10;
    const maxBPM = Math.ceil(Math.max(...bpms) / 10) * 10;

    // Create bins
    const binWidth = 20;
    const bins = {};

    validSongs.forEach(song => {
      const bpm = Number(song.bpm);
      const binStart = Math.floor(bpm / binWidth) * binWidth;
      const binLabel = `${binStart}-${binStart + binWidth}`;

      if (!bins[binLabel]) {
        bins[binLabel] = {
          range: binLabel,
          totalStreams: 0,
          songCount: 0,
          songs: []
        };
      }

      bins[binLabel].totalStreams += Number(song.streams);
      bins[binLabel].songCount++;
      bins[binLabel].songs.push(song);
    });

    // Convert to array and sort
    return Object.values(bins)
      .sort((a, b) => a.range.localeCompare(b.range));
  }

  // Process data into histogram bins
  const histogramData = calculateBPMBins(data);

  // Total songs for context
  const totalSongs = histogramData.reduce((sum, bin) => sum + bin.songCount, 0);

  return (
    <Card className="w-full shadow-2xl rounded-2xl overflow-hidden border-none">
      <CardHeader className="bg-gradient-to-r from-indigo-100 to-indigo-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href={"/hist"} className="block transition-transform duration-200 hover:scale-105 active:scale-95">
            <CardTitle className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200">
              BPM Distribution
              </CardTitle>
            </Link>
            <CardDescription className="text-gray-600 mt-2">
              Exploring Song Tempo Distribution and Streaming Popularity
            </CardDescription>
          </div>
          <div className="bg-indigo-500 text-white px-4 py-2 rounded-full">
            {totalSongs} Songs
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-4">
        <div className="h-[600px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={histogramData}
              margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
            >
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`gradient-${index}`}
                    x1="0%" y1="0%" x2="100%" y2="0%"
                  >
                    <stop offset="0%" stopColor={color.start} stopOpacity={0.7} />
                    <stop offset="100%" stopColor={color.end} stopOpacity={0.9} />
                  </linearGradient>
                ))}
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(0,0,0,0.1)"
                strokeOpacity={0.5}
              />

              <XAxis
                dataKey="range"
                label={{
                  value: "Beats Per Minute (BPM) Range",
                  position: "insideBottom",
                  offset: -15,
                  fill: 'rgba(0,0,0,0.7)',
                  fontWeight: 'bold'
                }}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
              />

              <YAxis
                dataKey="totalStreams"
                tickFormatter={formatStreams}
                label={{
                  value: "Total Streams",
                  angle: -90,
                  position: "insideLeft",
                  dx: -25,
                  offset: 20,
                  fill: 'rgba(0,0,0,0.7)',
                  fontWeight: 'bold'
                }}
                tick={{ fontSize: 10, fill: 'rgba(0,0,0,0.6)' }}
              />

              <Tooltip
                cursor={{ fillOpacity: 0.3 }}
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.9)'
                }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-4 border rounded-xl shadow-lg">
                        <p><strong className="text-gray-700">BPM Range:</strong> {data.range}</p>
                        <p><strong className="text-gray-700">Total Songs:</strong> {data.songCount}</p>
                        <p><strong className="text-gray-700">Total Streams:</strong> {formatStreams(data.totalStreams)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar dataKey="totalStreams">
                {histogramData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index % COLORS.length})`}
                    fillOpacity={0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}