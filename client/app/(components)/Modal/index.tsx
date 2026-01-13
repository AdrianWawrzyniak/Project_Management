/**
 * Komponent Modal - uniwersalny modal do wyświetlania formularzy i treści
 * 
 * Funkcjonalność:
 * - Renderuje się poza głównym drzewem DOM (React Portal)
 * - Wyświetla tło z efektem blur
 * - Zawiera nagłówek z przyciskiem zamykania
 * - Obsługuje dark mode
 * 
 * Używany w:
 * - ProjectModal (tworzenie projektów)
 * - TaskModal (tworzenie zadań)
 */
import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type Props = {
  children: React.ReactNode; // Zawartość modala (formularz, treść, etc.)
  isOpen: boolean; // Czy modal jest otwarty
  onClose: () => void; // Funkcja zamykania modala
  name: string; // Tytuł wyświetlany w nagłówku
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  // Jeśli modal nie jest otwarty, nie renderuj nic
  if (!isOpen) return null;
  
  // React Portal - renderuje modal poza głównym drzewem DOM (bezpośrednio w body)
  // To zapewnia że modal zawsze będzie na wierzchu i nie będzie problemów z z-index
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600 bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg dark:bg-dark-secondary">
        <Header
          name={name}
          buttonComponent={
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-indigo-600"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
