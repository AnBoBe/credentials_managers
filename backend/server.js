// backend/server.js
import express from "express";
import cors from "cors";
import sequelize from "./database/database.js";
import userRoutes from "./routes/user.js";
import User from "./models/user.js";

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/user", userRoutes);

// Sincronizar DB y arrancar servidor
sequelize
  .sync()
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    app.listen(4000, "0.0.0.0", () => {
      console.log("Servidor escuchando en http://localhost:4000");
    });
  })
  .catch((err) => console.error("Error al conectar con la DB:", err));
