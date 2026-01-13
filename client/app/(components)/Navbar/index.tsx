import React from "react";
import { Menu, Moon, Search, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";

type Props = {};

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/95 dark:backdrop-blur-md">
      {/* Search Bar */}
      <div className="flex items-center gap-6">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        )}

        <div className="relative flex h-min w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <input
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:bg-gray-800 dark:focus:ring-blue-900/50"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
        <div className="ml-2 mr-3 hidden h-6 w-px bg-gray-200 dark:bg-gray-700 md:inline-block"></div>
      </div>
    </div>
  );
};

export default Navbar;
