import { NextRequest, NextResponse } from "next/server";
import { getFilteredPokemonList } from "@/lib/pokeapi/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "";
    const genParam = searchParams.get("gen");
    const generation = genParam ? parseInt(genParam, 10) : 0;
    const pageParam = searchParams.get("page");
    const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
    const pageSizeParam = searchParams.get("pageSize");
    const pageSize = pageSizeParam ? Math.min(48, Math.max(6, parseInt(pageSizeParam, 10))) : 24;

    const data = await getFilteredPokemonList({
      query,
      type,
      generation,
      page,
      pageSize,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error: any) {
    console.error("API error in /api/pokemon:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon list", message: error.message },
      { status: 500 }
    );
  }
}

