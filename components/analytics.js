"use client"

import { useState } from 'react'
import { FilterBar } from './filter-bar'
import { StreamingTrends } from './charts/streaming-trends'
import { TopArtists } from './charts/top-artists'
import { GenreDistribution } from './charts/genre-distribution'
import { SongLengthVsStreams } from './charts/song-length-vs-streams'
import { MonthlyStreamingActivity } from './charts/monthly-streaming-activity'
import { ArtistPerformance } from './charts/artist-performance'
import { MusicCharacteristics } from './charts/music-characteristics'
import { GenreMusicCharacteristics } from './charts/genre-music-characteristics'
import { useSpotifyData } from '@/hooks/use-spotify-data'

export function Analytics() {
  const { data, isLoading, error } = useSpotifyData()
  const [filters, setFilters] = useState({
    genre: 'All Genres',
    artist: 'All Artists',
    startDate: '',
    endDate: ''
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const filteredData = data.filter(song =>
    (filters.genre === 'All Genres' || song.genre === filters.genre) &&
    (filters.artist === 'All Artists' || song.artist_name === filters.artist) &&
    (!filters.startDate || new Date(song.released_date) >= new Date(filters.startDate)) &&
    (!filters.endDate || new Date(song.released_date) <= new Date(filters.endDate))
  )

  return (
    <div className="space-y-8">
      <FilterBar data={data} filters={filters} setFilters={setFilters} />
      <div className="grid md:grid-cols-2 gap-8">
        <StreamingTrends data={filteredData} />
        <TopArtists data={filteredData} />
        <GenreDistribution data={filteredData} />
        <SongLengthVsStreams data={filteredData} />
        <MonthlyStreamingActivity data={filteredData} />
        <ArtistPerformance data={filteredData} />
        <MusicCharacteristics data={filteredData} />
        <GenreMusicCharacteristics data={filteredData} />
      </div>
    </div>
  )
}

