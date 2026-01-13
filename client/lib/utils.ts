/**
 * Narzędzia pomocnicze dla komponentów UI
 * 
 * Zawiera style i klasy dla Material-UI DataGrid
 * dostosowane do dark mode aplikacji
 */

/**
 * Klasy CSS dla DataGrid (Tailwind)
 * Używane jako className prop w komponencie DataGrid
 */
export const dataGridClassNames =
  "border border-gray-200 bg-white shadow dark:border-stroke-dark dark:bg-dark-secondary dark:text-gray-200";

/**
 * Funkcja zwracająca style Material-UI (sx prop) dla DataGrid
 * 
 * Style są dynamiczne i zależą od trybu ciemnego/jasnego
 * Material-UI używa sx prop do inline styles z obsługą dark mode
 * 
 * @param isDarkMode - czy aplikacja jest w trybie ciemnym
 * @returns obiekt ze stylami dla różnych części DataGrid
 */
export const dataGridSxStyles = (isDarkMode: boolean) => {
  return {
    // Style dla nagłówków kolumn
    "& .MuiDataGrid-columnHeaders": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu - jasny w dark mode
      '& [role="row"] > *': {
        backgroundColor: `${isDarkMode ? "#1d1f21" : "white"}`, // Tło nagłówków
        borderColor: `${isDarkMode ? "#2d3135" : ""}`, // Kolor obramowania
      },
    },
    // Style dla komórek
    "& .MuiDataGrid-cell": {
      border: "none", // Usunięcie domyślnych obramowań
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu w komórkach
    },
    // Style dla wierszy
    "& .MuiDataGrid-row": {
      borderBottom: `1px solid ${isDarkMode ? "#2d3135" : "#e5e7eb"}`, // Dolna krawędź wiersza
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu
      "&:hover": {
        backgroundColor: `${isDarkMode ? "#2d3135" : "#f9fafb"}`, // Tło przy najechaniu
      },
    },
    // Style dla przycisków ikon (np. sortowanie)
    "& .MuiIconButton-root": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`, // Kolor ikon
    },
    // Style dla paginacji
    "& .MuiTablePagination-root": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu paginacji
    },
    "& .MuiTablePagination-selectIcon": {
      color: `${isDarkMode ? "#a3a3a3" : ""}`, // Kolor ikony selecta
    },
    // Style dla paska narzędzi (toolbar)
    "& .MuiDataGrid-toolbarContainer": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu w toolbarze
    },
    // Style dla przycisków w DataGrid
    "& .MuiButton-root": {
      color: `${isDarkMode ? "#e5e7eb" : ""}`, // Kolor tekstu przycisków
    },
    // Style dla obramowań
    "& .MuiDataGrid-withBorderColor": {
      borderColor: `${isDarkMode ? "#2d3135" : "#e5e7eb"}`, // Kolor obramowań
    },
  };
};
