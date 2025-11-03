import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/navBar";
import Footer from "../components/footer";
import { fetchUserById } from "../services/api";
import mmlogo from "../assets/mmlogo.jpg";

const Credentials = ({ userRole }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUserById(id);

        let meta = data.meta;
        if (typeof meta === "string") {
          try {
            meta = JSON.parse(meta);
          } catch {
            console.warn("No se pudo parsear meta como JSON");
            meta = {};
          }
        }

        // Asegura estructura base
        const normalizedMeta = {
          tradeeu: meta.tradeeu || {},
          ALGOBI: meta.ALGOBI || {},
          CAPITALIX: meta.CAPITALIX || {}
        };

        setUser({
          ...data,
          img: mmlogo,
          meta: normalizedMeta,
          pw: data.pw || ""
        });
      } catch (err) {
        console.error(err);
        alert("Error al cargar credenciales");
        navigate("/home");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!user) return <div className="p-6">Usuario no encontrado</div>;

  const { meta } = user;

  const renderData = (obj) => {
    if (!obj || Object.keys(obj).length === 0)
      return <p className="text-gray-400 text-sm">Sin datos</p>;

    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return (
          <div key={key} className="ml-2 mt-2 border-l pl-2">
            <p className="font-semibold text-gray-800">{key}:</p>
            {renderData(value)}
          </div>
        );
      }
      return (
        <p key={key} className="text-sm">
          <span className="font-medium">{key}:</span> {value || "-"}
        </p>
      );
    });
  };

  return (
    <>
      <NavBar userRole={userRole} />
      <main className="min-h-screen bg-darkgray text-black p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-lg p-6 shadow">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user.img}
              alt={user.nombre}
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h2 className="text-2xl font-bold">{user.nombre}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm">PW: {user.pw}</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4 text-center">
            Credenciales por Marca
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TradeEU */}
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold mb-2 text-center text-blue-700">
                TradeEU
              </h4>
              {renderData(meta.tradeeu)}
            </div>

            {/* ALGOBI */}
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold mb-2 text-center text-green-700">
                ALGOBI
              </h4>
              {renderData(meta.ALGOBI)}
            </div>

            {/* CAPITALIX */}
            <div className="border rounded p-4">
              <h4 className="text-lg font-bold mb-2 text-center text-yellow-700">
                CAPITALIX
              </h4>
              {renderData(meta.CAPITALIX)}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Credentials;
