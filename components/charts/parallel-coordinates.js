"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const ParallelCoordinatesChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Sample dataset (replace with actual CSV data)
    const sampleData = [
      { track: "Song A", Danceability: 80, Instrumentalness: 0, Liveness: 8, Speechiness: 4, Energy: 83, Valence: 89 },
      { track: "Song B", Danceability: 71, Instrumentalness: 0, Liveness: 10, Speechiness: 4, Energy: 74, Valence: 61 },
      { track: "Song C", Danceability: 51, Instrumentalness: 0, Liveness: 31, Speechiness: 6, Energy: 53, Valence: 32 },
      { track: "Song D", Danceability: 55, Instrumentalness: 0, Liveness: 11, Speechiness: 15, Energy: 72, Valence: 58 },
      { track: "Song E", Danceability: 65, Instrumentalness: 63, Liveness: 11, Speechiness: 6, Energy: 80, Valence: 23 },
    ];
    
    setData(sampleData);
  }, []);

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold text-center mb-4">Parallel Coordinates: Spotify Features</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <XAxis dataKey="track" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Danceability" stroke="#8884d8" />
          <Line type="monotone" dataKey="Instrumentalness" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Liveness" stroke="#ff7300" />
          <Line type="monotone" dataKey="Speechiness" stroke="#ff6384" />
          <Line type="monotone" dataKey="Energy" stroke="#36a2eb" />
          <Line type="monotone" dataKey="Valence" stroke="#ffce56" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ParallelCoordinatesChart;
