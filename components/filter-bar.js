import React, { useState, useEffect, useMemo } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FilterBar({ data, filters, setFilters }) {
  const [genres, setGenres] = useState([])
  const [artists, setArtists] = useState([])

  const uniqueGenres = useMemo(() => [...new Set(data.map(song => song.genre))], [data])
  const uniqueArtists = useMemo(() => [...new Set(data.map(song => song.artist_name))], [data])

  useEffect(() => {
    setGenres(uniqueGenres)
    setArtists(uniqueArtists)
  }, [uniqueGenres, uniqueArtists])

  const handleReset = () => {
    setFilters({
      genre: 'All Genres',
      artist: 'All Artists',
      startDate: '',
      endDate: ''
    })
  }

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="w-full md:w-auto">
        <Select
          value={filters.genre}
          onValueChange={(value) => setFilters(prev => ({ ...prev, genre: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Genres">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-auto">
        <Select
          value={filters.artist}
          onValueChange={(value) => setFilters(prev => ({ ...prev, artist: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Artist" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Artists">All Artists</SelectItem>
            {artists.map(artist => (
              <SelectItem key={artist} value={artist}>{artist}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-auto">
        <Input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
          placeholder="Start Date"
        />
      </div>
      <div className="w-full md:w-auto">
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
          placeholder="End Date"
        />
      </div>
      <Button onClick={handleReset}>Reset Filters</Button>
    </div>
  )
}
