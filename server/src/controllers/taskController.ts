/**
 * Kontroler dla operacji na zadaniach
 * 
 * Odpowiedzialności:
 * - Pobieranie zadań dla konkretnego projektu
 * - Tworzenie nowych zadań
 * - Aktualizacja statusu zadań
 * - Obsługa błędów i walidacja danych
 */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /tasks?projectId=123
 * Pobiera listę zadań dla konkretnego projektu
 * 
 * @param req - Request object, projectId w query params
 * @param res - Response object z listą zadań
 */
export const getTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {projectId}= req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId), // Filtrowanie po ID projektu
      },
      include:{
        // Prisma automatycznie wykonuje JOIN i pobiera powiązane dane
        author: true, // Dane autora zadania (relacja z User)
        assignee: true, // Dane przypisanego użytkownika (relacja z User)
        comments: true, // Wszystkie komentarze do zadania
        attachments: true, // Wszystkie załączniki do zadania
      }
    })
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

/**
 * POST /tasks
 * Tworzy nowe zadanie w bazie danych
 * 
 * @param req - Request object zawierający dane zadania w body
 * @param res - Response object do zwrócenia utworzonego zadania
 */
export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Destrukturyzacja wszystkich pól zadania z request body
  const { 
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;

  // Walidacja wymaganych pól
  if (!title || !projectId || !authorUserId) {
    res.status(400).json({ message: "Title, projectId, and authorUserId are required" });
    return;
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || null,
        priority: priority || null,
        tags: tags || null,
        startDate: startDate ? new Date(startDate) : null, // Konwersja ISO string na Date
        dueDate: dueDate ? new Date(dueDate) : null,
        points: points ? Number(points) : null, // Konwersja na liczbę
        projectId: Number(projectId),
        authorUserId: Number(authorUserId),
        assignedUserId: assignedUserId ? Number(assignedUserId) : null, // Opcjonalne
      }
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    // Obsługa błędu unique constraint - reset sekwencji i ponowna próba
    if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
      try {
        // Resetowanie sekwencji auto-increment dla tabeli Task
        await prisma.$executeRawUnsafe(`
          SELECT setval(pg_get_serial_sequence('"Task"', 'id'), COALESCE((SELECT MAX(id) FROM "Task"), 1), true);
        `);
        const newTask = await prisma.task.create({
          data: {
            title,
            description: description || null,
            status: status || null,
            priority: priority || null,
            tags: tags || null,
            startDate: startDate ? new Date(startDate) : null,
            dueDate: dueDate ? new Date(dueDate) : null,
            points: points ? Number(points) : null,
            projectId: Number(projectId),
            authorUserId: Number(authorUserId),
            assignedUserId: assignedUserId ? Number(assignedUserId) : null,
          }
        });
        res.status(201).json(newTask);
        return;
      } catch (retryError: any) {
        res.status(500).json({ message: `Error creating task: ${retryError.message}` });
        return;
      }
    }
    res.status(500).json({ message: `Error creating a task: ${error.message}` });
  }
};

/**
 * PATCH /tasks/:taskId/status
 * Aktualizuje status konkretnego zadania
 * 
 * Używane głównie w drag-and-drop na BoardView do zmiany statusu zadania
 * 
 * @param req - Request object, taskId w params, status w body
 * @param res - Response object z zaktualizowanym zadaniem
 */
export const updateTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params; // ID zadania z URL
  const { status } = req.body; // Nowy status z request body
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId), // Warunek WHERE - znajdź zadanie po ID
      },
      data:{
        status: status, // Nowa wartość statusu
      }
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating tasks: ${error.message}` });
  }
};