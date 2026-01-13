/**
 * Komponent Header - uniwersalny nagłówek strony
 * 
 * Używany w:
 * - Stronach głównych (Home, Users, Teams)
 * - Modalach (jako nagłówek modala)
 * - Projektach (ProjectHeader)
 * 
 * @param name - Tekst nagłówka
 * @param buttonComponent - Opcjonalny komponent przycisku po prawej stronie
 * @param isSmallText - Czy użyć mniejszego rozmiaru tekstu (domyślnie false)
 */
import React from "react";

type Props = {
  name: string;
  buttonComponent?: any; // Opcjonalny komponent React (np. przycisk)
  isSmallText?: boolean; // Czy użyć mniejszego rozmiaru czcionki
};

const Header = ({ name, buttonComponent, isSmallText = false }: Props) => {
  return (
    <div className="mb-6 flex w-full items-center justify-between">
      {/* Nagłówek - rozmiar zależy od prop isSmallText */}
      <h1
        className={`${isSmallText ? "text-xl" : "text-3xl"} font-bold tracking-tight text-gray-900 dark:text-gray-100`}
      >
        {name}
      </h1>
      {/* Opcjonalny komponent po prawej stronie (np. przycisk "New Project") */}
      {buttonComponent}
    </div>
  );
};

export default Header;
