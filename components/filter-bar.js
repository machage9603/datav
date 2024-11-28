import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const uniqueGenres = [...new Set(data.map(song => song.genre))]
    const uniqueArtists = [...new Set(data.map(song => song.artist_name))]
    setGenres(uniqueGenres)
    setArtists(uniqueArtists)
  }, [data])

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
          onValueChange={(value) => setFilters({ ...filters, genre: value })}
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
          onValueChange={(value) => setFilters({ ...filters, artist: value })}
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
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          placeholder="Start Date"
        />
      </div>
      <div className="w-full md:w-auto">
        <Input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          placeholder="End Date"
        />
      </div>
      <Button onClick={handleReset}>Reset Filters</Button>
    </div>
  )
}

