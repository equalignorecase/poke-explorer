import React from "react";
import { PokemonTypeName } from "@/lib/pokeapi/types";
import { TYPE_COLORS } from "@/lib/games/typeRelations";

interface PokemonTypeBadgeProps {
  type: PokemonTypeName;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

export function PokemonTypeBadge({
  type,
  size = "md",
  onClick,
  className = "",
}: PokemonTypeBadgeProps) {
  const color = TYPE_COLORS[type] || {
    bg: "bg-slate-400",
    text: "text-white",
    badge: "#94A3B8",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold tracking-wide",
    md: "px-3 py-1 text-xs font-bold tracking-wide",
    lg: "px-4 py-1.5 text-sm font-bold tracking-wider",
  };

  const content = (
    <span
      className={`inline-flex items-center justify-center uppercase rounded-full shadow-xs ${color.bg} ${color.text} ${sizeStyles[size]} ${className}`}
    >
      {type}
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer hover:opacity-90 active:scale-95 transition-all"
      >
        {content}
      </button>
    );
  }

  return content;
}

