"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import MusicList from "../components/MusicList";
import SearchBar from "../components/SearchBar";
import { Track } from "../types/music";

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchMusic = async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch music");
      }

      const data = await response.json();
      setTracks(data);
    } catch (err) {
      setError("Error fetching music. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch popular tracks on initial load
    const fetchPopular = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/popular");
        if (!response.ok) {
          throw new Error("Failed to fetch popular tracks");
        }
        const data = await response.json();
        setTracks(data);
      } catch (err) {
        setError("Error fetching popular music.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopular();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Music Search App</title>
        <meta name="description" content="Search for free music" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Free Music Search
        </h1>

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={searchMusic}
        />

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
            {error}
          </div>
        )}

        {!isLoading && !error && <MusicList tracks={tracks} />}
      </main>
    </div>
  );
}
