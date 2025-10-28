// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from "./routes/user.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors()); // permite llamadas desde cualquier origen; en LAN está bien
app.use(express.json());

// Rutas
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.json({ message: "API activa. Usa /api/users" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});
