import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env antes de cualquier uso de process.env
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import sequelize from "./database/database.js";
import userRoutes from "./routes/user.js";
import createMicrosoftRouter from "./routes/auth/microsoft.js"; // Importar función

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/user", userRoutes);
app.use("/api/auth/microsoft", createMicrosoftRouter()); // Crear el router

// Puerto
const PORT = process.env.PORT || 4000;

// Sincronizar base de datos y levantar servidor
sequelize.sync({ force: false })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    console.log("MS_TENANT_ID:", process.env.MS_TENANT_ID); // Verificar carga de variables
    console.log("MS_CLIENT_ID:", process.env.MS_CLIENT_ID);
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
