import { useState, useEffect } from 'react'
import Papa from 'papaparse'

const mockData = [
  {
    track_name: "Song 1",
    artist_name: "Artist 1",
    genre: "Pop",
    streams: 1000000,
    released_year: 2021,
    released_month: 1,
    released_day: 1,
    duration_ms: 180000,
    danceability_: 80,
    valence_: 65,
    energy_: 75,
    acousticness_: 20,
    instrumentalness_: 5,
    liveness_: 15,
    speechiness_: 10
  },
  {
    track_name: "Song 2",
    artist_name: "Artist 2",
    genre: "Rock",
    streams: 800000,
    released_year: 2020,
    released_month: 6,
    released_day: 15,
    duration_ms: 210000,
    danceability_: 70,
    valence_: 55,
    energy_: 85,
    acousticness_: 30,
    instrumentalness_: 10,
    liveness_: 20,
    speechiness_: 5
  },
  {
    track_name: "Song 3",
    artist_name: "Artist 3",
    genre: "Hip Hop",
    streams: 1200000,
    released_year: 2022,
    released_month: 3,
    released_day: 10,
    duration_ms: 195000,
    danceability_: 90,
    valence_: 75,
    energy_: 80,
    acousticness_: 10,
    instrumentalness_: 2,
    liveness_: 25,
    speechiness_: 20
  }
];

export function useSpotifyData() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/smss.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csvString => {
        Papa.parse(csvString, {
          header: true,
          complete: (results) => {
            const parsedData = results.data.map(row => ({
              ...row,
              streams: parseInt(row.streams),
              duration_ms: parseInt(row.duration_ms),
              released_date: new Date(row.released_year, row.released_month - 1, row.released_day),
              danceability: parseFloat(row['danceability_%']),
              valence: parseFloat(row['valence_%']),
              energy: parseFloat(row['energy_%']),
              acousticness: parseFloat(row['acousticness_%']),
              instrumentalness: parseFloat(row['instrumentalness_%']),
              liveness: parseFloat(row['liveness_%']),
              speechiness: parseFloat(row['speechiness_%'])
            }))
            setData(parsedData)
            setIsLoading(false)
          },
          error: (error) => {
            console.error("Error parsing CSV:", error)
            setError(error)
            setIsLoading(false)
          }
        })
      })
      .catch(error => {
        console.error("Error fetching CSV:", error)
        console.log("Falling back to mock data")
        const parsedData = mockData.map(row => ({
          ...row,
          streams: parseInt(row.streams),
          duration_ms: parseInt(row.duration_ms),
          released_date: new Date(row.released_year, row.released_month - 1, row.released_day),
          danceability: parseFloat(row.danceability_),
          valence: parseFloat(row.valence_),
          energy: parseFloat(row.energy_),
          acousticness: parseFloat(row.acousticness_),
          instrumentalness: parseFloat(row.instrumentalness_),
          liveness: parseFloat(row.liveness_),
          speechiness: parseFloat(row.speechiness_)
        }))
        setData(parsedData)
        setError(error)
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading, error }
}

