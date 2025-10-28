// backend/routes/users.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { initDB } from "../db.js";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET || "secret_dev_key";

const router = express.Router();

// REGISTRAR USUARIO
router.post("/register", async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email y password requeridos" });

  try {
    const db = await initDB();
    const hashed = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre || "", email, hashed, rol || "user"]
    );
    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    if (error?.message?.includes("UNIQUE")) {
      res.status(400).json({ error: "El email ya está registrado" });
    } else {
      console.error("Register error:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email y password requeridos" });

  try {
    const db = await initDB();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign({ id: user.id, rol: user.rol, nombre: user.nombre }, SECRET_KEY, { expiresIn: "8h" });

    res.json({ message: "Login exitoso", token, rol: user.rol, nombre: user.nombre });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// MIDDLEWARE para verificar token y adjuntar payload
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Token inválido" });
  }
};

// OBTENER TODOS LOS USUARIOS (solo admin)
router.get("/", authenticate, async (req, res) => {
  if (req.user?.rol !== "admin") return res.status(403).json({ error: "Acceso denegado" });

  try {
    const db = await initDB();
    const users = await db.all("SELECT id, nombre, email, rol FROM users");
    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// OBTENER USUARIO POR ID (admin o el mismo usuario)
router.get("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  if (req.user?.rol !== "admin" && Number(req.user?.id) !== Number(id)) {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  try {
    const db = await initDB();
    const user = await db.get("SELECT id, nombre, email, rol FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    console.error("Get user by id error:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// EDITAR USUARIO (solo admin o el mismo usuario)
router.put("/:id", authenticate, async (req, res) => {
  const id = req.params.id;
  const { nombre, email, password, rol } = req.body;

  if (req.user?.rol !== "admin" && Number(req.user?.id) !== Number(id)) {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  try {
    const db = await initDB();

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      await db.run("UPDATE users SET nombre=?, email=?, password=?, rol=? WHERE id=?", [nombre, email, hashed, rol, id]);
    } else {
      await db.run("UPDATE users SET nombre=?, email=?, rol=? WHERE id=?", [nombre, email, rol, id]);
    }

    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
});

// ELIMINAR USUARIO (solo admin)
router.delete("/:id", authenticate, async (req, res) => {
  if (req.user?.rol !== "admin") return res.status(403).json({ error: "Acceso denegado" });

  try {
    const db = await initDB();
    await db.run("DELETE FROM users WHERE id = ?", [req.params.id]);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
});

export default router;
