import type { Movie } from "../types";

export const filterMovies = (movies: Movie[], query: string): Movie[] => {
  if (!query.trim()) return movies;
  const lowerQuery = query.toLowerCase().trim();
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(lowerQuery)
  );
};

export const getNotFoundText = (query: string): string =>
  query.trim() ? `No movies found matching "${query}"` : "No movies available";
