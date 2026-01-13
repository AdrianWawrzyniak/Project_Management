/**
 * Redux Slice dla globalnego stanu aplikacji
 * 
 * Przechowuje:
 * - Stan zwinięcia/rozwinięcia Sidebar
 * - Tryb ciemny/jasny aplikacji
 * 
 * Redux Toolkit automatycznie generuje:
 * - Action creators (setIsSidebarCollapsed, setIsDarkMode)
 * - Reducer do aktualizacji stanu
 * - Immutable updates (używa Immer pod spodem)
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interfejs definiujący strukturę globalnego stanu
 */
export interface initialStateTypes {
  isSidebarCollapsed: boolean; // Czy sidebar jest zwinięty
  isDarkMode: boolean; // Czy aplikacja jest w trybie ciemnym
}

// Początkowy stan aplikacji
const initialState: initialStateTypes = {
  isSidebarCollapsed: false, // Sidebar domyślnie rozwinięty
  isDarkMode: false, // Tryb jasny domyślnie
};

/**
 * Redux Slice - definicja reducera i akcji
 * 
 * createSlice automatycznie:
 * - Tworzy action creators
 * - Tworzy reducer z logiką aktualizacji stanu
 * - Używa Immer do immutable updates (możemy mutować state bezpośrednio)
 */
export const globalSlice = createSlice({
  name: "global", // Nazwa slice w Redux store
  initialState,
  reducers: {
    /**
     * Akcja do zmiany stanu zwinięcia Sidebar
     * @param state - aktualny stan
     * @param action - payload zawierający boolean (true = zwinięty, false = rozwinięty)
     */
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    /**
     * Akcja do zmiany trybu ciemnego/jasnego
     * @param state - aktualny stan
     * @param action - payload zawierający boolean (true = ciemny, false = jasny)
     */
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
  },
});

// Eksport action creators - używane w komponentach do dispatch'owania akcji
export const { setIsSidebarCollapsed, setIsDarkMode } = globalSlice.actions;

// Eksport reducera - używany w configureStore
export default globalSlice.reducer;
