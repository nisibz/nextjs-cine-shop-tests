"use client";
import { useEffect, useState } from "react";
import { Movie } from "../types";

export default function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovies = async () => {
    try {
      const response = await fetch("/api/movies");
      if (!response.ok) throw new Error("Failed to fetch movies");
      const data = await response.json();

      const savedPrices = JSON.parse(
        localStorage.getItem("moviePrices") || "{}",
      );

      const moviesWithPrices = data.results.map((movie: Movie) => ({
        ...movie,
        price: savedPrices[movie.id] || Math.floor(Math.random() * 15) + 5,
      }));

      const allPrices = moviesWithPrices.reduce(
        (acc: Record<number, number>, movie: Movie) => {
          acc[movie.id] = movie.price;
          return acc;
        },
        { ...savedPrices },
      ); // Preserve existing entries

      localStorage.setItem("moviePrices", JSON.stringify(allPrices));

      setMovies(moviesWithPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  };

  const updateMoviePrice = (movieId: number, newPrice: number) => {
    setMovies((prev) =>
      prev.map((movie) =>
        movie.id === movieId ? { ...movie, price: newPrice } : movie,
      ),
    );

    const moviePrices = movies.reduce(
      (acc, movie) => ({
        ...acc,
        [movie.id]: movie.id === movieId ? newPrice : movie.price,
      }),
      {} as Record<number, number>,
    );

    localStorage.setItem("moviePrices", JSON.stringify(moviePrices));
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, loading, error, updateMoviePrice };
}
