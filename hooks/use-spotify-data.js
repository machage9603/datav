import { useState, useEffect } from 'react'
import Papa from 'papaparse'

export function useSpotifyData() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/data/smss.csv')
      .then(response => response.text())
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
            setError(error)
            setIsLoading(false)
          }
        })
      })
      .catch(error => {
        setError(error)
        setIsLoading(false)
      })
  }, [])

  return { data, isLoading, error }
}

