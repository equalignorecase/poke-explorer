"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useTeam } from "@/context/TeamContext";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import {
  Gamepad2,
  Heart,
  Users,
  Compass,
  ArrowLeftRight,
  Info,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { favorites } = useFavorites();
  const { team } = useTeam();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/pokedex", label: t.nav.pokedex, icon: Compass },
    { href: "/compare", label: t.nav.compare, icon: ArrowLeftRight },
    {
      href: "/favorites",
      label: t.nav.favorites,
      icon: Heart,
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
    {
      href: "/team",
      label: t.nav.team,
      icon: Users,
      badge: team.length > 0 ? `${team.length}/6` : undefined,
    },
    { href: "/games", label: t.nav.games, icon: Gamepad2 },
    { href: "/about", label: t.nav.about, icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-black text-xl tracking-tight text-slate-900 dark:text-white group"
          >
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm ring-2 ring-red-100 dark:ring-red-950 group-hover:rotate-12 transition-transform">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-white bg-white/20" />
            </div>
            <span>
              Pokédex<span className="text-red-600 dark:text-red-500">Explorer</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Theme toggle, Language switcher & Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <LanguageSwitcher />

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium ${
                  isActive
                    ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-semibold"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
