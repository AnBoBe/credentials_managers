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
        // backend returns fields nombre,email,rol,meta
        setUser({
          ...data,
          img: mmlogo,
          pw: data.meta?.pw || ""
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

  const showBlock = (obj) => {
    // returns true if any value non-empty
    if (!obj) return false;
    return Object.values(obj).some(v => typeof v === "string" ? v.trim() !== "" : (v && typeof v === "object" && showBlock(v)));
  };

  return (
    <>
      <NavBar userRole={userRole} />
      <main className="min-h-screen bg-darkgray text-black p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-6 shadow">
          <div className="flex items-center gap-4 mb-4">
            <img src={user.img} alt={user.nombre} className="w-24 h-24 object-cover rounded" />
            <div>
              <h2 className="text-2xl font-bold">{user.nombre}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm">PW: {user.pw}</p>
            </div>
          </div>

          {/* Iterate groups and render only if data exists */}
          <div className="space-y-4">
            {showBlock(user.meta?.tradeeu) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">tradeeu</h3>
                <p>teams: {user.meta.tradeeu.teams}</p>
                <p>correo: {user.meta.tradeeu.correo}</p>
                <p>contraseña: {user.meta.tradeeu.contraseña}</p>
              </section>
            )}

            {showBlock(user.meta?.DID_Voiso) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">DID (Voiso)</h3>
                <p>correo: {user.meta.DID_Voiso.correo}</p>
                <p>contraseña: {user.meta.DID_Voiso.contraseña}</p>
              </section>
            )}

            {showBlock(user.meta?.Voicespin) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">Voicespin</h3>
                <p>agent: {user.meta.Voicespin.agent}</p>
                <p>ext: {user.meta.Voicespin.ext}</p>
                <p>secret extension: {user.meta.Voicespin.secret_extension}</p>
              </section>
            )}

            {showBlock(user.meta?.omni) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">omni</h3>
                <p>usuario: {user.meta.omni.usuario}</p>
                <p>contraseña: {user.meta.omni.contraseña}</p>
              </section>
            )}

            {showBlock(user.meta?.ALGOBI) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">ALGOBI</h3>
                {user.meta.ALGOBI.teams && <p>teams: {user.meta.ALGOBI.teams}</p>}
                {user.meta.ALGOBI.correo && <p>correo: {user.meta.ALGOBI.correo}</p>}
                {user.meta.ALGOBI.contraseña && <p>contraseña: {user.meta.ALGOBI.contraseña}</p>}
                {user.meta.ALGOBI.DID_Voiso?.correo && <p>DID correo: {user.meta.ALGOBI.DID_Voiso.correo}</p>}
                {user.meta.ALGOBI.DID_Voiso?.contraseña && <p>DID contraseña: {user.meta.ALGOBI.DID_Voiso.contraseña}</p>}
                {user.meta.ALGOBI.omni?.usuario && <p>omni usuario: {user.meta.ALGOBI.omni.usuario}</p>}
              </section>
            )}

            {showBlock(user.meta?.CAPITALIX) && (
              <section className="p-3 border rounded">
                <h3 className="font-bold">CAPITALIX</h3>
                {/* render only non-empty */}
                {user.meta.CAPITALIX.teams && <p>teams: {user.meta.CAPITALIX.teams}</p>}
                {user.meta.CAPITALIX.correo && <p>correo: {user.meta.CAPITALIX.correo}</p>}
                {user.meta.CAPITALIX.contraseña && <p>contraseña: {user.meta.CAPITALIX.contraseña}</p>}
              </section>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Credentials;
