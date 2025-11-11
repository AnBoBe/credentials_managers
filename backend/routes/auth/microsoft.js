import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config.js";

export default function createMicrosoftRouter() {
  const router = express.Router();

  // Leer variables de entorno dentro de la función
  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const redirectUri =
    process.env.MS_REDIRECT_URI || "http://localhost:4000/api/auth/microsoft/callback";
  const tenantId = process.env.MS_TENANT_ID;

  console.log("clientId in route:", clientId);
  console.log("tenantId in route:", tenantId);

  const authorizeUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const graphUrl = "https://graph.microsoft.com/v1.0/me";

  // Ruta de login Microsoft (forzar selección de cuenta)
  router.get("/login", (req, res) => {
    const url = `${authorizeUrl}?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_mode=query` +
      `&scope=openid profile email User.Read` +
      `&state=12345` +
      `&prompt=select_account`; // fuerza que Microsoft pida elegir o iniciar sesión

    console.log("Microsoft login URL:", url);
    res.redirect(url);
  });

  // Callback de autenticación
  router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "Código de autorización no recibido" });

    try {
      const tokenResponse = await fetch(tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = await tokenResponse.json();
      if (!tokenData.access_token) return res.status(400).json({ error: "No se pudo obtener el token" });

      const graphResponse = await fetch(graphUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const profile = await graphResponse.json();

      const localToken = jwt.sign(
        { name: profile.displayName, email: profile.userPrincipalName, id: profile.id },
        SECRET_KEY,
        { expiresIn: "8h" }
      );

      res.redirect(`http://localhost:5173/login?token=${localToken}`);
    } catch (err) {
      console.error("Error en callback Microsoft:", err);
      res.status(500).json({ error: "Error al procesar autenticación Microsoft" });
    }
  });

  // Verificación de token local
  router.get("/verify", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      res.json({ valid: true, user: decoded });
    } catch (err) {
      res.status(401).json({ valid: false, error: "Token inválido o expirado" });
    }
  });

  // Logout de Microsoft
  router.get("/logout", (req, res) => {
    const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(
      "http://localhost:5173/login"
    )}`;
    res.redirect(logoutUrl);
  });

  return router;
}
