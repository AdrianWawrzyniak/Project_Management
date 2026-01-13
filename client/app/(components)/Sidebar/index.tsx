/**
 * Sidebar - boczny panel nawigacyjny aplikacji
 * 
 * Odpowiedzialności:
 * - Wyświetlanie głównej nawigacji aplikacji (Home, Timeline, Search, Users, Teams)
 * - Zarządzanie widocznością listy projektów
 * - Obsługa zwijania/rozwijania panelu bocznego
 */
"use client";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  Calendar,
  ChevronDown,
  ChevronUp,
  FolderKanban,
  Grid3x3,
  Icon,
  Layers3,
  Lock,
  LucideIcon,
  Search,
  Shield,
  ShieldAlert,
  UserCircle,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  // Stan lokalny - kontroluje widoczność sekcji projektów
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  // Pobieranie listy projektów z API za pomocą RTK Query
  const { data: projects } = useGetProjectsQuery();
  
  // Redux hooks - do zarządzania globalnym stanem aplikacji
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  // Dynamiczne klasy CSS - zmieniają się w zależności od stanu zwinięcia
  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-2xl
    transition-all duration-300 h-full z-40 overflow-y-auto bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}`;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* Nagłówek Sidebar - zawiera nazwę użytkownika i przycisk zamykania */}
        <div className="z-50 flex min-h-[64px] w-64 items-center justify-between border-b border-gray-200 bg-white/80 px-6 pb-3 pt-4 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
            Wawrzyniak Adrian
          </div>
          {/* Przycisk zamykania - widoczny tylko gdy sidebar jest rozwinięty */}
          {isSidebarCollapsed ? null : (
            <button
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-5 w-5 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" />
            </button>
          )}
        </div>
        {/* Sekcja informacji o projekcie - logo i status konta */}
        <div className="flex items-center gap-4 border-b border-gray-200 bg-white/50 px-6 py-5 dark:border-gray-800 dark:bg-gray-800/70">
          <div className="relative">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={48}
              height={48}
              className="rounded-xl ring-2 ring-gray-200 dark:ring-gray-800"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 dark:text-gray-100">
              Projekt
            </h3>
            <div className="mt-1 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Konto
              </p>
            </div>
          </div>
        </div>
        
        {/* Główna nawigacja - linki do różnych sekcji aplikacji */}
        <nav className="z-10 w-full px-2 py-3">
          <SidebarLink icon={Grid3x3} label="Home" href="/" />
          <SidebarLink icon={Calendar} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={UserCircle} label="Users" href="/users" />
          <SidebarLink icon={UsersRound} label="Teams" href="/teams" />
        </nav>

        {/* Przycisk rozwijania/zwijania sekcji projektów */}
        <div className="px-2">
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span>Projects</span>
            {/* Ikona zmienia się w zależności od stanu rozwinięcia */}
            {showProjects ? (
              <ChevronUp className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform" />
            )}
          </button>
        </div>
        
        {/* Lista projektów - renderowana tylko gdy sekcja jest rozwinięta */}
        {showProjects &&
          projects?.map((project) => (
            <SidebarLink
              key={project.id}
              icon={FolderKanban}
              label={project.name}
              href={`/projects/${project.id}`}
            />
          ))}
      </div>
    </div>
  );
};

/**
 * Interfejs dla propsów komponentu SidebarLink
 */
interface SidebarLinkProps {
  href: string; // URL do którego prowadzi link
  icon: LucideIcon; // Ikona z lucide-react
  label: string; // Tekst wyświetlany obok ikony
}

/**
 * Komponent SidebarLink - pojedynczy link w nawigacji
 * 
 * Funkcjonalność:
 * - Wyświetla ikonę i tekst
 * - Podświetla się gdy jest aktywny (na podstawie aktualnej ścieżki)
 * - Obsługuje nawigację przez Next.js Link
 */
const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  // Pobieranie aktualnej ścieżki URL do sprawdzenia czy link jest aktywny
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="block w-full">
      <div
        className={`relative mx-2 flex cursor-pointer items-center gap-3 rounded-lg transition-all duration-200 ${
          // Stylowanie zależy od stanu aktywności - aktywny link ma gradient
          isActive
            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        } my-0.5 justify-start px-6 py-2.5`}
      >
        {/* Wskaźnik aktywności - biały pasek po lewej stronie */}
        {isActive && (
          <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
        )}

        {/* Ikona - zmienia kolor w zależności od stanu aktywności */}
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-white" : "text-gray-600 dark:text-gray-400"
          }`}
        />
        {/* Tekst linku */}
        <span
          className={`text-sm font-medium ${
            isActive ? "text-white" : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
