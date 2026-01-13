/**
 * Główny plik serwera Express.js
 * 
 * Odpowiedzialności:
 * - Konfiguracja serwera Express
 * - Konfiguracja middleware (CORS, Helmet, Body Parser)
 * - Rejestracja wszystkich routów API
 * - Uruchomienie serwera na określonym porcie
 */
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import searchRoutes from "./routes/searchRoutes"
import userRoutes from "./routes/userRoutes"
import teamRoutes from "./routes/teamRoutes"

// Ładowanie zmiennych środowiskowych z pliku .env
dotenv.config();
const app = express();

// Middleware - kolejność ma znaczenie!
app.use(express.json()); // Parsowanie JSON w request body
app.use(helmet()); // Zabezpieczenia HTTP headers
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // CORS policy
app.use(morgan("common")); // Logowanie requestów HTTP
app.use(bodyParser.json()); // Parsowanie JSON
app.use(bodyParser.urlencoded({ extended: false })); // Parsowanie URL-encoded
app.use(cors()); // Włączanie CORS dla wszystkich originów

// Route główny - endpoint testowy
app.get("/", (req, res) => {
  res.send("This is home route");
});

// Rejestracja routów API - każdy route obsługuje konkretną domenę
app.use("/projects", projectRoutes); // Endpointy dla projektów
app.use("/tasks", taskRoutes); // Endpointy dla zadań
app.use("/search", searchRoutes); // Endpointy dla wyszukiwania
app.use("/users", userRoutes); // Endpointy dla użytkowników
app.use("/teams", teamRoutes); // Endpointy dla zespołów

// Uruchomienie serwera na porcie z .env lub domyślnie 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
