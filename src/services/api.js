const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/user`;


function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

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


