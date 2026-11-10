import Link from "next/link";
import { Compass, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto my-16 space-y-4 shadow-xs">
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center mx-auto">
        <FileQuestion className="w-6 h-6" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">404 - Page Not Found</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        The page or Pokémon resource you are looking for does not exist.
      </p>
      <Link
        href="/pokedex"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
      >
        <Compass className="w-3.5 h-3.5" />
        <span>Return to Pokédex</span>
      </Link>
    </div>
  );
}

