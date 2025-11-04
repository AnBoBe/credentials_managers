const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/user`;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Obtener todos los usuarios
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error("No autorizado o error al obtener usuarios");
  return await res.json();
}

// Obtener usuario por ID
export async function fetchUserById(id) {
  const res = await fetch(`${API_BASE}/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error("No autorizado o error al obtener usuario");
  return await res.json();
}

// Crear usuario
export async function createUser(payload) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al crear usuario");
  return data;
}

// Login 
export async function loginUser(pw) {
  const res = await fetch("http://localhost:4000/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pw }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
  return data;
}
