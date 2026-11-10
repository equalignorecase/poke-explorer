import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-slate-400 space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      <span className="text-xs font-semibold">Loading Pokémon data...</span>
    </div>
  );
}

