import React, { useMemo } from 'react'
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
  // Use stable memoized values with unique keys
  const genres = useMemo(() => {
    const uniqueGenres = ['All Genres', ...new Set(data.map(song => song.genre))];
    return uniqueGenres.filter(genre => genre != null);
  }, [data]);

  const artists = useMemo(() => {
    const uniqueArtists = ['All Artists', ...new Set(data.map(song => song.artist_name))];
    return uniqueArtists.filter(artist => artist != null);
  }, [data]);

  const handleReset = () => {
    setFilters({
      genre: 'All Genres',
      artist: 'All Artists',
      startDate: '',
      endDate: ''
    });
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
            {genres.map((genre, index) => (
              <SelectItem
                key={`genre-${genre}-${index}`}
                value={genre}
              >
                {genre}
              </SelectItem>
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
            {artists.map((artist, index) => (
              <SelectItem
                key={`artist-${artist}-${index}`}
                value={artist}
              >
                {artist}
              </SelectItem>
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