import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const SECRET_KEY = "claveultrasecreta";

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol, pw, meta } = req.body;

    const existing = await User.findOne({ where: { pw } });
    if (existing) return res.status(400).json({ error: "El PW ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol,
      pw,
      mustChangePassword: true,
      meta: meta ? JSON.stringify(meta) : "{}",
    });

    res.status(201).json({
      message: "Usuario creado correctamente",
      user: newUser,
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { pw, password } = req.body;

    const user = await User.findOne({ where: { pw } });
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, nombre: user.nombre },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rol,
        pw: user.pw,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el login" });
  }
});

// Obtener todos los usuarios o uno específico
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.rol === "admin") {
      const users = await User.findAll({
        attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
      });

      const parsed = users.map((u) => {
        const data = u.toJSON();
        try {
          if (typeof data.meta === "string") data.meta = JSON.parse(data.meta);
        } catch {
          data.meta = {};
        }
        return data;
      });

      return res.json(parsed);
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    let data = user.toJSON();
    try {
      if (typeof data.meta === "string") data.meta = JSON.parse(data.meta);
    } catch {
      data.meta = {};
    }

    res.json([data]);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Obtener usuario por ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const plainUser = user.toJSON();

    try {
      if (typeof plainUser.meta === "string") plainUser.meta = JSON.parse(plainUser.meta);
    } catch {
      plainUser.meta = {};
    }

    res.json(plainUser);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

// Eliminar usuario
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy();

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
});

export default router;
