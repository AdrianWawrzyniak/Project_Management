/**
 * Komponent Navbar - górny pasek nawigacyjny aplikacji
 *
 * Odpowiedzialności:
 * - Wyświetlanie paska wyszukiwania
 * - Przełączanie trybu ciemnego/jasnego
 * - Przycisk do otwierania/zamykania Sidebar (gdy jest zwinięty)
 */
import React from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

type Props = {};

const Navbar = () => {
  // Redux hooks - do zarządzania globalnym stanem
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 dark:backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Przycisk menu - widoczny tylko gdy sidebar jest zwinięty */}
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        {/* Pole wyszukiwania z ikoną */}
        <div className="relative flex h-min w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-indigo-400 dark:focus:bg-gray-800 dark:focus:ring-indigo-900/50"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Sekcja z przyciskami po prawej stronie */}
      <div className="flex items-center gap-2">
        {/* Przycisk przełączania trybu ciemnego/jasnego */}
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {/* Ikona zmienia się w zależności od trybu - słońce w trybie ciemnym, księżyc w jasnym */}
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
        {/* Separator wizualny */}
        <div className="ml-2 mr-3 hidden h-6 w-px bg-gray-200 dark:bg-gray-700 md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;
