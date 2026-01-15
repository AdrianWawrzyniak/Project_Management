/**
 * RTK Query API - centralne zarządzanie zapytaniami do backendu
 *
 * Ten plik definiuje:
 * - Wszystkie endpointy API (GET, POST, PATCH)
 * - Typy TypeScript dla danych (Project, Task, User, Team)
 * - Automatyczne cache'owanie i invalidation
 * - Generowane hooki React do używania w komponentach
 */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Interfejs reprezentujący projekt w systemie
 */
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string; // Data rozpoczęcia w formacie ISO
  endDate?: string; // Data zakończenia w formacie ISO
}

/**
 * Enum reprezentujący priorytety zadań
 */
export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

/**
 * Enum reprezentujący statusy zadań
 */
export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

/**
 * Interfejs reprezentujący użytkownika w systemie
 */
export interface User {
  userId?: number;
  username: string;
  profilePictureUrl?: string; // URL do zdjęcia profilowego
  teamId?: number; // ID zespołu do którego należy użytkownik
}

/**
 * Interfejs reprezentujący załącznik do zadania
 */
export interface Attachment {
  id: number;
  fileURL: string; // URL do pliku
  fileName: string;
  taskId: number; // ID zadania do którego jest przypisany
  uploadedById: number; // ID użytkownika który dodał załącznik
}

/**
 * Interfejs reprezentujący zadanie w systemie
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string; // Tagi oddzielone przecinkami
  startDate?: string;
  dueDate?: string;
  points?: number; // Punkty story points
  projectId: number; // ID projektu do którego należy zadanie
  authorUserId?: number; // ID użytkownika który utworzył zadanie
  assignedUserId?: number; // ID użytkownika któremu przypisano zadanie

  // Relacje - pobierane przez include w zapytaniu
  author?: User;
  assignee?: User;
  comments?: Comment[];
  attachments?: Attachment[];
}

/**
 * Interfejs reprezentujący wyniki wyszukiwania
 */
export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

/**
 * Interfejs reprezentujący zespół w systemie
 */
export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number; // ID Product Ownera
  projectManagerUserId?: number; // ID Project Managera
}

/**
 * Główna konfiguracja RTK Query API
 *
 * RTK Query automatycznie:
 * - Cache'uje wyniki zapytań
 * - Inwaliduje cache gdy dane się zmieniają
 * - Generuje hooki React (useGetProjectsQuery, useCreateProjectMutation, etc.)
 * - Obsługuje loading states i error handling
 */
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL }),
  reducerPath: "api", // Ścieżka w Redux store gdzie dane są przechowywane
  tagTypes: ["Projects", "Tasks", "Users", "Teams"], // Tagi do zarządzania cache

  endpoints: (build) => ({
    /**
     * Endpoint GET - pobiera listę wszystkich projektów
     * providesTags - oznacza że dane są cache'owane z tagiem "Projects"
     */
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),

    /**
     * Endpoint POST - tworzy nowy projekt
     * invalidatesTags - unieważnia cache "Projects" po utworzeniu, wymuszając refetch
     */
    createProject: build.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: "projects",
        method: "POST",
        body: project,
      }),
      invalidatesTags: ["Projects"],
    }),

    /**
     * Endpoint GET - pobiera zadania dla konkretnego projektu
     * Dynamiczne tagi - każdy task ma swój tag, co pozwala na precyzyjną invalidation
     */
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks" as const, id }))
          : [{ type: "Tasks" as const }],
    }),

    /**
     * Endpoint POST - tworzy nowe zadanie
     */
    createTask: build.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: "tasks",
        method: "POST",
        body: task,
      }),
      invalidatesTags: ["Tasks"],
    }),

    /**
     * Endpoint PATCH - aktualizuje status zadania
     * Invaliduje tylko konkretny task (po ID), nie wszystkie
     */
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Tasks", id: taskId },
      ],
    }),

    /**
     * Endpoint GET - pobiera listę wszystkich użytkowników
     */
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),

    /**
     * Endpoint GET - pobiera listę wszystkich zespołów
     */
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),

    /**
     * Endpoint GET - wyszukiwanie w zadaniach, projektach i użytkownikach
     */
    search: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
  }),
});

/**
 * Eksport wygenerowanych hooków React
 *
 * RTK Query automatycznie generuje hooki dla każdego endpointa:
 * - use[Endpoint]Query - dla zapytań GET (zwraca { data, isLoading, error })
 * - use[Endpoint]Mutation - dla mutacji POST/PATCH (zwraca [mutate, { isLoading, error }])
 *
 * Przykład użycia:
 * const { data: projects, isLoading } = useGetProjectsQuery();
 * const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
 */
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchQuery,
  useGetUsersQuery,
  useGetTeamsQuery,
} = api;
