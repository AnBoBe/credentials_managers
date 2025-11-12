import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchUserById, updateUser } from "../services/api";
import NavBar from "../components/navBar";
import Footer from "../components/footer";

const EditCredentials = ({ userRole, setUserRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar usuario por ID
  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserById(id);
        let meta = data.meta;
        if (typeof meta === "string") {
          try {
            meta = JSON.parse(meta);
          } catch {
            meta = {};
          }
        }

        const normalizedMeta = {
  tradeeu: meta.tradeeu || {
    teams: "",
    correo: "",
    contraseña: "",
    DID_Voiso: { correo: "", contraseña: "" },
    Voicespin: { agent: "", ext: "", secret_extension: "" },
    omni: { usuario: "", contraseña: "" },
    crm: { correo: "", contraseña: "" },
  },
  ALGOBI: meta.ALGOBI || {
    teams: "",
    correo: "",
    contraseña: "",
    DID_Voiso: { correo: "", contraseña: "" },
    Voicespin: { agent: "", ext: "", secret_extension: "" }, // <-- ADICIÓN
    omni: { usuario: "", contraseña: "" },
    crm: { correo: "", contraseña: "" },
  },
  CAPITALIX: meta.CAPITALIX || {
    teams: "",
    correo: "",
    contraseña: "",
    DID_Voiso: { correo: "", contraseña: "" },
    Voicespin: { agent: "", ext: "", secret_extension: "" },
    crm: { correo: "", contraseña: "" },
  },
};


        setForm({
          id: data.id,
          nombre: data.nombre,
          email: data.email,
          pw: data.pw || "",
          rol: data.rol,
          meta: normalizedMeta,
        });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        alert("Error al cargar usuario");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [id, navigate]);

  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!ref[keys[i]]) ref[keys[i]] = {};
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return { ...updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updateUser(form.id, {
        nombre: form.nombre,
        email: form.email,
        pw: form.pw,
        rol: form.rol,
        meta: form.meta,
      });
      alert("Credenciales actualizadas correctamente");
      navigate(`/credentials/${form.id}`);
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar credenciales");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!form) return <div className="p-6">No se encontró el usuario</div>;

 const renderInputs = (obj, prefix = "") => {
  return Object.entries(obj)
    .filter(([key]) => key !== "teams" && key !== "email")
    .map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return (
          <div key={prefix + key} className="ml-4 border-l pl-3 mt-2">
            <h4 className="font-semibold text-gray-700 mt-2 mb-1">{key}</h4>
            {renderInputs(value, `${prefix}${key}.`)}
          </div>
        );
      }
      return (
        <div key={prefix + key} className="mb-2">
          <label className="block text-sm font-medium text-gray-700">
            {key}
          </label>
          <input
            type="text"
            value={value || ""}
            onChange={(e) =>
              handleChange(`${prefix}${key}`, e.target.value)
            }
            className="w-full border rounded p-2 text-sm"
          />
        </div>
      );
    });
};

  return (
    <>
      <NavBar userRole={userRole} setUserRole={setUserRole} />
      <main className="min-h-screen bg-darkgray text-black p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Editar Credenciales - {form.nombre}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                className="border rounded w-full p-2"
              />
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded p-4">
                <h3 className="text-lg font-bold mb-2 text-center text-blue-700">
                  TradeEU
                </h3>
                {renderInputs(form.meta.tradeeu, "meta.tradeeu.")}
              </div>

              <div className="border rounded p-4">
                <h3 className="text-lg font-bold mb-2 text-center text-green-700">
                  ALGOBI
                </h3>
                {renderInputs(form.meta.ALGOBI, "meta.ALGOBI.")}
              </div>

              <div className="border rounded p-4">
                <h3 className="text-lg font-bold mb-2 text-center text-yellow-700">
                  CAPITALIX
                </h3>
                {renderInputs(form.meta.CAPITALIX, "meta.CAPITALIX.")}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default EditCredentials;
