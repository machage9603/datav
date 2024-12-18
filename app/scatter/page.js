'use client'

import { FilterBar } from "@/components/filter-bar";
import React, { useEffect, useMemo, useState } from "react";
import { useSpotifyData } from '@/hooks/use-spotify-data'
import { BPMVsStreams } from "@/components/charts/bpm-vs-streams";

export default function Home() {
    const { data, isLoading, error } = useSpotifyData()
    const [isClient, setIsClient] = useState(false);
      const [filters, setFilters] = useState({
        genre: 'All Genres',
        artist: 'All Artists',
        startDate: '',
        endDate: ''
      })

      useEffect(() => {
        setIsClient(true);
      }, []);

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

      if (!isClient) return null
      if (isLoading) return <div>Loading...</div>
      if (error) return <div>Error: {error.message}</div>
      if (!data) return <div>No data available</div>
    return (
        <>
            <main>
                <div className="space-y-8">
                      <FilterBar data={data} filters={filters} setFilters={setFilters} />
                      <div className="grid md:grid-cols-2 gap-8"></div>
                        <BPMVsStreams data={filteredData}/>
                </div>
            </main>

        </>
    )
}