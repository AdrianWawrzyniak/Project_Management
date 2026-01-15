/**
 * Kontroler dla operacji na projektach
 * 
 * Odpowiedzialności:
 * - Pobieranie listy projektów
 * - Tworzenie nowych projektów
 * - Obsługa błędów i walidacja danych
 */
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

// Instancja Prisma Client - ORM do komunikacji z bazą danych PostgreSQL
const prisma = new PrismaClient();

/**
 * GET /projects
 * Pobiera listę wszystkich projektów z bazy danych
 * 
 * @param req - Request object z Express
 * @param res - Response object z Express
 */
export const getProjects = async (
  _: Request,
  res: Response,
): Promise<void> => {
  try {
    // Prisma automatycznie generuje metodę findMany() na podstawie schema.prisma
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
  }
};

/**
 * POST /projects
 * Tworzy nowy projekt w bazie danych
 * 
 * @param req - Request object zawierający dane projektu w body
 * @param res - Response object do zwrócenia utworzonego projektu
 */
export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Destrukturyzacja danych z request body
  const { name, description, startDate, endDate } = req.body;
  
  // Walidacja - nazwa projektu jest wymagana
  if (!name) {
    res.status(400).json({ message: "Project name is required" });
    return;
  }

  try {
    // Tworzenie projektu w bazie danych
    // Prisma automatycznie generuje ID (auto-increment)
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || null, // Opcjonalne pole
        startDate: startDate ? new Date(startDate) : null, // Konwersja string na Date
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    // Obsługa błędu unique constraint na ID - problem z sekwencją PostgreSQL
    // Może wystąpić gdy seed data używa konkretnych ID, a sekwencja nie jest zsynchronizowana
    if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
      try {
        // Resetowanie sekwencji auto-increment do maksymalnego ID w tabeli
        await prisma.$executeRawUnsafe(`
          SELECT setval(pg_get_serial_sequence('"Project"', 'id'), COALESCE((SELECT MAX(id) FROM "Project"), 1), true);
        `);
        // Ponowna próba utworzenia projektu
        const newProject = await prisma.project.create({
          data: {
            name,
            description: description || null,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
          }
        });
        res.status(201).json(newProject);
        return;
      } catch (retryError: any) {
        res.status(500).json({ message: `Error creating project: ${retryError.message}` });
        return;
      }
    }
    res.status(500).json({ message: `Error creating project: ${error.message}` });
  }
};