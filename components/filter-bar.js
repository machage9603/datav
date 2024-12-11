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
  // Keep these memoized calculations for filtering logic
  const genres = useMemo(() => {
    const uniqueGenres = ['All Genres', ...new Set(data.map(song => song.genre))];
    return uniqueGenres.filter(genre => genre != null);
  }, [data]);

  const artists = useMemo(() => {
    const uniqueArtists = ['All Artists', ...new Set(data.map(song => song.artist_name))];
    return uniqueArtists.filter(artist => artist != null);
  }, [data]);

  const handleReset = () => {
    // reset logic including genre and artist
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
      <Button onClick={handleReset}>Reset</Button>
    </div>
  )
}