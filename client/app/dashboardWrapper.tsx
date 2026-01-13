/**
 * DashboardWrapper - główny layout aplikacji
 * 
 * Struktura:
 * - StoreProvider - opakowuje całą aplikację w Redux Provider
 * - DashboardLayout - zarządza układem (Sidebar + Navbar + content)
 * 
 * Odpowiedzialności:
 * - Zarządzanie trybem ciemnym (dodawanie klasy "dark" do html)
 * - Układ responsywny z Sidebar i Navbar
 * - Przekazywanie Redux Store do wszystkich komponentów
 */
"use client";

import React, { useEffect } from "react";
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";

/**
 * DashboardLayout - główny layout strony
 * 
 * Zawiera:
 * - Sidebar (boczny panel nawigacyjny)
 * - Navbar (górny pasek)
 * - Główną treść (children)
 */
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  // Pobieranie stanu z Redux
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Synchronizacja trybu ciemnego z klasą CSS na elemencie <html>
  // Tailwind używa klasy "dark" do przełączania między motywami
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 dark:text-gray-100">
      {/* Sidebar - zawsze renderowany, ale może być ukryty */}
      <Sidebar />
      
      {/* Główna sekcja - zawiera Navbar i treść */}
      <main
        className={`flex w-full flex-col transition-all duration-300 ${
          // Dodaj padding-left tylko gdy sidebar nie jest zwinięty (na większych ekranach)
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {/* Główna treść strony - tutaj renderują się poszczególne strony */}
        <div className="flex-1 overflow-auto bg-gray-50/50 dark:bg-gray-950/50">
          {children}
        </div>
      </main>
    </div>
  );
};

/**
 * DashboardWrapper - wrapper opakowujący całą aplikację w Redux Provider
 * 
 * To jest najwyższy komponent w hierarchii, który:
 * - Inicjalizuje Redux Store
 * - Udostępnia store wszystkim komponentom potomnym
 * - Renderuje główny layout aplikacji
 */
const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
};

export default DashboardWrapper;
