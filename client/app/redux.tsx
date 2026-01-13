/**
 * Konfiguracja Redux Store dla aplikacji
 * 
 * Ten plik odpowiada za:
 * - Konfigurację głównego store Redux
 * - Integrację z Redux Persist (zapisywanie stanu w localStorage)
 * - Konfigurację RTK Query (zarządzanie zapytaniami API)
 * - Eksport typów TypeScript dla bezpieczeństwa typów
 */
import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 * Tworzy pusty storage dla środowiska SSR (Server-Side Rendering)
 * W przeglądarce używamy localStorage, na serwerze - noop storage
 */
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// Wybór storage - localStorage w przeglądarce, noop na serwerze
const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

// Konfiguracja Redux Persist - określa co ma być zapisywane w localStorage
const persistConfig = {
  key: "root", // Klucz pod którym dane są przechowywane
  storage, // Mechanizm storage (localStorage)
  whitelist: ["global"], // Tylko reducer "global" jest zapisywany
};

// Łączenie wszystkich reducerów w jeden główny reducer
const rootReducer = combineReducers({
  global: globalReducer, // Reducer dla globalnego stanu (dark mode, sidebar, etc.)
  [api.reducerPath]: api.reducer, // Reducer dla RTK Query (cache zapytań API)
});

// Aplikowanie Redux Persist do głównego reducera
const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Funkcja tworząca Redux Store
 * 
 * @returns {Store} Skonfigurowany Redux Store z middleware i persist
 */
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
      getDefault({
        serializableCheck: {
          // Ignorowanie akcji Redux Persist w sprawdzaniu serializacji
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware), // Dodanie middleware RTK Query
  });
};

// Typy TypeScript dla bezpieczeństwa typów w komponentach
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Typowane hooki Redux - zapewniają bezpieczeństwo typów
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Provider komponentu Redux Store
 * 
 * Odpowiedzialności:
 * - Tworzy i udostępnia Redux Store dla całej aplikacji
 * - Obsługuje Redux Persist (przywracanie stanu z localStorage)
 * - Konfiguruje RTK Query listeners
 * 
 * @param children - Komponenty potomne, które będą miały dostęp do store
 */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Używamy useRef aby store był tworzony tylko raz (singleton pattern)
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Konfiguracja RTK Query - automatyczne refetch przy reconnect
    setupListeners(storeRef.current.dispatch);
  }
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      {/* PersistGate - czeka na przywrócenie stanu z localStorage przed renderowaniem */}
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
