"use client"

import React, { useState, useMemo } from 'react'
import { FilterBar } from './filter-bar'
import { StreamingTrends } from './charts/streaming-trends'
import { TopArtists } from './charts/top-artists'
import { GenreDistribution } from './charts/genre-distribution'
import { BPMVsStreams } from './charts/bpm-vs-streams'
import { MonthlyStreamingActivity } from './charts/monthly-streaming-activity'
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

  // Memoize filtered data to prevent unnecessary re-renders
  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter(song => {
      const meetsGenre = filters.genre === 'All Genres' || song.genre === filters.genre;
      const meetsArtist = filters.artist === 'All Artists' || song.artist_name === filters.artist;
      const meetsStartDate = !filters.startDate || new Date(song.released_date) >= new Date(filters.startDate);
      const meetsEndDate = !filters.endDate || new Date(song.released_date) <= new Date(filters.endDate);

      return meetsGenre && meetsArtist && meetsStartDate && meetsEndDate;
    });
  }, [data, filters]);

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data available</div>

  return (
    <div className="space-y-8">
      <FilterBar data={data} filters={filters} setFilters={setFilters} />
      <div className="grid md:grid-cols-2 gap-8">
        <StreamingTrends data={filteredData} />
        <TopArtists data={filteredData} />
        <GenreDistribution data={filteredData} />
        <BPMVsStreams data={filteredData} />
        <MonthlyStreamingActivity data={filteredData} />
        <MusicCharacteristics data={filteredData} />
        <GenreMusicCharacteristics data={filteredData} />
      </div>
    </div>
  )
}