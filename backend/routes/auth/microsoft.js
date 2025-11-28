import express from "express";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config/config.js";

export default function createMicrosoftRouter() {
  const router = express.Router();

  const clientId = process.env.MS_CLIENT_ID;
  const clientSecret = process.env.MS_CLIENT_SECRET;
  const tenantId = process.env.MS_TENANT_ID;

  //  Forzar uso de env vars
  const redirectUri = process.env.MS_REDIRECT_URI;
  const frontendUrl = process.env.FRONTEND_URL;

  if (!redirectUri || !frontendUrl) {
    console.error("Faltan variables de entorno MS_REDIRECT_URI o FRONTEND_URL");
  }

  const authorizeUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const graphUrl = "https://graph.microsoft.com/v1.0/me";

  // Login
  router.get("/login", (req, res) => {
    const url = `${authorizeUrl}?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_mode=query` +
      `&scope=openid profile email User.Read` +
      `&state=12345` +
      `&prompt=select_account`;

    res.redirect(url);
  });

  // Callback
  router.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).json({ error: "Código no recibido" });

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
      if (!tokenData.access_token) {
        return res.status(400).json({ error: "No se obtuvo access token" });
      }

      const graphResponse = await fetch(graphUrl, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      const profile = await graphResponse.json();

      const localToken = jwt.sign(
        {
          name: profile.displayName,
          email: profile.userPrincipalName,
          id: profile.id,
        },
        SECRET_KEY,
        { expiresIn: "8h" }
      );

      //  Redirigir al frontend real
      res.redirect(`${frontendUrl}/login?token=${localToken}`);
    } catch (err) {
      console.error("Error en callback Microsoft:", err);
      res.status(500).json({ error: "Error autenticando con Microsoft" });
    }
  });

  // Verify
  router.get("/verify", (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).json({ error: "Token no proporcionado" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, SECRET_KEY);
      res.json({ valid: true, user: decoded });
    } catch (err) {
      res.status(401).json({ valid: false, error: "Token inválido" });
    }
  });

  // Logout
  router.get("/logout", (req, res) => {
    const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${encodeURIComponent(
      `${frontendUrl}/login`
    )}`;

    res.redirect(logoutUrl);
  });

  return router;
}
