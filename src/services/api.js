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

export const updateUser = async (id, data) => {
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const res = await fetch(`${base}/api/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Error al actualizar usuario");
  }
  return res.json();
};
// Eliminar usuario
export async function deleteUser(id) {
  const token = localStorage.getItem("token");
  const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const url = `${base}/api/user/${id}`;

  console.log("[deleteUser] URL:", url, "Token:", token);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("[deleteUser] Response status:", res.status);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[deleteUser] Error response:", errData);
      throw new Error(errData.error || "Error al eliminar usuario");
    }

    console.log(`[deleteUser] Usuario ${id} eliminado correctamente`);
    return true;
  } catch (err) {
    console.error("[deleteUser] Exception:", err);
    throw err;
  }
}