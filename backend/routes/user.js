// backend/routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const SECRET_KEY = "claveultrasecreta"; // cámbiala en producción

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol, pw } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
      pw,
    });

    res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: "Credenciales incorrectas" });

  const token = jwt.sign(
    { id: user.id, rol: user.rol, nombre: user.nombre },
    SECRET_KEY,
    { expiresIn: "8h" }
  );

  res.json({ message: "Login exitoso", token });
});

// Obtener todos los usuarios (solo para admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

export default router;
