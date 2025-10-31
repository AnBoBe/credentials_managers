import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import Card from "../components/card";
import mmlogo from "../assets/mmlogo.jpg";
import { fetchUsers, createUser } from "../services/api";



const defaultImg = mmlogo;

const Home = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "user",
    // meta structure for all requested groups
    meta: {
      tradeeu: {
        teams: "",
        correo: "",
        contraseña: ""
      },
      DID_Voiso: {
        correo: "",
        contraseña: ""
      },
      Voicespin: {
        agent: "",
        ext: "",
        secret_extension: ""
      },
      omni: {
        usuario: "",
        contraseña: ""
      },
      ALGOBI: {
        teams: "",
        correo: "",
        contraseña: "",
        DID_Voiso: { correo: "", contraseña: "" },
        omni: { usuario: "", contraseña: "" }
      },
      CAPITALIX: {
        teams: "",
        correo: "",
        contraseña: "",
        DID_Voiso: { correo: "", contraseña: "" },
        Voicespin: { agent: "", ext: "", secret_extension: "" },
        omni: { usuario: "", contraseña: "" }
      }
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await fetchUsers(); // requiere token de admin
      // normalize: ensure fields exist
      const list = data.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        pw: u.meta?.pw || u.pw || "", // if backend returns pw inside meta or pw
        meta: u.meta || null,
        img: defaultImg
      }));
      setUsers(list);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  // Filtering by name or pw
  const filtered = users.filter(user =>
    (user.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.pw || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete locally (and ideally call backend delete endpoint)
  const handleDelete = async id => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    // call backend DELETE (needs auth)
    try {
     await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/user/${id}`, {

        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar usuario");
    }
  };

  const handleGo = user => {
    navigate(`/credentials/${user.id}`);
  };

  // Create user flow
  const handleFormChange = (path, value) => {
    // path like "nombre" or "meta.tradeeu.correo"
    if (!path.includes(".")) {
      setForm(prev => ({ ...prev, [path]: value }));
      return;
    }
    const parts = path.split(".");
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!cur[parts[i]]) cur[parts[i]] = {};
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const submitCreate = async () => {
  setError("");
  if (!form.nombre || !form.email || !form.password) {
    setError("Nombre, correo y contraseña son obligatorios");
    return;
  }
  setCreating(true);
  try {
    const payload = {
      nombre: form.nombre,
      email: form.email,
      password: form.password,
      rol: form.rol,
      pw: form.pw, // directo al backend
    };

    await createUser(payload);
    await loadUsers();
    setShowCreate(false);
    setForm({
      nombre: "",
      email: "",
      password: "",
      rol: "user",
      pw: "",
      meta: { ...form.meta },
    });
  } catch (err) {
    console.error(err);
    setError(err.message || "Error al crear usuario");
  } finally {
    setCreating(false);
  }
};


 

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  navigate("/login");
};

  return (
    <div className="flex flex-col min-h-screen bg-darkgray">
      <NavBar userRole={userRole} setUserRole={setUserRole} handleLogout={handleLogout} />



      <main className="flex-grow flex flex-col items-center justify-start text-black px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Bienvenido al gestor de contraseñas</h1>

        <div className="mb-6 w-full max-w-3xl flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o PW..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-400 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />

          {userRole === "admin" && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Crear usuario
            </button>
          )}
        </div>

        <section className="text-gray-600 body-font bg-gray-100 border border-gray-300 rounded-2xl shadow-md w-full max-w-6xl p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap -m-4 justify-center">
              {loading ? (
                <p>Cargando usuarios...</p>
              ) : filtered.length > 0 ? (
                filtered.map(user => (
                  <Card
                    key={user.id}
                    user={user}
                    userRole={userRole}
                    handleDelete={handleDelete}
                    handleGo={handleGo}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 w-full">No se encontraron usuarios.</p>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Modal de creación */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-3xl p-6 overflow-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Crear usuario</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm">Nombre</label>
                <input value={form.nombre} onChange={e => handleFormChange("nombre", e.target.value)} className="w-full border px-2 py-1 rounded" />
              </div>
              <div>
                <label className="block text-sm">Correo</label>
                <input value={form.email} onChange={e => handleFormChange("email", e.target.value)} className="w-full border px-2 py-1 rounded" />
              </div>
              <div>
                <label className="block text-sm">Contraseña</label>
                <input value={form.password} onChange={e => handleFormChange("password", e.target.value)} className="w-full border px-2 py-1 rounded" />
              </div>
              <div>
  <label className="block text-sm font-medium">PW</label>
  <input
    placeholder="Ej: 0019245 (dejar vacío para generar uno)"
    value={form.pw}
    onChange={e => handleFormChange("pw", e.target.value)}
    className="border px-2 py-1 rounded w-full"
  />
</div>


              <div>
                <label className="block text-sm">Rol</label>
                <select value={form.rol} onChange={e => handleFormChange("rol", e.target.value)} className="w-full border px-2 py-1 rounded">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            </div>

            <hr className="my-4" />

            {/* Secciones estáticas solicitadas (mostradas como H2 quemado + campos editables) */}
          <div className="space-y-4">
  <div>
    <h3 className="text-lg font-semibold">tradeeu</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <h4 className="font-medium">teams</h4>
      <input placeholder="correo" value={form.meta.tradeeu.correo} onChange={e => handleFormChange("meta.tradeeu.correo", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="contraseña" value={form.meta.tradeeu.contraseña} onChange={e => handleFormChange("meta.tradeeu.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold">DID (Voiso)</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <input placeholder="correo" value={form.meta.DID_Voiso.correo} onChange={e => handleFormChange("meta.DID_Voiso.correo", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="contraseña" value={form.meta.DID_Voiso.contraseña} onChange={e => handleFormChange("meta.DID_Voiso.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold">Voicespin</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
      <input placeholder="agent" value={form.meta.Voicespin.agent} onChange={e => handleFormChange("meta.Voicespin.agent", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="ext" value={form.meta.Voicespin.ext} onChange={e => handleFormChange("meta.Voicespin.ext", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="secret extension" value={form.meta.Voicespin.secret_extension} onChange={e => handleFormChange("meta.Voicespin.secret_extension", e.target.value)} className="border px-2 py-1 rounded" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold">omni</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <input placeholder="usuario" value={form.meta.omni.usuario} onChange={e => handleFormChange("meta.omni.usuario", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="contraseña" value={form.meta.omni.contraseña} onChange={e => handleFormChange("meta.omni.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold">ALGOBI</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <h4 className="font-medium">teams</h4>
      <input placeholder="correo" value={form.meta.ALGOBI.correo} onChange={e => handleFormChange("meta.ALGOBI.correo", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="contraseña" value={form.meta.ALGOBI.contraseña} onChange={e => handleFormChange("meta.ALGOBI.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
    </div>

    <div className="mt-2">
      <h4 className="font-medium">DID (Voiso)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input placeholder="correo" value={form.meta.ALGOBI.DID_Voiso.correo} onChange={e => handleFormChange("meta.ALGOBI.DID_Voiso.correo", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="contraseña" value={form.meta.ALGOBI.DID_Voiso.contraseña} onChange={e => handleFormChange("meta.ALGOBI.DID_Voiso.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
      </div>
    </div>

    <div className="mt-2">
      <h4 className="font-medium">omni</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input placeholder="usuario" value={form.meta.ALGOBI.omni.usuario} onChange={e => handleFormChange("meta.ALGOBI.omni.usuario", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="contraseña" value={form.meta.ALGOBI.omni.contraseña} onChange={e => handleFormChange("meta.ALGOBI.omni.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
      </div>
    </div>
  </div>

  <div>
    <h3 className="text-lg font-semibold">CAPITALIX (opcional)</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <h4 className="font-medium">teams</h4>
      <input placeholder="correo" value={form.meta.CAPITALIX.correo} onChange={e => handleFormChange("meta.CAPITALIX.correo", e.target.value)} className="border px-2 py-1 rounded" />
      <input placeholder="contraseña" value={form.meta.CAPITALIX.contraseña} onChange={e => handleFormChange("meta.CAPITALIX.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
    </div>

    <div className="mt-2">
      <h4 className="font-medium">DID (Voiso)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input placeholder="correo" value={form.meta.CAPITALIX.DID_Voiso.correo} onChange={e => handleFormChange("meta.CAPITALIX.DID_Voiso.correo", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="contraseña" value={form.meta.CAPITALIX.DID_Voiso.contraseña} onChange={e => handleFormChange("meta.CAPITALIX.DID_Voiso.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
      </div>
    </div>

    <div className="mt-2">
      <h4 className="font-medium">Voicespin</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <input placeholder="agent" value={form.meta.CAPITALIX.Voicespin.agent} onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.agent", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="ext" value={form.meta.CAPITALIX.Voicespin.ext} onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.ext", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="secret extension" value={form.meta.CAPITALIX.Voicespin.secret_extension} onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.secret_extension", e.target.value)} className="border px-2 py-1 rounded" />
      </div>
    </div>

    <div className="mt-2">
      <h4 className="font-medium">omni</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input placeholder="usuario" value={form.meta.CAPITALIX.omni.usuario} onChange={e => handleFormChange("meta.CAPITALIX.omni.usuario", e.target.value)} className="border px-2 py-1 rounded" />
        <input placeholder="contraseña" value={form.meta.CAPITALIX.omni.contraseña} onChange={e => handleFormChange("meta.CAPITALIX.omni.contraseña", e.target.value)} className="border px-2 py-1 rounded" />
      </div>
    </div>
  </div>
</div>


            {error && <p className="text-red-600 mt-3">{error}</p>}

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={submitCreate} className="px-4 py-2 bg-blue-600 text-white rounded">
                {creating ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
