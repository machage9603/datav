import React from 'react';

const SpotifyLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full min-h-[300px] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-green-500 border-opacity-25 rounded-full absolute"></div>
        <div className="w-16 h-16 border-t-4 border-green-500 border-solid rounded-full animate-spin absolute"></div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
        Loading Spotify Analytics...
      </p>
    </div>
  );
};

export default SpotifyLoader;