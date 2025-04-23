import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "a";

  const response = await fetch(
    new URL(`https://api.themoviedb.org/3/search/movie?`).toString() +
      new URLSearchParams({
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY!,
        query: query,
      }),
  );

  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: response.status },
    );

  const data = await response.json();
  return NextResponse.json(data);
}
