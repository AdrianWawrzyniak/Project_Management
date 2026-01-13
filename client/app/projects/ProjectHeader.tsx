/**
 * Komponent ProjectHeader - nagłówek strony projektu
 *
 * Funkcjonalność:
 * - Wyświetla tytuł projektu
 * - Przycisk do tworzenia nowego projektu (otwiera modal)
 * - Zakładki do przełączania między widokami (Board, List, Timeline, Table)
 * - Przyciski filtrowania i udostępniania
 * - Pole wyszukiwania zadań
 *
 * @param activeTab - Aktualnie aktywna zakładka (Board/List/Timeline/Table)
 * @param setActiveTab - Funkcja do zmiany aktywnej zakładki
 */
import {
  Clock,
  Filter,
  Grid3x2,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import Header from "../(components)/Header";
import React, { useState } from "react";
import ProjectModal from "./ProjectModal";

type Props = {
  activeTab: string; // Nazwa aktywnej zakładki
  setActiveTab: (tabName: string) => void; // Funkcja zmiany zakładki
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  // Stan lokalny - kontroluje widoczność modala tworzenia projektu
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  return (
    <div className="mx-auto max-w-[95%] px-6 py-6 xl:max-w-[1600px] 2xl:max-w-[1800px]">
      <ProjectModal
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="mb-6">
        <Header
          name="Product Design Development"
          buttonComponent={
            <button
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="h-5 w-5" /> New Board
            </button>
          }
        />
      </div>

      <div className="flex flex-wrap-reverse items-center gap-3 border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex flex-1 items-center gap-1">
          <TabButton
            name="Board"
            icon={<Grid3x2 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="rounded-xl border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm transition-all focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-indigo-400 dark:focus:bg-gray-800 dark:focus:ring-indigo-900/50"
            />
            <Grid3x3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Interfejs dla propsów komponentu TabButton
 */
type TabButtonProps = {
  name: string; // Nazwa zakładki (Board, List, Timeline, Table)
  icon: React.ReactNode; // Ikona wyświetlana obok nazwy
  setActiveTab: (tabName: string) => void; // Funkcja zmiany aktywnej zakładki
  activeTab: string; // Aktualnie aktywna zakładka
};

/**
 * Komponent TabButton - pojedyncza zakładka w ProjectHeader
 *
 * Funkcjonalność:
 * - Wyświetla ikonę i nazwę widoku
 * - Podświetla się gdy jest aktywna (gradient)
 * - Wywołuje setActiveTab po kliknięciu
 */
const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  // Sprawdzenie czy ta zakładka jest aktualnie aktywna
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
        isActive
          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
