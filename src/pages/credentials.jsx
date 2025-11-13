import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import mmlogo from "../assets/mmlogo.jpg";
import CopyableField from "../components/copyableField";

const Credentials = ({ userRole, setUserRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirigir si no hay sesión
  useEffect(() => {
    if (!userRole) navigate("/login", { replace: true });
  }, [userRole, navigate]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://192.168.1.239:4000"
          }/api/user/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error al obtener usuario");
        const data = await res.json();

        let meta = data.meta;
        if (typeof meta === "string") {
          try {
            meta = JSON.parse(meta);
          } catch {
            meta = {};
          }
        }

        // ✅ Asegurar compatibilidad de mayúsculas/minúsculas
        const normalizedMeta = {
          tradeeu: meta.tradeeu || meta.TRADEEU || {},
          algobi: meta.algobi || meta.ALGOBI || {},
          capitalix: meta.capitalix || meta.CAPITALIX || {},
        };

        // ✅ Forzar estructura de objetos internos
        const ensureCRM = (crm) => {
          if (!crm || typeof crm !== "object") return { correo: "", contraseña: "" };
          return {
            correo: crm.correo || "",
            contraseña: crm.contraseña || "",
          };
        };

        const completeMeta = {
          tradeeu: {
            teams: normalizedMeta.tradeeu.teams || "",
            correo: normalizedMeta.tradeeu.correo || "",
            contraseña: normalizedMeta.tradeeu.contraseña || "",
            DID_Voiso: normalizedMeta.tradeeu.DID_Voiso || { correo: "", contraseña: "" },
            Voicespin: normalizedMeta.tradeeu.Voicespin || {
              agent: "",
              ext: "",
              secret_extension: "",
            },
            omni: normalizedMeta.tradeeu.omni || { usuario: "", contraseña: "" },
            crm: ensureCRM(normalizedMeta.tradeeu.crm),
            winauth: normalizedMeta.tradeeu.winauth || "",
          },
          algobi: {
            teams: normalizedMeta.algobi.teams || "",
            correo: normalizedMeta.algobi.correo || "",
            contraseña: normalizedMeta.algobi.contraseña || "",
            DID_Voiso: normalizedMeta.algobi.DID_Voiso || { correo: "", contraseña: "" },
            Voicespin: normalizedMeta.algobi.Voicespin || {
              agent: "",
              ext: "",
              secret_extension: "",
            },
            omni: normalizedMeta.algobi.omni || { usuario: "", contraseña: "" },
            // ✅ Forzar siempre crm.algobi a tener correo y contraseña
            crm: ensureCRM(normalizedMeta.algobi.crm),
            winauth: normalizedMeta.algobi.winauth || "",
          },
          capitalix: {
            teams: normalizedMeta.capitalix.teams || "",
            correo: normalizedMeta.capitalix.correo || "",
            contraseña: normalizedMeta.capitalix.contraseña || "",
            DID_Voiso: normalizedMeta.capitalix.DID_Voiso || { correo: "", contraseña: "" },
            Voicespin: normalizedMeta.capitalix.Voicespin || {
              agent: "",
              ext: "",
              secret_extension: "",
            },
            crm: ensureCRM(normalizedMeta.capitalix.crm),
            // 🚫 Sin winauth en Capitalix
          },
        };

        setUser({
          ...data,
          img: mmlogo,
          meta: completeMeta,
          pw: data.pw || "",
        });
      } catch (err) {
        console.error("Error al cargar credenciales:", err);
        alert("Error al cargar credenciales");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!user) return <div className="p-6">Usuario no encontrado</div>;

  const { meta } = user;

  // 🔁 Renderiza los datos recursivamente
  const renderData = (obj) => {
    if (!obj || Object.keys(obj).length === 0)
      return <p className="text-gray-400 text-sm">Sin datos</p>;

    return Object.entries(obj).map(([key, value]) => {
      if (key.toLowerCase() === "teams") return null;

      if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className="ml-2 mt-2 border-l pl-2">
            <p className="font-semibold text-gray-800">{key}:</p>
            {renderData(value)}
          </div>
        );
      }

      const isPassword = /contraseña|secret_extension|winauth/i.test(key);

      return (
        <CopyableField
          key={key}
          label={key}
          value={value}
          type={isPassword ? "password" : "text"}
        />
      );
    });
  };

  return (
    <>
      <NavBar userRole={userRole} setUserRole={setUserRole} />
      <main className="min-h-screen bg-darkgray text-black p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img
                src={user.img}
                alt={user.nombre}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="text-2xl font-bold">{user.nombre}</h2>
                {user.pw && (
                  <div className="text-sm">
                    <span className="font-medium">PW:</span>{" "}
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {user.pw}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Volver atrás
            </button>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-center">
            Credenciales por Marca
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold text-center text-blue-700">
                TradeEU
              </h4>
              {renderData(meta.tradeeu)}
            </div>
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold text-center text-green-700">
                ALGOBI
              </h4>
              {renderData(meta.algobi)}
            </div>
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold text-center text-yellow-700">
                CAPITALIX
              </h4>
              {renderData(meta.capitalix)}
            </div>
          </div>

          {userRole === "admin" && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => navigate(`/edit-credentials/${user.id}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Editar Credenciales
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Credentials;
