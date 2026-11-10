import { NextRequest, NextResponse } from "next/server";
import { getPokemon } from "@/lib/pokeapi/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing Pokémon ID" }, { status: 400 });
    }

    const pokemon = await getPokemon(id);
    return NextResponse.json(pokemon, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error: any) {
    console.error("API error in /api/pokemon/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch Pokémon details", message: error.message },
      { status: 404 }
    );
  }
}

