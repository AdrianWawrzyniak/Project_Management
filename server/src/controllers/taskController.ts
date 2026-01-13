import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {projectId}= req.query;
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include:{
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      }
    })
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving tasks: ${error.message}` });
  }
};

export const createTask = async (
  req: Request,
  res: Response,
): Promise<void> => {
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
        startDate: startDate ? new Date(startDate) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        points: points ? Number(points) : null,
        projectId: Number(projectId),
        authorUserId: Number(authorUserId),
        assignedUserId: assignedUserId ? Number(assignedUserId) : null,
      }
    });
    res.status(201).json(newTask);
  } catch (error: any) {
    // Jeśli błąd związany z unique constraint na ID, resetujemy sekwencję
    if (error.code === 'P2002' && error.meta?.target?.includes('id')) {
      try {
        await prisma.$executeRawUnsafe(`
          SELECT setval(pg_get_serial_sequence('"Task"', 'id'), COALESCE((SELECT MAX(id) FROM "Task"), 1), true);
        `);
        // Próbujemy ponownie utworzyć task
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

export const updateTaskStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { taskId } = req.params;
  const { status } = req.body;
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data:{
        status: status,
      }
    });
    res.json(updatedTask);
  } catch (error: any) {
    res.status(500).json({ message: `Error updating tasks: ${error.message}` });
  }
};