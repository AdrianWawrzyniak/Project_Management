/**
 * Prisma Seed Script - skrypt do wypełniania bazy danych danymi testowymi
 * 
 * Funkcjonalność:
 * - Czyści wszystkie istniejące dane z bazy
 * - Wczytuje dane z plików JSON w katalogu seedData
 * - Tworzy rekordy w odpowiedniej kolejności (z uwzględnieniem relacji)
 * - Resetuje sekwencje auto-increment w PostgreSQL
 * 
 * Uruchomienie: npx prisma db seed
 */
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();

/**
 * Funkcja pomocnicza do usuwania danych (nieużywana, zastąpiona przez deleteOrder)
 * @param orderedFileNames - lista nazw plików JSON
 */
async function deleteAllData(orderedFileNames: string[]) {
  const modelNames = orderedFileNames.map((fileName) => {
    // Konwersja nazwy pliku na nazwę modelu Prisma (np. "user.json" -> "User")
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

/**
 * Główna funkcja seed - wykonuje cały proces wypełniania bazy danych
 */
async function main() {
  // Ścieżka do katalogu z plikami JSON zawierającymi dane testowe
  const dataDirectory = path.join(__dirname, "seedData");

  // Kolejność wczytywania danych - ważna ze względu na relacje między tabelami
  // Najpierw tabele niezależne (team, project), potem zależne (user, task, etc.)
  const orderedFileNames = [
    "team.json", // Zespoły - niezależne
    "project.json", // Projekty - niezależne
    "projectTeam.json", // Relacja wiele-do-wielu między projektami a zespołami
    "user.json", // Użytkownicy - mogą zależeć od team
    "task.json", // Zadania - zależą od project i user
    "attachment.json", // Załączniki - zależą od task i user
    "comment.json", // Komentarze - zależą od task i user
    "taskAssignment.json", // Przypisania zadań - zależą od task i user
  ];

  // Kolejność usuwania danych - odwrotna do kolejności wczytywania
  // Najpierw tabele zależne (aby uniknąć błędów foreign key constraint)
  const deleteOrder = [
    "taskAssignment", // Najpierw tabele z relacjami
    "attachment",
    "comment",
    "task",
    "projectTeam",
    "user",
    "project", // Potem tabele główne
    "team",
  ];

  // Krok 1: Usuwanie wszystkich istniejących danych
  // Ważne: usuwamy w kolejności odwrotnej do zależności (najpierw zależne, potem niezależne)
  for (const modelName of deleteOrder) {
    const model: any = prisma[modelName as keyof typeof prisma];
    try {
      await model.deleteMany({}); // Usuwa wszystkie rekordy z tabeli
      console.log(`Cleared data from ${modelName}`);
    } catch (error) {
      console.error(`Error clearing data from ${modelName}:`, error);
    }
  }

  // Krok 2: Wczytywanie danych z plików JSON i tworzenie rekordów
  // Ważne: wczytujemy w kolejności zgodnej z zależnościami (najpierw niezależne, potem zależne)
  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    // Wczytanie i parsowanie pliku JSON
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    // Konwersja nazwy pliku na nazwę modelu Prisma (np. "user.json" -> "user")
    const modelName = path.basename(fileName, path.extname(fileName));
    const model: any = prisma[modelName as keyof typeof prisma];

    try {
      // Tworzenie rekordów jeden po drugim
      for (const data of jsonData) {
        await model.create({ data });
      }
      console.log(`Seeded ${modelName} with data from ${fileName}`);
    } catch (error) {
      console.error(`Error seeding data for ${modelName}:`, error);
    }
  }

  // Krok 3: Resetowanie sekwencji auto-increment w PostgreSQL
  // 
  // Problem: Gdy seed data używa konkretnych ID (np. 1, 2, 3), sekwencja PostgreSQL
  // może nie być zsynchronizowana. Następne auto-increment próbowałoby użyć ID 1,
  // które już istnieje, co powoduje błąd unique constraint.
  //
  // Rozwiązanie: Resetujemy sekwencję do maksymalnego ID w tabeli + 1
  // Dzięki temu następne auto-increment będzie używać poprawnego ID
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

// Uruchomienie funkcji main i zamknięcie połączenia z bazą danych
main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());