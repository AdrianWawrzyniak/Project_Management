import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    const modelName = path.basename(fileName, path.extname(fileName));
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  });

  for (const modelName of modelNames) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }
}

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  const orderedFileNames = [
    "team.json",
    "project.json",
    "projectTeam.json",
    "user.json",
    "task.json",
    "attachment.json",
    "comment.json",
    "taskAssignment.json",
  ];

  // Usuwanie w odpowiedniej kolejności (najpierw tabele zależne)
  const deleteOrder = [
    "taskAssignment",
    "attachment",
    "comment",
    "task",
    "projectTeam",
    "user",
    "project",
    "team",
  ];

  for (const modelName of deleteOrder) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({});
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }

  // Resetowanie sekwencji auto-increment dla wszystkich tabel
  try {
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Project"', 'id'), COALESCE((SELECT MAX(id) FROM "Project"), 1), true);
      SELECT setval(pg_get_serial_sequence('"Team"', 'id'), COALESCE((SELECT MAX(id) FROM "Team"), 1), true);
      SELECT setval(pg_get_serial_sequence('"Task"', 'id'), COALESCE((SELECT MAX(id) FROM "Task"), 1), true);
      SELECT setval(pg_get_serial_sequence('"User"', '"userId"'), COALESCE((SELECT MAX("userId") FROM "User"), 1), true);
      SELECT setval(pg_get_serial_sequence('"ProjectTeam"', 'id'), COALESCE((SELECT MAX(id) FROM "ProjectTeam"), 1), true);
      SELECT setval(pg_get_serial_sequence('"TaskAssignment"', 'id'), COALESCE((SELECT MAX(id) FROM "TaskAssignment"), 1), true);
      SELECT setval(pg_get_serial_sequence('"Attachment"', 'id'), COALESCE((SELECT MAX(id) FROM "Attachment"), 1), true);
      SELECT setval(pg_get_serial_sequence('"Comment"', 'id'), COALESCE((SELECT MAX(id) FROM "Comment"), 1), true);
    `);
    console.log("Reset sequences for auto-increment IDs");
  } catch (error) {
    console.error("Error resetting sequences:", error);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());