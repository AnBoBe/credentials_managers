// backend/middleware/auth.js
import jwt from "jsonwebtoken";
const SECRET_KEY = "claveultrasecreta"; // misma clave que usas en user.js

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // guardamos los datos del usuario logueado
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido o expirado" });
  }
}
