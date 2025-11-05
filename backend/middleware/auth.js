import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../config/config.js";

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // guardamos los datos del usuario logueado
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}
