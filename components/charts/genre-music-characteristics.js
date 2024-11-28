"use client"

import { useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GenreMusicCharacteristics({ data }) {
  const [selectedGenres, setSelectedGenres] = useState([])

  const characteristics = [
    'danceability', 'valence', 'energy', 'acousticness',
    'instrumentalness', 'liveness', 'speechiness'
  ]

  const genres = [...new Set(data.map(song => song.genre))]

  const genreCharacteristics = genres.reduce((acc, genre) => {
    const genreSongs = data.filter(song => song.genre === genre)
    acc[genre] = characteristics.reduce((charAcc, char) => {
      charAcc[char] = genreSongs.reduce((sum, song) => sum + song[char], 0) / genreSongs.length
      return charAcc
    }, {})
    return acc
  }, {})

  const chartData = characteristics.map(char => ({
    characteristic: char,
    ...selectedGenres.reduce((acc, genre) => {
      acc[genre] = genreCharacteristics[genre][char]
      return acc
    }, {})
  }))

  const handleGenreChange = (value) => {
    setSelectedGenres(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Music Characteristics</CardTitle>
        <CardDescription>Compare music features across genres</CardDescription>
        <Select
          multiple
          value={selectedGenres}
          onValueChange={handleGenreChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select genres" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="characteristic" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {selectedGenres.map((genre, index) => (
                <Radar
                  key={genre}
                  name={genre}
                  dataKey={genre}
                  stroke={`hsl(${index * 60}, 70%, 50%)`}
                  fill={`hsl(${index * 60}, 70%, 50%)`}
                  fillOpacity={0.6}
                />
              ))}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

