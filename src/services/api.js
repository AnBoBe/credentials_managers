const API_BASE = `${import.meta.env.VITE_API_URL || "http://192.168.1.239:4000"}/api`;

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ==========================
// USUARIOS
// ==========================

// Obtener todos los usuarios
export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/user`, {
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
  const res = await fetch(`${API_BASE}/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
  });
  if (!res.ok) throw new Error("No autorizado o error al obtener usuario");
  return await res.json();
}

// Crear usuario(s)
export async function createUser(payload) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Error al crear usuario(s)");
  }
  return data;
}

// Login normal
export async function loginUser(pw, password) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pw, password }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");
  return data;
}

// Actualizar usuario
export const updateUser = async (id, data) => {
  const res = await fetch(`${API_BASE}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
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
  const url = `${API_BASE}/user/${id}`;
  console.log("[deleteUser] URL:", url);

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
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


// MICROSOFT LOGIN

export async function verifyMicrosoftLogin(token) {
  const res = await fetch(`${API_BASE}/auth/microsoft/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error verificando autenticación Microsoft");
  return await res.json();
}