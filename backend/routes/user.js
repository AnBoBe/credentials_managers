import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { verifyToken } from "../middleware/auth.js";
import { SECRET_KEY } from "../config/config.js";

const router = express.Router();

function safeParseMeta(meta) {
  if (!meta) meta = {};

  try {
    meta = typeof meta === "string" ? JSON.parse(meta) : meta;

    const m = {};
    for (const key in meta) {
      m[key.toLowerCase()] = meta[key];
    }

    const normalized = {
      tradeeu: {
        teams: m.tradeeu?.teams || "",
        correo: m.tradeeu?.correo || "",
        contraseña: m.tradeeu?.contraseña || "",
        DID_Voiso: {
          correo: m.tradeeu?.DID_Voiso?.correo || "",
          contraseña: m.tradeeu?.DID_Voiso?.contraseña || "",
        },
        Voicespin: {
          agent: m.tradeeu?.Voicespin?.agent || "",
          ext: m.tradeeu?.Voicespin?.ext || "",
          secret_extension: m.tradeeu?.Voicespin?.secret_extension || "",
        },
        omni: {
          usuario: m.tradeeu?.omni?.usuario || "",
          contraseña: m.tradeeu?.omni?.contraseña || "",
        },
        crm: {
          correo: m.tradeeu?.crm?.correo || "",
          contraseña: m.tradeeu?.crm?.contraseña || "",
        },
        winauth: m.tradeeu?.winauth || "",
      },

      algobi: {
        teams: m.algobi?.teams || "",
        correo: m.algobi?.correo || "",
        contraseña: m.algobi?.contraseña || "",
        DID_Voiso: {
          correo: m.algobi?.DID_Voiso?.correo || "",
          contraseña: m.algobi?.DID_Voiso?.contraseña || "",
        },
        Voicespin: {
          agent: m.algobi?.Voicespin?.agent || "",
          ext: m.algobi?.Voicespin?.ext || "",
          secret_extension: m.algobi?.Voicespin?.secret_extension || "",
        },
        omni: {
          usuario: m.algobi?.omni?.usuario || "",
          contraseña: m.algobi?.omni?.contraseña || "",
        },
        crm: {
          correo: m.algobi?.crm?.correo || "",
          contraseña: m.algobi?.crm?.contraseña || "",
        },
        winauth: m.algobi?.winauth || "",
      },

      capitalix: {
        teams: m.capitalix?.teams || "",
        correo: m.capitalix?.correo || "",
        contraseña: m.capitalix?.contraseña || "",
        DID_Voiso: {
          correo: m.capitalix?.DID_Voiso?.correo || "",
          contraseña: m.capitalix?.DID_Voiso?.contraseña || "",
        },
        Voicespin: {
          agent: m.capitalix?.Voicespin?.agent || "",
          ext: m.capitalix?.Voicespin?.ext || "",
          secret_extension: m.capitalix?.Voicespin?.secret_extension || "",
        },
        crm: {
          correo: m.capitalix?.crm?.correo || "",
          contraseña: m.capitalix?.crm?.contraseña || "",
        },
        winauth: m.capitalix?.winauth || "",
      },
    };

    return normalized;
  } catch (err) {
    console.error("Error al parsear meta:", err);
    return {
      tradeeu: {
        teams: "",
        correo: "",
        contraseña: "",
        DID_Voiso: { correo: "", contraseña: "" },
        Voicespin: { agent: "", ext: "", secret_extension: "" },
        omni: { usuario: "", contraseña: "" },
        crm: { correo: "", contraseña: "" },
        winauth: "",
      },
      algobi: {
        teams: "",
        correo: "",
        contraseña: "",
        DID_Voiso: { correo: "", contraseña: "" },
        Voicespin: { agent: "", ext: "", secret_extension: "" },
        omni: { usuario: "", contraseña: "" },
        crm: { correo: "", contraseña: "" },
        winauth: "",
      },
      capitalix: {
        teams: "",
        correo: "",
        contraseña: "",
        DID_Voiso: { correo: "", contraseña: "" },
        Voicespin: { agent: "", ext: "", secret_extension: "" },
        crm: { correo: "", contraseña: "" },
        winauth: "",
      },
    };
  }
}

router.post("/register", async (req, res) => {
  try {
    const payload = Array.isArray(req.body) ? req.body : [req.body];

    const pwValues = payload.map((u) => u.pw);
    const duplicates = pwValues.filter((pw, i) => pwValues.indexOf(pw) !== i);
    if (duplicates.length > 0) {
      return res.status(400).json({
        error: `PWs duplicados en el archivo: ${[...new Set(duplicates)].join(", ")}`,
      });
    }

    const existingUsers = await User.findAll({
      where: { pw: pwValues },
      attributes: ["pw"],
    });

    if (existingUsers.length > 0) {
      const existingPWs = existingUsers.map((u) => u.pw);
      return res.status(400).json({
        error: `Ya existen los siguientes PW: ${existingPWs.join(", ")}`,
      });
    }

    const usersToCreate = await Promise.all(
      payload.map(async (user) => {
        const cleanMeta = safeParseMeta(user.meta);

   
        return {
          nombre: user.nombre,
          email: user.email || null,
          password: null,
          rol: user.rol || "user",
          pw: user.pw,
          mustChangePassword: false,
          meta: JSON.stringify(cleanMeta),
        };
      })
    );

    const created = await User.bulkCreate(usersToCreate);

    res.status(201).json({
      message: `Se crearon ${created.length} registro(s) correctamente`,
      users: created,
    });
  } catch (error) {
    console.error("Error al registrar usuario(s):", error);
    res.status(500).json({
      error: error.message || "Error al registrar los usuarios",
    });
  }
});


// Verificar PW después de autenticación Microsoft
router.post("/verify-pw", async (req, res) => {
  try {
    const { pw } = req.body;
    if (!pw) return res.status(400).json({ error: "El campo PW es obligatorio." });

    const user = await User.findOne({ where: { pw } });
    if (!user) return res.status(404).json({ error: "PW no encontrado." });

    //  Si no es admin, no permitir el avance
    if (user.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado: solo los administradores pueden continuar." });
    }

    // Generar token nuevo y devolver rol
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      SECRET_KEY,
      { expiresIn: "8h" }
    );

    res.json({ message: "PW verificado con éxito", rol: user.rol, token });
  } catch (err) {
    console.error("Error en /verify-pw:", err);
    res.status(500).json({ error: "Error interno al verificar PW." });
  }
});



// Get obtiene todos los usuarios ruta protegida
router.get("/", verifyToken, async (req, res) => {
  try {
    if (req.user.rol === "admin") {
      const users = await User.findAll({
        attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
      });

      const parsed = users.map((u) => {
        const data = u.toJSON();
        data.meta = safeParseMeta(data.meta);
        return data;
      });

      return res.json(parsed);
    }

    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const data = user.toJSON();
    data.meta = safeParseMeta(data.meta);

    res.json([data]);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const data = user.toJSON();
    data.meta = safeParseMeta(data.meta);

    res.json(data);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
});

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

router.put("/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.rol !== "admin") {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const { id } = req.params;
    const { nombre, email, rol, pw, img, password, meta } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    let updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre;
    if (email !== undefined) updateData.email = email;
    if (rol !== undefined) updateData.rol = rol;
    if (pw !== undefined) updateData.pw = pw;
    if (img !== undefined) updateData.img = img;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    if (meta !== undefined) {
      const cleanMeta = safeParseMeta(meta);
      updateData.meta = JSON.stringify(cleanMeta);
    }

    await user.update(updateData);

    const updated = await User.findByPk(id, {
      attributes: ["id", "nombre", "email", "rol", "pw", "img", "meta"],
    });

    const data = updated.toJSON();
    data.meta = safeParseMeta(data.meta);

    res.json({ message: "Usuario actualizado", user: data });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

export default router;
