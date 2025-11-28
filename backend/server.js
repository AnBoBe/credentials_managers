import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import https from "https";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), ".env") });

import express from "express";
import cors from "cors";
import sequelize from "./database/database.js";
import userRoutes from "./routes/user.js";
import createMicrosoftRouter from "./routes/auth/microsoft.js";

const app = express();
app.use(
  cors({
    origin: [
      "https://192.168.1.239:5173",   // Vite en LAN
      "http://192.168.1.239:5173",
      "http://localhost:5173",
      "https://localhost:5173"
    ],
    credentials: true
  })
);
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/auth/microsoft", createMicrosoftRouter());

const PORT = process.env.PORT || 4000;
const HOST = "0.0.0.0";
const LAN_IP = "192.168.1.239"; 
const CERT_NAME = "192.168.1.239";

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "certs", "192.168.1.239-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "192.168.1.239.pem")),
  minVersion: "TLSv1.2",
};


sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    console.log("MS_TENANT_ID:", process.env.MS_TENANT_ID);
    console.log("MS_CLIENT_ID:", process.env.MS_CLIENT_ID);

    https.createServer(sslOptions, app).listen(PORT, HOST, () => {
      console.log(`Servidor HTTPS activo en: https://${LAN_IP}:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
