import express from "express";
import cors from "cors";
import sequelize from "./database/database.js";
import userRoutes from "./routes/user.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);

const PORT = 4000;

sequelize.sync({ force: false })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en http://localhost:${PORT}`)
    );
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
