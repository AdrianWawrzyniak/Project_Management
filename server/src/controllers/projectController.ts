import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving projects: ${error.message}` });
  }
};

export const createProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { name, description, startDate, endDate } = req.body;
  
  if (!name) {
    res.status(400).json({ message: "Project name is required" });
    return;
  }

  try {
    // Upewniamy się, że nie używamy ID z body - pozwalamy Prisma na auto-generowanie
    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      }
    });
    res.status(201).json(newProject);
  } catch (error: any) {
    // Jeśli błąd związany z unique constraint na ID, resetujemy sekwencję
    if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
      try {
        await prisma.$executeRawUnsafe(`
          SELECT setval(pg_get_serial_sequence('"Project"', 'id'), COALESCE((SELECT MAX(id) FROM "Project"), 1), true);
        `);
        // Próbujemy ponownie utworzyć projekt
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