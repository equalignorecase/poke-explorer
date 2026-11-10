"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface PokemonArtworkProps {
  id: number;
  name: string;
  artwork: string;
  sprite?: string;
  className?: string;
  priority?: boolean;
  size?: number;
}

export function PokemonArtwork({
  id,
  name,
  artwork,
  sprite,
  className = "",
  priority = false,
  size = 200,
}: PokemonArtworkProps) {
  const [src, setSrc] = useState<string>(
    artwork || sprite || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
  );
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (sprite && src !== sprite) {
      setSrc(sprite);
    } else {
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-400 dark:text-slate-500 p-4 ${className}`}
        style={{ width: size, height: size }}
      >
        <Sparkles className="w-8 h-8 mb-1 opacity-50" />
        <span className="text-xs font-medium">No Image</span>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        priority={priority}
        onError={handleError}
        className="object-contain drop-shadow-md hover:scale-105 transition-transform duration-200"
        unoptimized
      />
    </div>
  );
}

