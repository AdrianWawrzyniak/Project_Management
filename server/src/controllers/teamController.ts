import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
   const teams = await prisma.team.findMany();

   const teamsWithUsernames = await Promise.all(
    teams.map(async (team: any) => {
      const productOwner = team.productOwnerUserId
        ? await prisma.user.findUnique({
            where: { userId: team.productOwnerUserId },
            select: { username: true },
          })
        : null;

      const projectManager = team.projectManagerUserId
        ? await prisma.user.findUnique({
            where: { userId: team.projectManagerUserId },
            select: { username: true },
          })
        : null;

      return {
        teamId: team.id,
        teamName: team.teamName,
        productOwnerUserId: team.productOwnerUserId,
        projectManagerUserId: team.projectManagerUserId,
        productOwnerUsername: productOwner?.username || null,
        projectManagerUsername: projectManager?.username || null,
      };
    })
   );

    res.json(teamsWithUsernames);
  } catch (error: any) {
    res.status(500).json({ message: `Error retrieving teams: ${error.message}` });
  }
};

