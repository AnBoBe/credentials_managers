# MediaMakers — Credentials Manager

A small credentials manager used by MediaMakers. This repository contains a Vite + React frontend and an Express + Sequelize (SQLite) backend with Microsoft OAuth login integration.

**Project structure (important parts)**
- `backend/` — Express API, Sequelize models and database
  - `server.js` — backend entrypoint
  - `database/database.js` — Sequelize setup (SQLite)
  - `models/user.js` — User model
  - `routes/` — API routes (including `auth/microsoft.js` for Microsoft OAuth)
  - `seedAdmin.js` — helper to create a seeded admin user
- `src/` — React frontend (Vite)
  - `main.jsx`, `App.jsx`, `routes/`, `pages/`, `components/`

## Requirements
- Node.js (v14+ recommended)
- npm

## Environment variables
Create a `.env` file in the `backend/` folder (or at project root depending on how you run the backend). The backend loads environment variables via `dotenv`.

Example `.env` (backend):

```
PORT=4000
JWT_SECRET=your_jwt_secret_here
MS_CLIENT_ID=your_microsoft_client_id
MS_CLIENT_SECRET=your_microsoft_client_secret
MS_TENANT_ID=your_tenant_id
MS_REDIRECT_URI=http://localhost:4000/api/auth/microsoft/callback
```

Notes:
- `JWT_SECRET` is used to sign local JWT tokens. If omitted a default `MediaM25*` is used (not secure for production).
- `MS_REDIRECT_URI` defaults in code to `http://localhost:4000/api/auth/microsoft/callback` if not set; ensure this matches the Azure app registration.

Frontend environment (optional):
- `VITE_API_URL` — base URL for the backend API (e.g. `http://localhost:4000`). If not set the app uses `http://192.168.1.239:4000` by default in several files.

## Install & Run

1) Backend

Open a terminal and run:

```powershell
cd backend
npm install
# start with node directly (simple):
node server.js
# or if you have nodemon installed for hot reload:
nodemon server.js
# or use npm script if provided:
npm run dev
```

The backend defaults to port `4000`.

2) Frontend

Open a separate terminal at the repository root:

```powershell
npm install
npm run dev
```

Vite typically serves the frontend at `http://localhost:5173`.

## Database
- The project uses SQLite. The DB file is `backend/database.db` (created automatically by Sequelize/database code).
- Sequelize `sync()` is called from `server.js` and will create tables if missing.
- To seed an admin user, you can run (from `backend/`):

```powershell
node seedAdmin.js
```

(If `seedAdmin.js` requires env vars, ensure `.env` is present or set the required vars.)

## Authentication flow
- The frontend initiates Microsoft login by redirecting to `GET /api/auth/microsoft/login`.
- After Microsoft authorization the backend exchanges the code for tokens and redirects back to the frontend with a locally-signed token (query param `token`).
- The frontend stores the token in `localStorage` (key `microsoftToken` temporarily) and navigates the user to a PW verification flow (`/verify-pw`) where a local PW check is completed.
- After verifying PW, the frontend stores `token` and `userRole` in `localStorage`.

Important files:
- `backend/routes/auth/microsoft.js` — constructs MS OAuth URLs and handles callback.
- `backend/middleware/auth.js` — JWT verify middleware for protected API routes.

## Common commands and useful tips
- Run backend with: `node backend/server.js` (or `cd backend` then `node server.js`).
- Run frontend with: `npm run dev`.
- If CORS or network issues occur, ensure `VITE_API_URL` or hardcoded backend addresses in `src` match your machine's IP/host.
- If you change env vars, restart the backend process.

## Troubleshooting
- 401/403 from API: check that `localStorage.token` exists and is not expired. Frontend sends `Authorization: Bearer <token>` automatically via `api.js`.
- Microsoft OAuth redirect mismatch: ensure the redirect URI configured in Azure matches `MS_REDIRECT_URI` and the backend route `api/auth/microsoft/callback`.
- Database errors: delete `backend/database.db` to reset state (data loss) then restart server; or use `sequelize.sync({ force: true })` temporarily.

## Security notes
- Do not use the default `JWT_SECRET` in production.
- Microsoft client secret and other sensitive values must be kept out of source control.

## Next steps / ideas
- Add Dockerfiles for backend/frontend for easier reproducible runs.
- Add tests for route protection and Microsoft login flow.
- Improve error handling and display friendlier messages on the frontend.

---
If you want, I can also:
- Add a sample `.env.example` file in `backend/`.
- Commit the README and create a simple `backend/.env.example`.
Which of those would you like me to do next?
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
