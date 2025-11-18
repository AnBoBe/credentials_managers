import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import Card from "../components/card";
import mmlogo from "../assets/mmlogo.jpg";
import { fetchUsers, createUser } from "../services/api";
import ImportExcelUsers from "../components/importExcelUsers";



const defaultImg = mmlogo;

const Home = ({ userRole, setUserRole }) => {
  const navigate = useNavigate();
  useEffect(() => {
  if (!userRole) {
    navigate("/login", { replace: true });
  }
}, [userRole, navigate]);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
const [form, setForm] = useState({
  nombre: "",
  email: "",
  pw: "",
  rol: "user",
  meta: {
    tradeeu: {
      teams: "",
      correo: "",
      contraseña: "",
      DID_Voiso: { correo: "", contraseña: "" },
      Voicespin: { agent: "", ext: "", secret_extension: "" },
      omni: { usuario: "", contraseña: "" },
      crm: { correo: "", contraseña: "" },
      winauth: "",
    },
    ALGOBI: {
      teams: "",
      correo: "",
      contraseña: "",
      DID_Voiso: { correo: "", contraseña: "" },
      Voicespin: { agent: "", ext: "", secret_extension: "" },
      omni: { usuario: "", contraseña: "" },
      winauth: "",
    },
    CAPITALIX: {
      teams: "",
      correo: "",
      contraseña: "",
      DID_Voiso: { correo: "", contraseña: "" },
      Voicespin: { agent: "", ext: "", secret_extension: "" },
      crm: { correo: "", contraseña: "" },
     
    },
  },
});





  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line
  }, []);

  async function loadUsers() {
    const token = localStorage.getItem("token");
  if (!token) return;  //evita 401 si el usuario ya se deslogueó
    setLoading(true);
    try {
      const data = await fetchUsers(); // requiere token de admin
      const list = data.map(u => ({
        id: u.id,
        nombre: u.nombre,
        email: u.email,
        pw: u.meta?.pw || u.pw || "", 
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

  // Filtrado por nombre o pw
  const filtered = users.filter(user =>
    (user.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.pw || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // funcion de eliminacion de usuario
  const handleDelete = async id => {
    if (!window.confirm("¿Seguro que quieres eliminar este usuario?")) return;
    // llama backend DELETE 
    try {
     await fetch(`${import.meta.env.VITE_API_URL || "http://192.168.1.239:4000"}/api/user/${id}`, {

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

  // Crea el flujo de usuario
  const handleFormChange = (path, value) => {
    
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

  // Validación condicional según el rol
  if (!form.nombre) {
    setError("El nombre es obligatorio");
    return;
  }

  setCreating(true);
  try {
    const payload = {
      nombre: form.nombre,
      email: form.email,
      password: form.password || null,
      rol: form.rol,
      pw: form.pw,
      meta: form.meta,
    };

    await createUser(payload);
    await loadUsers();
    setShowCreate(false);

    // Limpiar formulario
    setForm({
      nombre: "",
      email: "",
      rol: "user",
      pw: "",
      meta: {
        tradeeu: {
          teams: "",
          correo: "",
          contraseña: "",
          DID_Voiso: { correo: "", contraseña: "" },
          Voicespin: { agent: "", ext: "", secret_extension: "" },
          omni: { usuario: "", contraseña: "" },
          winauth: "", 
        },
        ALGOBI: {
          teams: "",
          correo: "",
          contraseña: "",
          DID_Voiso: { correo: "", contraseña: "" },
          Voicespin: { agent: "", ext: "", secret_extension: "" },
          omni: { usuario: "", contraseña: "" },
          winauth: "", 
        },
        CAPITALIX: {
          teams: "",
          correo: "",
          contraseña: "",
          DID_Voiso: { correo: "", contraseña: "" },
          Voicespin: { agent: "", ext: "", secret_extension: "" },
          
        },
      },
    });
  } catch (err) {
    console.error(err);
    setError(err.message || "Error al crear usuario");
  } finally {
    setCreating(false);
  }
};

 

const handleLogout = () => {
  // Eliminar todos los datos locales relacionados con la sesión
  localStorage.removeItem("token");
  localStorage.removeItem("microsoftToken"); //limpiar token de Microsoft
  localStorage.removeItem("userRole");

  
  const tenantId =
    import.meta.env.VITE_MS_TENANT_ID ;

  // Redirección después del cierre de sesión
  const postLogoutRedirect = encodeURIComponent(
    window.location.origin + "/login"
  );

  // URL de cierre de sesión de Microsoft
  const logoutUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/logout?post_logout_redirect_uri=${postLogoutRedirect}`;

  // Redirigir al endpoint de cierre de sesión de Microsoft
  window.location.href = logoutUrl;
};


  return (
    <div className="flex flex-col min-h-screen bg-darkgray">
      <NavBar userRole={userRole} setUserRole={setUserRole} handleLogout={handleLogout} />

      <main className="flex-grow flex flex-col items-center justify-start text-black px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center ">Bienvenido al gestor de contraseñas</h1>

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
          {userRole === "admin" && (
  <ImportExcelUsers onFinish={loadUsers} />
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

            
         <div>
  {/* TRADEEU */}
  <div>
    <h3 className="text-lg font-semibold text-blue-700">tradeeu</h3>

    {/* Teams, correo, contraseña */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
   
      <input
        placeholder="correo"
        value={form.meta.tradeeu.correo}
        onChange={e => handleFormChange("meta.tradeeu.correo", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="contraseña"
        value={form.meta.tradeeu.contraseña}
        onChange={e => handleFormChange("meta.tradeeu.contraseña", e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>

    {/* CRM */}
    <div className="mt-2">
      <h4 className="font-medium">CRM</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input
          placeholder="correo"
          value={form.meta.tradeeu.crm?.correo || ""}
          onChange={e => handleFormChange("meta.tradeeu.crm.correo", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="contraseña"
          value={form.meta.tradeeu.crm?.contraseña || ""}
          onChange={e => handleFormChange("meta.tradeeu.crm.contraseña", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>

    {/* DID (Voiso) */}
    <div className="mt-2">
      <h4 className="font-medium">DID (Voiso)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input
          placeholder="correo"
          value={form.meta.tradeeu.DID_Voiso?.correo || ""}
          onChange={e => handleFormChange("meta.tradeeu.DID_Voiso.correo", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="contraseña"
          value={form.meta.tradeeu.DID_Voiso?.contraseña || ""}
          onChange={e => handleFormChange("meta.tradeeu.DID_Voiso.contraseña", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>

    {/* Voicespin */}
    <div className="mt-2">
      <h4 className="font-medium">Voicespin</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <input
          placeholder="agent"
          value={form.meta.tradeeu.Voicespin?.agent || ""}
          onChange={e => handleFormChange("meta.tradeeu.Voicespin.agent", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="ext"
          value={form.meta.tradeeu.Voicespin?.ext || ""}
          onChange={e => handleFormChange("meta.tradeeu.Voicespin.ext", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="secret extension"
          value={form.meta.tradeeu.Voicespin?.secret_extension || ""}
          onChange={e => handleFormChange("meta.tradeeu.Voicespin.secret_extension", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>

    {/* omni */}
    <div className="mt-2">
      <h4 className="font-medium">omni</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input
          placeholder="usuario"
          value={form.meta.tradeeu.omni?.usuario || ""}
          onChange={e => handleFormChange("meta.tradeeu.omni.usuario", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="contraseña"
          value={form.meta.tradeeu.omni?.contraseña || ""}
          onChange={e => handleFormChange("meta.tradeeu.omni.contraseña", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>
    {/* WinAuth */}
<div className="mt-2">
  <h4 className="font-medium">WinAuth</h4>
  <div className="flex items-center gap-2 mt-2">
    <input
      type="text"
      placeholder="WinAuth"
      value={form.meta.tradeeu.winauth || ""}
      onChange={e => handleFormChange("meta.tradeeu.winauth", e.target.value)}
      className="border px-2 py-1 rounded flex-1"
    />
    
  </div>
</div>

  </div>


 {/* ALGOBI */}
<div className="border p-4 rounded mt-6">
  <h3 className="text-lg font-semibold text-green-700">ALGOBI</h3>

 
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
  
    <input
      placeholder="Correo"
      value={form.meta.ALGOBI.correo}
      onChange={(e) => handleFormChange("meta.ALGOBI.correo", e.target.value)}
      className="border px-2 py-1 rounded"
    />
    <input
      placeholder="Contraseña"
      type="password"
      value={form.meta.ALGOBI.contraseña}
      onChange={(e) => handleFormChange("meta.ALGOBI.contraseña", e.target.value)}
      className="border px-2 py-1 rounded"
    />
  </div>

  {/* DID (Voiso) */}
  <div className="mt-2">
    <h4 className="font-medium">DID (Voiso)</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <input
        placeholder="Correo"
        value={form.meta.ALGOBI.DID_Voiso?.correo || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.DID_Voiso.correo", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={form.meta.ALGOBI.DID_Voiso?.contraseña || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.DID_Voiso.contraseña", e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>
  </div>

  {/* Voicespin */}
  <div className="mt-2">
    <h4 className="font-medium">Voicespin</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
      <input
        placeholder="Agent"
        value={form.meta.ALGOBI.Voicespin?.agent || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.Voicespin.agent", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="PW"
        value={form.meta.ALGOBI.Voicespin?.pw || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.Voicespin.pw", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="Secret Extension"
        value={form.meta.ALGOBI.Voicespin?.secret_extension || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.Voicespin.secret_extension", e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>
  </div>

  {/* Omni */}
  <div className="mt-2">
    <h4 className="font-medium">Omni</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <input
        placeholder="Usuario"
        value={form.meta.ALGOBI.omni?.usuario || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.omni.usuario", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="Contraseña"
        type="password"
        value={form.meta.ALGOBI.omni?.contraseña || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.omni.contraseña", e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>
  </div>

  {/* WinAuth */}
  <div className="mt-2">
    <h4 className="font-medium">WinAuth</h4>
    <div className="flex items-center gap-2 mt-2">
      <input
        type="text"
        placeholder="WinAuth"
        value={form.meta.ALGOBI.winauth || ""}
        onChange={(e) => handleFormChange("meta.ALGOBI.winauth", e.target.value)}
        className="border px-2 py-1 rounded flex-1"
      />
    </div>
  </div>
</div>

  {/* CAPITALIX */}
  <div className="mt-6">
    <h3 className="text-lg font-semibold text-cyan-700">CAPITALIX (opcional)</h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      <h4 className="font-medium">teams</h4>
      <input
        placeholder="correo"
        value={form.meta.CAPITALIX.correo}
        onChange={e => handleFormChange("meta.CAPITALIX.correo", e.target.value)}
        className="border px-2 py-1 rounded"
      />
      <input
        placeholder="contraseña"
        value={form.meta.CAPITALIX.contraseña}
        onChange={e => handleFormChange("meta.CAPITALIX.contraseña", e.target.value)}
        className="border px-2 py-1 rounded"
      />
    </div>

    {/* CRM */}
    <div className="mt-2">
      <h4 className="font-medium">CRM</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input
          placeholder="correo"
          value={form.meta.CAPITALIX.crm?.correo || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.crm.correo", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="contraseña"
          value={form.meta.CAPITALIX.crm?.contraseña || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.crm.contraseña", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>

    {/* DID (Voiso) */}
    <div className="mt-2">
      <h4 className="font-medium">DID (Voiso)</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
        <input
          placeholder="correo"
          value={form.meta.CAPITALIX.DID_Voiso?.correo || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.DID_Voiso.correo", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="contraseña"
          value={form.meta.CAPITALIX.DID_Voiso?.contraseña || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.DID_Voiso.contraseña", e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>
    </div>

    {/* Voicespin */}
    <div className="mt-2">
      <h4 className="font-medium">Voicespin</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
        <input
          placeholder="agent"
          value={form.meta.CAPITALIX.Voicespin?.agent || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.agent", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="ext"
          value={form.meta.CAPITALIX.Voicespin?.ext || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.ext", e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          placeholder="secret extension"
          value={form.meta.CAPITALIX.Voicespin?.secret_extension || ""}
          onChange={e => handleFormChange("meta.CAPITALIX.Voicespin.secret_extension", e.target.value)}
          className="border px-2 py-1 rounded"
        />
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
