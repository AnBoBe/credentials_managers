import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyPW = ({ setUserRole }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!pw) {
      setError("Debes ingresar tu PW.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://192.168.1.239:4000/api/user/verify-pw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pw }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al verificar PW");

      // Si el rol no es admin, no continuar
      if (data.rol !== "admin") {
        setError("Acceso denegado: solo los administradores pueden ingresar.");
        return;
      }

      localStorage.setItem("userRole", data.rol);
      localStorage.setItem("token", data.token);
      setUserRole(data.rol);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="text-gray-600 body-font bg-bgb min-h-screen flex items-center justify-center">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center justify-center">
        <div className="bg-gray-100 rounded-lg p-8 flex flex-col w-full sm:w-96 shadow-lg">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5 text-center">
            Verifica tu PW
          </h2>

          <input
            type="password"
            placeholder="Ingresa tu PW"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out mb-4"
          />

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            onClick={handleVerify}
            className="text-white bg-red-700 border-0 py-2 px-8 focus:outline-none hover:bg-red-800 rounded text-lg"
          >
            Continuar
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyPW;
