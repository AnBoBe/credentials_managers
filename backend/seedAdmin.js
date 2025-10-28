import { initDB } from "./db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  const db = await initDB();
  const email = "admin@local";
  const exists = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (exists) {
    console.log("Admin ya existe:", exists.email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash("admin123", 10);
  await db.run("INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)", [
    "Administrador",
    email,
    hashed,
    "admin",
  ]);
  console.log("Admin creado: ", email, " / password: admin123");
  process.exit(0);
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
