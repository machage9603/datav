import React, { useState, useMemo, useEffect } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function GenreMusicCharacteristics({ data }) {
  const [selectedGenre, setSelectedGenre] = useState(null)

  // Ensure genres are unique and sorted
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(data.map(song => song.genre))]
    return uniqueGenres.filter(genre => genre != null).sort()
  }, [data])

  // Initialize selectedGenre with the first genre if available
  useEffect(() => {
    if (genres.length > 0 && !selectedGenre) {
      setSelectedGenre(genres[0])
    }
  }, [genres, selectedGenre])

  const characteristics = useMemo(() => [
    'danceability', 'valence', 'energy', 'acousticness',
    'instrumentalness', 'liveness', 'speechiness'
  ], [])

  const genreCharacteristics = useMemo(() => {
    return genres.reduce((acc, genre) => {
      const genreSongs = data.filter(song => song.genre === genre)
      acc[genre] = characteristics.reduce((charAcc, char) => {
        // Safely calculate average, handling potential undefined or null values
        charAcc[char] = genreSongs.length > 0
          ? genreSongs.reduce((sum, song) => sum + (Number(song[char]) || 0), 0) / genreSongs.length
          : 0
        return charAcc
      }, {})
      return acc
    }, {})
  }, [data, genres, characteristics])

  const chartData = useMemo(() => {
    // Ensure we only process if a genre is selected and has characteristics
    if (!selectedGenre || !genreCharacteristics[selectedGenre]) return []

    return characteristics.map(char => ({
      characteristic: char,
      [selectedGenre]: Number(genreCharacteristics[selectedGenre][char]) || 0
    }))
  }, [selectedGenre, genreCharacteristics, characteristics])

  // Render nothing if no data or genres
  if (!data || data.length === 0 || genres.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Genre Music Characteristics</CardTitle>
        <CardDescription>Compare music features across genres</CardDescription>
        <Select
          value={selectedGenre || ''}
          onValueChange={setSelectedGenre}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre, index) => (
              <SelectItem
                key={`genre-${genre}-${index}`}
                value={genre}
              >
                {String(genre)}
              </SelectItem>
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
              {selectedGenre && (
                <Radar
                  key={`radar-${selectedGenre}`}
                  name={selectedGenre}
                  dataKey={selectedGenre}
                  stroke={`hsl(${genres.indexOf(selectedGenre) * 60}, 70%, 50%)`}
                  fill={`hsl(${genres.indexOf(selectedGenre) * 60}, 70%, 50%)`}
                  fillOpacity={0.6}
                />
              )}
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}