/**
 * Strona główna aplikacji - Dashboard projektu
 *
 * Funkcjonalność:
 * - Wyświetla listę projektów do wyboru
 * - Pokazuje statystyki zadań (wykresy priorytetów i statusów projektów)
 * - Wyświetla tabelę zadań dla wybranego projektu
 * - Recharts do wizualizacji danych
 */
"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React, { useState, useEffect } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../(components)/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/dataGridStyles";

// Kolory używane w wykresach kołowych
const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899"];

const HomePage = () => {
  // Pobieranie listy projektów z API
  const { data: projects, isLoading: isProjectLoading } = useGetProjectsQuery();

  // Stan lokalny - ID wybranego projektu
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null,
  );

  // Pobieranie trybu ciemnego z Redux
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Automatyczne wybranie pierwszego projektu gdy lista się załaduje
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery(
    { projectId: selectedProjectId! },
    { skip: !selectedProjectId },
  );

  if (isProjectLoading)
    return (
      <div className="p-8 text-gray-700 dark:text-gray-300">Loading...</div>
    );
  if (!projects || projects.length === 0)
    return (
      <div className="p-8 text-gray-700 dark:text-gray-300">
        No projects available
      </div>
    );

  const taskCoulmns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 150 },
  ];
  const chartColors = isDarkMode
    ? {
        bar: "#6366f1",
        barGrid: "#2d3142",
        pieFill: "#8b5cf6",
        text: "#FFFFFF",
      }
    : {
        bar: "#6366f1",
        barGrid: "#E0E0E0",
        pieFill: "#8b5cf6",
        text: "#000000",
      };
  const priorityCount =
    tasks?.reduce((acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    }, {}) || {};

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? " Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  return (
    <div className="container mx-auto h-full w-full max-w-[95%] px-6 py-8 xl:max-w-[1600px] 2xl:max-w-[1800px]">
      <Header name="Project Management Dashboard" />
      <div className="mb-6">
        <label
          htmlFor="project-select"
          className="mb-2.5 block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Select Project:
        </label>
        <select
          id="project-select"
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="w-full max-w-md rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800/90 dark:text-gray-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/50"
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-gray-900/50">
          <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
              />
              <XAxis dataKey="name" stroke={chartColors.text} />
              <YAxis stroke={chartColors.text} />
              <Tooltip
                contentStyle={{
                  width: "min-content",
                  height: "min-content",
                }}
              />
              <Legend />
              <Bar dataKey="count" fill={chartColors.bar} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-gray-900/50">
          <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie dataKey="count" data={projectStatus} fill="#82ca9d" label>
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-gray-900/50 md:col-span-2">
          <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
            Your Tasks
          </h3>
          {tasksError ? (
            <div className="rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
              Error fetching tasks
            </div>
          ) : (
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={tasks || []}
                columns={taskCoulmns}
                checkboxSelection
                loading={tasksLoading}
                getRowClassName={() => "data-grid-row"}
                getCellClassName={() => "data-grid-cell"}
                className={dataGridClassNames}
                sx={dataGridSxStyles(isDarkMode)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
