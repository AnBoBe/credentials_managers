// backend/routes/user.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();
const SECRET_KEY = "claveultrasecreta";

// Registrar usuario
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol, pw } = req.body;

    // Validar que el pw no exista
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
    });

    res.status(201).json({ message: "Usuario creado correctamente", user: newUser });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
});

// Login con PW
router.post("/login", async (req, res) => {
  try {
    const { pw, password } = req.body;

    const user = await User.findOne({ where: { pw } });
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Credenciales incorrectas" });

    // Si debe cambiar contraseña, no generamos token aún
    if (user.mustChangePassword) {
      return res.json({
        mustChangePassword: true,
        message: "Debes cambiar tu contraseña antes de continuar",
      });
    }

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

// Cambiar contraseña (solo si mustChangePassword = true)
router.post("/change-password", async (req, res) => {
  try {
    const { pw, newPassword, confirmPassword } = req.body;

    if (!newPassword || newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    const user = await User.findOne({ where: { pw } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.mustChangePassword = false;
    await user.save();

    res.json({ message: "Contraseña cambiada correctamente, ahora puedes iniciar sesión" });
  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
});

// Obtener usuarios (filtrado por rol)
router.get("/", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token requerido" });

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_KEY);

    // Si es admin -> ve todos
    if (decoded.rol === "admin") {
      const users = await User.findAll({
        attributes: ["id", "nombre", "email", "rol", "pw", "img"],
      });
      return res.json(users);
    }

    // Si es user -> solo ve su propio registro
    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img"],
    });
    return res.json([user]);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

// Eliminar usuario
router.delete("/:id", async (req, res) => {
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
